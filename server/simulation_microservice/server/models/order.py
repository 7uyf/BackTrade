import datetime
from abc import ABC
from typing import List

from server.models.option import Option, OptionChainSnapshot


class OrderItem:
    def __init__(self, quantity: int, option_at_placement: Option):
        self.quantity = quantity
        self.option_at_placement = option_at_placement
        self.option_at_execution = None

    def __str__(self):
        return f"OrderItem(quantity={self.quantity}, option_at_placement={self.option_at_placement.stock_symbol})"

    def to_dict(self):
        return {
            "quantity": self.quantity,
            "option_at_placement": self.option_at_placement,
            "option_at_execution": self.option_at_execution if self.option_at_execution else None
        }


class Order(ABC):
    def __init__(self, order_items: List[OrderItem]):
        self.order_items = order_items
        self.time_placed = datetime.datetime.now()
        self.time_executed = None
        self.status = "Placed"

    def __str__(self):
        executed_time_str = f", time_executed={self.time_executed}" if self.time_executed else ""
        return f"Order(status={self.status}, time_placed={self.time_placed}{executed_time_str})"

    def to_dict(self):
        return {
            "order_items": [item.__dict__ for item in self.order_items],
            "time_placed": self.time_placed,
            "time_executed": self.time_executed,
            "status": self.status
        }

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

    def __str__(self):
        return f"MarketOrder({super().__str__()})"


class LimitOrder(Order):
    def __init__(self, option_order_list: List[OrderItem], limit_price: float):
        super().__init__(option_order_list)
        self.limit_price = limit_price

    def __str__(self):
        return f"LimitOrder(limit_price={self.limit_price}, {super().__str__()})"
