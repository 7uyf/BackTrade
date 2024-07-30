from abc import ABC, abstractmethod
from typing import List, TypeVar, Generic

from server.models.account import AccountSnapshot
from server.models.option import OptionChainSnapshot
from server.models.order import Order

T = TypeVar('T', bound='IObserver')


class IObserver(ABC):
    pass


class BaseDataSubject(ABC, Generic[T]):
    def __init__(self):
        self.observers: List[T] = []

    def register_observer(self, observer: T):
        self.observers.append(observer)

    def remove_observer(self, observer: T):
        self.observers.remove(observer)


class IAccountDataObserver(IObserver):
    @abstractmethod
    def on_account_data_update(self, snapshot: AccountSnapshot):
        pass

    @abstractmethod
    def on_margin_call(self):
        pass


class IOrderManagementObserver(IObserver):
    @abstractmethod
    def on_order_rejected(self, target_order: Order, order_history: List[Order]):
        pass

    @abstractmethod
    def on_order_filled(self, target_order: Order, order_history: List[Order]):
        pass

    @abstractmethod
    def on_order_created(self, target_order: Order, order_history: List[Order]):
        pass

    @abstractmethod
    def on_order_canceled(self, target_order: Order, order_history: List[Order]):
        pass


class IMarketDataObserver(IObserver):
    @abstractmethod
    def on_market_data_update(self, snapshot: OptionChainSnapshot):
        pass

    def on_market_open(self, indicator_pct_data):
        pass

    def on_market_close(self):
        pass


class IAccountDataSubject(BaseDataSubject[IAccountDataObserver]):
    def notify_observers(self, snapshot: AccountSnapshot):
        for observer in self.observers:
            observer.on_account_data_update(snapshot)

    def notify_margin_call(self):
        for observer in self.observers:
            observer.on_margin_call()


class IMarketDataSubject(BaseDataSubject[IMarketDataObserver]):
    def notify_observers(self, snapshot: OptionChainSnapshot):
        for observer in self.observers:
            observer.on_market_data_update(snapshot)

    def notify_market_open(self, indicator_pct_data):
        for observer in self.observers:
            observer.on_market_open(indicator_pct_data)

    def notify_market_close(self):
        for observer in self.observers:
            observer.on_market_close()


class IOrderManagementSubject(BaseDataSubject[IOrderManagementObserver]):
    def notify_observers_order_rejected(self, target_order: Order, order_history: List[Order]):
        for observer in self.observers:
            observer.on_order_rejected(target_order, order_history)

    def notify_observers_order_filled(self, target_order: Order, order_history: List[Order]):
        for observer in self.observers:
            observer.on_order_filled(target_order, order_history)

    def notify_observers_order_created(self, target_order: Order, order_history: List[Order]):
        for observer in self.observers:
            observer.on_order_created(target_order, order_history)

    def notify_observers_order_canceled(self, target_order: Order, order_history: List[Order]):
        for observer in self.observers:
            observer.on_order_canceled(target_order, order_history)
