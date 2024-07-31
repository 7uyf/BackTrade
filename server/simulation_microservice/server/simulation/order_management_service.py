from typing import List, Tuple

from logs.logger_config import get_class_logger
from server.models.option import OptionChainSnapshot, Option
from server.models.order import Order, LimitOrder, MarketOrder
from server.simulation.margin_account_service import MarginAccountService
from server.simulation.observer_interfaces import IMarketDataObserver, IOrderManagementSubject
from server.simulation.order_book import OrderBook


class OrderManagementService(IOrderManagementSubject, IMarketDataObserver):

    def __init__(self, account_ref: MarginAccountService):
        super().__init__()
        self.__order_book = OrderBook()
        self.__account_ref = account_ref
        self.latest_snapshot = None
        self.__pending_limits = []
        self.logger = get_class_logger(self)

    def is_reserved(self):
        return self.__account_ref.is_reserved()

    @property
    def order_history(self):
        return self.__order_book.get_orders_history()

    def request_final_approval(self):
        # send user order summery and let user approve or reject
        return True

    def create_order_saga(self, orders: List[Tuple[int, Option]], limit=None, auto_fill=False) -> bool:
        success = True
        if self.latest_snapshot:
            self.logger.info(f"Creating order saga with orders: {orders} and limit: {limit}")
            order_ref = self.__order_book.create_order(orders, limit)
            self.notify_observers_order_created(order_ref, self.order_history)
            if self.__account_ref.reserve_funds(order_ref):
                if auto_fill or self.request_final_approval():
                    if isinstance(order_ref, MarketOrder):
                        self._fill_order(order_ref)
                        self.__account_ref.approve_funds()
                    else:
                        if self._limit_price_met(order_ref):
                            self._fill_order(order_ref)
                            self.__account_ref.approve_funds()
                        else:
                            self.logger.info(f"Adding to pending orders: {order_ref}")
                            self.__pending_limits.append(order_ref)
                            self.__account_ref.release_funds()
                else:
                    self.logger.info("User rejected the order")
                    self.__account_ref.release_funds()
                    success = False
            else:
                self._reject_order(order_ref)
                success = False
        else:
            self.logger.warning("Cannot create order saga without market data")
            success = False
        return success

    def on_market_data_update(self, snapshot: OptionChainSnapshot):
        self.logger.debug(f"Received market data update")
        self.latest_snapshot = snapshot
        for order in self.__pending_limits:
            if self._limit_price_met(order):
                self.logger.info(f"Limit price met for order: {order}")
                if self.__account_ref.reserve_funds(order):
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

    def cancel_pending_order(self, order: Order):
        if order in self.__pending_limits:
            self.logger.info(f"Cancelling order {order}")
            self.__pending_limits.remove(order)
            order.set_canceled_status()
            self.notify_observers_order_canceled(order, self.order_history)
        else:
            self.logger.warning(f"Order {order} not found in pending orders")

    def _reject_order(self, order: Order):
        self.logger.info(f"Rejecting order {order}")
        if order in self.__pending_limits:
            self.__pending_limits.remove(order)
        order.set_rejected_status()
        self.notify_observers_order_rejected(order, self.order_history)

    def _fill_order(self, order: Order):
        self.logger.info(f"Filling order: {order}")
        order.set_filled_status(self.latest_snapshot)
        if order in self.__pending_limits:
            self.__pending_limits.remove(order)
        self.notify_observers_order_filled(order, self.order_history)
