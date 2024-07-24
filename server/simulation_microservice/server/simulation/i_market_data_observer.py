from abc import ABC, abstractmethod

from server.models.option import OptionChainSnapshot


class IMarketDataObserver(ABC):
    @abstractmethod
    async def on_market_data_update(self, snapshot: OptionChainSnapshot):
        pass


class IMarketDataSubject(ABC):
    def __init__(self):
        self.observers: list[IMarketDataObserver] = []

    def register_observer(self, observer: IMarketDataObserver):
        self.observers.append(observer)

    def remove_observer(self, observer: IMarketDataObserver):
        self.observers.remove(observer)

    async def notify_observers(self, snapshot: OptionChainSnapshot):
        for observer in self.observers:
            await observer.on_market_data_update(snapshot)


