from typing import Iterable, List, Any

from server.simulation_microservice.server.models.options import OptionChainSnapshot
from server.simulation_microservice.server.models.orders_new import Order, OrderIterator, MarketOrder
from server.simulation_microservice.server.simulation.i_market_data_observer import IMarketDataObserver


class AccountManager:
    def __init__(self, initial_capital: float):
        self.cash = initial_capital

    def check_margin_requirement(self, order: Order) -> bool:
        pass


class OrderBook(Iterable):
    def __init__(self, collection: List[Order] | None = None) -> None:
        self._collection = collection or []
        self._history = []

    def __getitem__(self, index: int) -> Any:
        return self._collection[index]

    def __iter__(self) -> OrderIterator:
        return OrderIterator(self)

    def add_order(self, order: Order) -> None:
        self._collection.append(order)

    def remove(self, order: Order) -> None:
        self._collection.remove(order)

    def get_history(self) -> List[Order]:
        return self._history


class TransactionManager(IMarketDataObserver):

    def __init__(self, account_manager: AccountManager):
        self.order_book = OrderBook()
        self.account_manager = account_manager
        self.latest_snapshot = None

    async def place_order(self, order: Order):
        if self.account_manager.check_margin_requirement(order):
            self.order_book.add_order(order)
            self.process_order_book()
        else:
            print("order placement rejected due to margin requirement")

    async def on_market_data_update(self, snapshot: OptionChainSnapshot):
        self.latest_snapshot = snapshot

    @staticmethod
    def limit_price_met(order: Order, snapshot: OptionChainSnapshot) -> bool:
        # implement limit price met logic
        pass

    def cancel_order(self, order: Order):
        self.order_book.remove(order)

    def process_order_book(self):
        if self.latest_snapshot is not None:
            for order in self.order_book:
                if isinstance(order, MarketOrder) or self.limit_price_met(order, self.latest_snapshot):
                    if self.account_manager.check_margin_requirement(order):
                        order.execute(self.latest_snapshot)
