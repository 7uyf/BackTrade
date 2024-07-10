from typing import List, Tuple

from server.simulation_microservice.server.models.option import Option
from server.simulation_microservice.server.models.order import Order, OrderItem, LimitOrder, MarketOrder


class OrderBook:
    def __init__(self):
        self._collection = []

    def create_order(self, orders: List[Tuple[int, Option]], limit=None) -> Order:
        order_items = []
        for order_tuple in orders:
            order_items.append(OrderItem(order_tuple[0], order_tuple[1]))

        if limit is not None:
            limit_order = LimitOrder(order_items, limit)
            self._collection.append(limit_order)

            return limit_order
        else:
            market_order = MarketOrder(order_items)
            self._collection.append(market_order)
            return market_order

    def export_order_history(self):
        # this function will be used to export the order history to a file or database
        return self._collection
