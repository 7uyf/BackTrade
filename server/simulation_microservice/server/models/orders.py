import datetime
import queue
from abc import ABC, abstractmethod
from typing import List
from server.simulation_microservice.server.models.options import Option, OptionChainSnapshot
from server.simulation_microservice.server.simulation.utils import get_dict_key



class OrderItem:
    def __init__(self, quantity: int, option: Option):
        self.quantity = quantity
        self.option = option

    def get_option(self) -> Option:
        return self.option

    def get_quantity(self) -> int:
        return self.quantity


class Order(ABC):
    """
    This class represents an order.
    an order is made of a dictionary of option order items which contain the option and quantity data.
    an order can be a market order or a limit order, if it's a limit order, the market conditions should be met, but if it's a market order, it should get executed immediately.
    """

    def __init__(self, option_order_list: List[OrderItem]):
        self.option_order_dict = {}
        self.time_placed = datetime.datetime.now()
        self.fill_option_order_dict(option_order_list)

    def fill_option_order_dict(self, option_order_list: List[OrderItem]):
        for item in option_order_list:
            self.option_order_dict[get_dict_key(item.option)] = item

    @abstractmethod
    def meets_market_conditions(self) -> bool:
        pass

    def update_option_order_list(self, snapshot: OptionChainSnapshot):
        for option in snapshot.options:
            if get_dict_key(option) in self.option_order_dict:
                self.option_order_dict[get_dict_key(option)].option = option


class MarketOrder(Order):
    def __init__(self, option_order_list: List[OrderItem]):
        super().__init__(option_order_list)

    def meets_market_conditions(self) -> bool:
        return True


class LimitOrder(Order):

    def __init__(self, option_order_list: List[OrderItem], limit_price: float):
        super().__init__(option_order_list)
        self.limit_price = limit_price

    def meets_market_conditions(self) -> bool:
        return False


class OrderQueueIterator:
    def __init__(self, queue_list):
        self.queue_list = sorted(queue_list, key=lambda x: x[0])  # Sort based on priority
        self.index = 0

    def __next__(self):
        if self.index < len(self.queue_list):
            order = self.queue_list[self.index][1]  # Get the order object
            self.index += 1
            return order
        else:
            raise StopIteration


class OrderPriorityQueue:
    def __init__(self):
        self.pq = queue.PriorityQueue()

    def put(self, order):
        priority = (order.meets_market_conditions(), -order.time_placed.timestamp())
        self.pq.put((priority, order))

    def remove(self, order_to_remove):
        temp_queue = queue.PriorityQueue()
        while not self.pq.empty():
            priority, order = self.pq.get()
            if order != order_to_remove:
                temp_queue.put((priority, order))
        self.pq = temp_queue

    def get(self):
        if not self.pq.empty():
            return self.pq.get()[1]
        return None

    def is_empty(self):
        return self.pq.empty()

    def update_orders(self, snapshot):
        updated_orders = []
        temp_queue = queue.PriorityQueue()
        while not self.pq.empty():
            priority, order = self.pq.get()
            order.update_option_order_list(snapshot)
            updated_orders.append(order)

        for order in updated_orders:
            new_priority = (order.meets_market_conditions(), -order.time_placed.timestamp())
            temp_queue.put((new_priority, order))

        self.pq = temp_queue

    def __iter__(self):
        return OrderQueueIterator(list(self.pq.queue))
