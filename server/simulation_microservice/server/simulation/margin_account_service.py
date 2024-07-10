import copy
from typing import Dict, Optional

from server.simulation_microservice.server.models.option import OptionChainSnapshot
from server.simulation_microservice.server.models.order import Order
from server.simulation_microservice.server.models.position import Position
from server.simulation_microservice.server.simulation.i_market_data_observer import IMarketDataObserver
from server.simulation_microservice.server.simulation.portfolio import Portfolio
from server.simulation_microservice.server.simulation.utils import get_dict_key


class Reservation:
    def __init__(self, order: Order, hypothetical_positions: Dict, hypothetical_margin_requirement: float,
                 hypothetical_net_value: float):
        self.order = order
        self.hypothetical_positions = hypothetical_positions
        self.hypothetical_margin_requirement = hypothetical_margin_requirement
        self.hypothetical_net_value = hypothetical_net_value


class MarginAccountService(IMarketDataObserver):
    def __init__(self, initial_capital: float):
        super().__init__()
        self.portfolio = Portfolio()
        self.maintenance_margin = 0.0
        self.net_value = initial_capital
        self.latest_snapshot = None
        self.reservation: Optional[Reservation] = None

    async def on_market_data_update(self, snapshot: OptionChainSnapshot):
        self.latest_snapshot = snapshot
        self.portfolio.update_positions_with_latest_market_data(snapshot)
        self.net_value += self.portfolio.get_latest_daily_pnl()
        if self.net_value < self.maintenance_margin:
            self.margin_call()

    def margin_call(self):
        # Implement margin call logic
        pass

    def reserve_funds(self, order: Order):
        if self.latest_snapshot:
            hypothetical_filled_order = self.get_hypothetical_filled_order(order)
            hypothetical_positions = self.get_hypothetical_positions(hypothetical_filled_order,
                                                                     self.portfolio.positions)
            hypothetical_margin_requirement = self.calc_margin_requirement(hypothetical_positions)
            order_cost = self.calc_positions_value(hypothetical_positions) - self.calc_positions_value(
                self.portfolio.positions)
            hypothetical_net_value = self.net_value - order_cost

            if hypothetical_net_value > hypothetical_margin_requirement:
                self.reservation = Reservation(
                    order,
                    hypothetical_positions,
                    hypothetical_margin_requirement,
                    hypothetical_net_value
                )
                return True

        return False

    def release_funds(self):
        self.reservation = None

    def approve_funds(self):
        self.portfolio.set_positions(self.reservation.hypothetical_positions)
        self.net_value = self.reservation.hypothetical_net_value
        self.maintenance_margin = self.reservation.hypothetical_margin_requirement
        self.reservation = None

    def get_hypothetical_filled_order(self, order: Order) -> Order:
        order_copy = copy.deepcopy(order)
        if self.latest_snapshot:
            order_copy.set_filled_status(self.latest_snapshot)
        return order_copy

    @staticmethod
    def calc_positions_value(positions: dict) -> float:
        total_value = 0.0
        for position in positions.values():
            total_value += position.latest_market_value
        return total_value

    @staticmethod
    def get_hypothetical_positions(order: Order, positions) -> Dict:
        positions_copy = copy.deepcopy(positions)
        for order_item in order.order_items:
            key = get_dict_key(order_item.option_at_placement)
            if key in positions_copy:
                positions_copy[key].update_position_balance(order_item)
            else:
                positions_copy[key] = Position(order_item)

        return positions_copy

    @staticmethod
    def calc_margin_requirement(positions: dict) -> float:
        # make it more SOLID
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

        # Handle short puts
        for short_put, short_price in short_puts_sorted:
            matched = False
            for long_put, long_price in long_puts_sorted:
                if long_put.expiration_date <= short_put.expiration_date:
                    if short_put.strike >= long_put.strike:
                        credit_premium = short_price + long_price
                        total_put_margin += (short_put.strike - long_put.strike) * multiplier - credit_premium
                        matched = True
                        break
                    else:
                        debit_premium = long_price + short_price
                        total_put_margin += debit_premium
                        matched = True
                        break
            if not matched:
                total_put_margin += 44000  # Unmatched short put

        # Handle unmatched long puts
        for long_put, long_price in long_puts_sorted:
            if long_put not in [lp[0] for lp in long_puts_sorted]:
                total_put_margin += long_price

        # Handle short calls
        for short_call, short_price in short_calls_sorted:
            matched = False
            for long_call, long_price in long_calls_sorted:
                if long_call.expiration_date <= short_call.expiration_date:
                    if long_call.strike > short_call.strike:
                        credit_premium = short_price + long_price
                        total_call_margin += (long_call.strike - short_call.strike) * multiplier - credit_premium
                        matched = True
                        break
                    else:
                        debit_premium = long_price - short_price
                        total_call_margin += debit_premium
                        matched = True
                        break
            if not matched:
                total_call_margin += 44000  # Unmatched short call

        # Handle unmatched long calls
        for long_call, long_price in long_calls_sorted:
            if long_call not in [lc[0] for lc in long_calls_sorted]:
                total_call_margin += long_price

        max_margin = max(total_put_margin, total_call_margin)
        return max_margin
