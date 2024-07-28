from typing import List, Tuple

from logs.logger_config import get_class_logger
from server.models.option import Option
from server.models.order import Order, LimitOrder, OrderItem, MarketOrder


class OrderBook:
    def __init__(self):
        self._collection = []
        self.logger = get_class_logger(self)

    def create_order(self, orders: List[Tuple[int, Option]], limit=None) -> Order:
        order_items = []
        for order_tuple in orders:
            order_items.append(OrderItem(order_tuple[0], order_tuple[1]))

        if limit is not None:
            limit_order = LimitOrder(order_items, limit)
            self._collection.append(limit_order)
            self.logger.debug(f"Created order: {limit_order}")
            return limit_order
        else:
            market_order = MarketOrder(order_items)
            self._collection.append(market_order)
            self.logger.debug(f"Created order: {market_order}")
            return market_order

    def get_orders_history(self) -> List[Order]:
        return self._collection
