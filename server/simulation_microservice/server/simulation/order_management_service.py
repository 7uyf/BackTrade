from typing import List, Tuple

from server.simulation_microservice.server.models.option import OptionChainSnapshot, Option
from server.simulation_microservice.server.models.order import Order, LimitOrder, MarketOrder
from server.simulation_microservice.server.simulation.i_market_data_observer import IMarketDataObserver
from server.simulation_microservice.server.simulation.margin_account_service import MarginAccountService
from server.simulation_microservice.server.simulation.order_book import OrderBook


class OrderManagementService(IMarketDataObserver):

    def __init__(self, account: MarginAccountService):
        self.order_book = OrderBook()
        self.account = account
        self.latest_snapshot = None
        self.pending_limits = []

    def create_order_saga(self, orders: List[Tuple[int, Option]], limit=None):
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
                    self.pending_limits.append(order_ref)
                    self.account.release_funds()
        else:
            self._reject_order(order_ref)

    async def on_market_data_update(self, snapshot: OptionChainSnapshot):
        self.latest_snapshot = snapshot
        for order in self.pending_limits:
            if self._limit_price_met(order):
                if self.account.reserve_funds(order):
                    self._fill_order(order)
                else:
                    self._reject_order(order)

    def _limit_price_met(self, order: Order) -> bool:
        if isinstance(order, LimitOrder) and order.limit_price is not None and self.latest_snapshot is not None:
            # implement logic to calculate if the limit price is met
            return True
        return False

    def _reject_order(self, order: Order):
        if order in self.pending_limits:
            self.pending_limits.remove(order)
        order.set_rejected_status()

    def _cancel_order(self, order: Order):
        if order in self.pending_limits:
            self.pending_limits.remove(order)
        order.set_canceled_status()

    def _fill_order(self, order: Order):
        order.set_filled_status(self.latest_snapshot)
        if order in self.pending_limits:
            self.pending_limits.remove(order)
