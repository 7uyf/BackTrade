import copy
from typing import Dict, Optional

from logs.logger_config import get_class_logger
from server.models.account import AccountSnapshot
from server.models.option import OptionChainSnapshot
from server.models.order import Order
from server.models.position import Position
from server.simulation.observer_interfaces import IAccountDataSubject
from server.simulation.observer_interfaces import IMarketDataObserver
from server.simulation.portfolio import Portfolio
from server.simulation.utils import get_dict_key


class MarginAccountService(IAccountDataSubject, IMarketDataObserver):
    class Reservation:
        def __init__(self, order: Order, hypothetical_positions: Dict, hypothetical_margin_requirement: float,
                     hypothetical_net_value: float):
            self.order = order
            self.hypothetical_positions = hypothetical_positions
            self.hypothetical_margin_requirement = hypothetical_margin_requirement
            self.hypothetical_net_value = hypothetical_net_value

    def __init__(self, initial_capital: float):
        super().__init__()
        self.__portfolio = Portfolio()
        self.__maintenance_margin = 0.0
        self.__net_value = initial_capital
        self.__latest_snapshot = None
        self.__last_pnl = 0
        self.__reservation: Optional[MarginAccountService.Reservation] = None
        self.logger = get_class_logger(self)

    def is_reserved(self):
        return self.__reservation is not None

    @property
    def net_value(self):
        return self.__net_value

    @property
    def maintenance_margin(self):
        return self.__maintenance_margin

    @property
    def positions(self):
        return self.__portfolio.positions

    @property
    def aggregated_pnl(self):
        return self.__portfolio.get_aggregated_pnl()

    @property
    def aggregated_greeks(self):
        return self.__portfolio.get_aggregated_greeks()

    @property
    def account_snapshot(self):
        return AccountSnapshot.from_margin_account_service(self)

    def on_market_data_update(self, snapshot: OptionChainSnapshot):
        self.logger.debug(f"Received market data update")
        self.__latest_snapshot = snapshot
        self.__portfolio.update_positions_with_latest_market_data(snapshot)

        change = self.__portfolio.get_aggregated_pnl() - self.__last_pnl
        self.__net_value = self.__net_value + change
        self.__last_pnl = self.__portfolio.get_aggregated_pnl()

        if self.__net_value < self.__maintenance_margin:
            self._margin_call()
        else:
            self.notify_observers(self.account_snapshot)

    def reserve_funds(self, order: Order):
        if self.__reservation is not None:
            self.logger.warning(
                f"a reservation is already in place for order {self.__reservation.order} approve or release first before reserving funds for another order")
            return False
        if self.__latest_snapshot is None:
            self.logger.debug(f"Cannot reserve funds without market data")
            return False

        hypothetical_filled_order = self._get_hypothetical_filled_order(order)
        hypothetical_positions = self._get_hypothetical_positions(hypothetical_filled_order,
                                                                  self.__portfolio.positions)
        hypothetical_margin_requirement = self._calc_margin_requirement(hypothetical_positions)
        order_cost = self._calc_positions_value(hypothetical_positions) - self._calc_positions_value(
            self.__portfolio.positions)
        hypothetical_net_value = self.__net_value - order_cost
        self.logger.debug(
            f"order cost: {order_cost}, hypothetical margin requirement: {hypothetical_margin_requirement}, hypothetical net value: {hypothetical_net_value}")
        if hypothetical_net_value > hypothetical_margin_requirement:
            self.logger.debug(f"Reserving funds for order {order}")
            self.__reservation = MarginAccountService.Reservation(
                order,
                hypothetical_positions,
                hypothetical_margin_requirement,
                hypothetical_net_value
            )
            return True
        else:
            self.logger.debug(f"Insufficient funds to reserve for order {order}")
            return False

    def release_funds(self):
        if self.__reservation is None:
            self.logger.warning("No __reservation to release")
        else:
            self.logger.debug(f"Releasing funds for order {self.__reservation.order}")
            self.__reservation = None

    def approve_funds(self):
        if self.__reservation is None:
            self.logger.warning("No reservation to approve")
        else:
            self.logger.debug(f"Approving funds for order {self.__reservation.order}")

            # Remove positions with quantity 0
            self.__reservation.hypothetical_positions = {key: position for key, position in
                                                         self.__reservation.hypothetical_positions.items() if
                                                         position.quantity != 0}

            # Update portfolio positions
            self.__portfolio.positions = self.__reservation.hypothetical_positions
            self.__net_value = self.__reservation.hypothetical_net_value
            self.__maintenance_margin = self.__reservation.hypothetical_margin_requirement

            self.notify_observers(self.account_snapshot)
            self.__reservation = None

    def _margin_call(self):
        self.logger.info("Margin call triggered")
        # logic to handle margin call
        self.notify_observers(self.account_snapshot)
        self.notify_margin_call()
        raise NotImplementedError("Margin call not implemented")

    def _get_hypothetical_filled_order(self, order: Order) -> Order:
        order_copy = copy.deepcopy(order)
        if self.__latest_snapshot:
            order_copy.set_filled_status(self.__latest_snapshot)
        return order_copy

    @staticmethod
    def _calc_positions_value(positions: dict) -> float:
        total_value = 0.0
        for position in positions.values():
            total_value += position.latest_market_value
        return total_value

    @staticmethod
    def _get_hypothetical_positions(order: Order, positions) -> Dict:
        positions_copy = copy.deepcopy(positions)
        for order_item in order.order_items:
            key = get_dict_key(order_item.option_at_placement)
            if key in positions_copy:
                positions_copy[key].update_position_balance(order_item)
                positions_copy[key].updates_position_stats(order_item.option_at_execution)
            else:
                positions_copy[key] = Position(order_item)

        return positions_copy

    @staticmethod
    def _calc_margin_requirement(positions: dict) -> float:
        # make more SOLID
        multiplier = 100
        long_puts = []
        short_puts = []
        long_calls = []
        short_calls = []

        for position in positions.values():
            option_type = position.latest_option_data.call_put
            for price in position.premiums:
                option_with_price = (position.latest_option_data, price)
                if option_type == "P":
                    if position.quantity > 0:
                        long_puts.append(option_with_price)
                    else:
                        short_puts.append(option_with_price)
                else:
                    if position.quantity > 0:
                        long_calls.append(option_with_price)
                    else:
                        short_calls.append(option_with_price)

        long_puts_sorted = sorted(long_puts, key=lambda x: x[0].expiration_date)
        short_puts_sorted = sorted(short_puts, key=lambda x: x[0].expiration_date)
        long_calls_sorted = sorted(long_calls, key=lambda x: x[0].expiration_date)
        short_calls_sorted = sorted(short_calls, key=lambda x: x[0].expiration_date)

        total_put_margin = 0
        total_call_margin = 0

        matched_long_puts = set()
        matched_long_calls = set()

        # Handle short puts
        for short_put, short_price in short_puts_sorted:
            matched = False
            for long_put, long_price in long_puts_sorted:
                if long_put in matched_long_puts:
                    continue
                if long_put.expiration_date <= short_put.expiration_date:
                    if short_put.strike >= long_put.strike:
                        credit_premium = short_price + long_price
                        total_put_margin += (short_put.strike - long_put.strike) * multiplier - credit_premium
                        matched_long_puts.add(long_put)
                        matched = True
                        break
                    else:
                        debit_premium = long_price + short_price
                        total_put_margin += debit_premium
                        matched_long_puts.add(long_put)
                        matched = True
                        break
            if not matched:
                total_put_margin += 44000  # Unmatched short put

        # Handle unmatched long puts
        for long_put, long_price in long_puts_sorted:
            if long_put not in matched_long_puts:
                total_put_margin += long_price

        # Handle short calls
        for short_call, short_price in short_calls_sorted:
            matched = False
            for long_call, long_price in long_calls_sorted:
                if long_call in matched_long_calls:
                    continue
                if long_call.expiration_date <= short_call.expiration_date:
                    if long_call.strike > short_call.strike:
                        credit_premium = short_price + long_price
                        total_call_margin += (long_call.strike - short_call.strike) * multiplier - credit_premium
                        matched_long_calls.add(long_call)
                        matched = True
                        break
                    else:
                        debit_premium = long_price - short_price
                        total_call_margin += debit_premium
                        matched_long_calls.add(long_call)
                        matched = True
                        break
            if not matched:
                total_call_margin += 44000  # Unmatched short call

        # Handle unmatched long calls
        for long_call, long_price in long_calls_sorted:
            if long_call not in matched_long_calls:
                total_call_margin += long_price

        max_margin = max(total_put_margin, total_call_margin)
        return max_margin
