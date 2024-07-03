import datetime
import queue
from abc import ABC, abstractmethod
from typing import List, Iterator, Iterable, Any
from server.simulation_microservice.server.models.options import Option, OptionChainSnapshot
from server.simulation_microservice.server.models.order_book import OrderBook
from server.simulation_microservice.server.simulation.utils import get_dict_key



class OrderItem:
    def __init__(self, option_at_placement: Option, quantity: int):
        self.option_at_placement = option_at_placement
        self.quantity = quantity
        self.option_at_execution = None


class Order(ABC):

    def __init__(self, order_items: List[OrderItem]):
        self.order_items = order_items
        self.time_placed = datetime.datetime.now()
        self.time_filled = None
        self.status = "Pending"

    def execute(self, snapshot: OptionChainSnapshot):
        if self.status == "Pending":
            self.time_filled = datetime.datetime.now()
            self.status = "Filled"
            for item in self.order_items:
                item.option_at_execution = snapshot.get_option(item.option_at_placement)

        else:
            raise Exception(f"Order cannot be executed. Status is {self.status}")

    def set_cancel_status(self):
        self.status = "Cancelled"

    def set_rejected_status(self):
        self.status = "Rejected"


class MarketOrder(Order):
    def __init__(self, option_order_list: List[OrderItem]):
        super().__init__(option_order_list)


class LimitOrder(Order):
    def __init__(self, option_order_list: List[OrderItem], limit_price: float):
        super().__init__(option_order_list)
        self.limit_price = limit_price


class OrderIterator(Iterator):
    def __init__(self, collection: OrderBook, reverse: bool = False) -> None:
        self._collection = sorted(collection, key=lambda order: order.time_placed, reverse=reverse)
        self._position = 0

    def __next__(self) -> Any:
        try:
            value = self._collection[self._position]
            self._position += 1
        except IndexError:
            raise StopIteration()

        return value
