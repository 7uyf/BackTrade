from typing import List, Tuple

from logs.logger_config import get_class_logger
from server.models.option import OptionChainSnapshot, Option
from server.models.order import Order, LimitOrder, MarketOrder
from server.simulation.i_market_data_observer import IMarketDataObserver
from server.simulation.margin_account_service import MarginAccountService
from server.simulation.order_book import OrderBook


class OrderManagementService(IMarketDataObserver):

    def __init__(self, account: MarginAccountService):
        self.order_book = OrderBook()
        self.account = account
        self.latest_snapshot = None
        self.pending_limits = []
        self.logger = get_class_logger(self)

    def create_order_saga(self, orders: List[Tuple[int, Option]], limit=None):
        if self.latest_snapshot:
            self.logger.info(f"Creating order saga with orders: {orders} and limit: {limit}")
            order_ref = self.order_book.create_order(orders, limit)
            if self.account.reserve_funds(order_ref):
                if isinstance(order_ref, MarketOrder):
                    self._fill_order(order_ref)
                    self.account.approve_funds()
                else:
                    if self._limit_price_met(order_ref):
                        self._fill_order(order_ref)
                        self.account.approve_funds()
                    else:
                        self.logger.info(f"Adding to pending orders: {order_ref}")
                        self.pending_limits.append(order_ref)
                        self.account.release_funds()
            else:
                self._reject_order(order_ref)
        else:
            self.logger.warning("Cannot create order saga without market data")

    async def on_market_data_update(self, snapshot: OptionChainSnapshot):
        self.logger.debug(f"Received market data update")
        self.latest_snapshot = snapshot
        for order in self.pending_limits:
            if self._limit_price_met(order):
                self.logger.info(f"Limit price met for order: {order}")
                if self.account.reserve_funds(order):
                    self._fill_order(order)
                else:
                    self._reject_order(order)

    def _limit_price_met(self, order: Order) -> bool:
        if isinstance(order, LimitOrder) and order.limit_price is not None and self.latest_snapshot is not None:
            net_cost = 0.0
            for item in order.order_items:
                option = item.option_at_placement
                market_option = self.latest_snapshot.get_option(option)

                if market_option:
                    if item.quantity > 0:  # Buy order
                        net_cost += market_option.price_ask * item.quantity
                    elif item.quantity < 0:  # Sell order
                        net_cost += market_option.price_bid * item.quantity

            if net_cost > 0:
                return order.limit_price >= net_cost  # Positive net cost (debit)
            else:
                return order.limit_price <= net_cost  # Negative net cost (credit)

        return False

    def _reject_order(self, order: Order):
        self.logger.info(f"Rejecting order {order}")
        if order in self.pending_limits:
            self.pending_limits.remove(order)
        order.set_rejected_status()

    def cancel_pending_order(self, order: Order):
        if order in self.pending_limits:
            self.logger.info(f"Cancelling order {order}")
            self.pending_limits.remove(order)
            order.set_canceled_status()
        else:
            self.logger.warning(f"Order {order} not found in pending orders")

    def _fill_order(self, order: Order):
        self.logger.info(f"Filling order: {order}")
        order.set_filled_status(self.latest_snapshot)
        if order in self.pending_limits:
            self.pending_limits.remove(order)

