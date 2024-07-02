from abc import ABC, abstractmethod

from models.options import OptionChainSnapshot


class IMarketDataObserver(ABC):
    @abstractmethod
    async def on_market_data_update(self, snapshot: OptionChainSnapshot):
        pass


class IMarketDataSubject(ABC):
    def __init__(self):
        self.observers = []

    def register_observer(self, observer: IMarketDataObserver):
        self.observers.append(observer)

    async def notify_observers(self, snapshot: OptionChainSnapshot):
        for observer in self.observers:
            observer.on_market_data_update(snapshot)


