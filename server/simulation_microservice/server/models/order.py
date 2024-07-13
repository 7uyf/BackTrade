import datetime
from abc import ABC
from typing import List

from server.simulation_microservice.server.models.option import Option, OptionChainSnapshot


class OrderItem:
    def __init__(self, quantity: int, option_at_placement: Option):
        self.quantity = quantity
        self.option_at_placement = option_at_placement
        self.option_at_fulfillment = None


class Order(ABC):

    def __init__(self, order_items: List[OrderItem]):
        self.order_items = order_items
        self.time_placed = datetime.datetime.now()
        self.time_executed = None
        self.status = "Placed"

    def set_filled_status(self, snapshot: OptionChainSnapshot):
        if self.status == "Placed":
            self.time_executed = datetime.datetime.now()
            self.status = "Filled"
            for item in self.order_items:
                item.option_at_execution = snapshot.get_option(item.option_at_placement)

        else:
            raise Exception(f"Order cannot be executed. Status is {self.status}")

    def set_canceled_status(self):
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
