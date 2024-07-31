import datetime
from collections import deque
from typing import List, Literal, Optional, Dict

from pydantic import BaseModel

from server.models.simulation import DteFile


class Option(BaseModel):
    t_date: datetime.datetime
    stock_symbol: str
    expiration_date: datetime.datetime
    strike: float
    underlying_price: float
    call_put: Literal['C', 'P']
    price_bid: float
    price_ask: float
    iv: float
    delta: float
    gamma: float
    theta: float
    vega: float

    def __eq__(self, other):
        if isinstance(other, Option):
            return (
                    self.stock_symbol == other.stock_symbol and
                    self.expiration_date == other.expiration_date and
                    self.strike == other.strike and
                    self.call_put == other.call_put
            )
        return False

    def __hash__(self):
        return hash((self.stock_symbol, self.expiration_date, self.strike, self.call_put))

    def __str__(self):
        return f"Option(symbol={self.stock_symbol}, dte={self.expiration_date.strftime('%Y-%m-%d')}, strike={self.strike}, right={self.call_put})"

    @classmethod
    def from_csv_row(cls, row: dict):
        return cls(
            t_date=datetime.datetime.strptime(row['t_date'], "%Y-%m-%d %H:%M:%S"),
            stock_symbol=row['stock_symbol'],
            expiration_date=datetime.datetime.strptime(row['expiration_date'], "%Y-%m-%d %H:%M:%S"),
            strike=float(row['strike']),
            underlying_price=float(row['price_opt']) if row['price_opt'] else 0.0,
            call_put=row['call_put'],
            price_bid=float(row['price_bid']) if row['price_bid'] else 0.0,
            price_ask=float(row['price_ask']) if row['price_ask'] else 0.0,
            iv=float(row['iv']) if row['iv'] else 0.0,
            delta=float(row['delta']) if row['delta'] else 0.0,
            gamma=float(row['gamma']) if row['gamma'] else 0.0,
            theta=float(row['theta']) if row['theta'] else 0.0,
            vega=float(row['vega']) if row['vega'] else 0.0,
        )


class OptionChainSnapshot(BaseModel):
    dte_file: DteFile
    options: List[Option] = []  # replace with df?

    def get_option(self, option: Option) -> Option :
        for o in self.options:
            if o == option:
                return o
        return None


class OptionChainSnapshotTimeSeries(BaseModel):
    snapshots: "deque[OptionChainSnapshot]"

    def __init__(self, window_size: int):
        super().__init__(snapshots=deque(maxlen=window_size))

    def add_snapshot(self, snapshot: OptionChainSnapshot):
        self.snapshots.append(snapshot)

    def get_latest_snapshot(self) -> Optional[OptionChainSnapshot]:
        if not self.snapshots:
            return None
        return max(self.snapshots, key=lambda s: s.dte_file.today_date)

    def get_options_over_time(self, option: Option) -> List[Dict]:
        option_data = []
        for snapshot in self.snapshots:
            opt = snapshot.get_option(option)
            if opt:
                option_data.append({
                    "date": snapshot.dte_file.today_date,
                    "option_data": opt.__dict__,
                })
        return option_data
