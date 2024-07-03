import datetime

from simulation import DteFile
from pandas import DataFrame
from pydantic import BaseModel
from typing import List, Literal


class Option(BaseModel):
    t_date: datetime.datetime
    stock_symbol: str
    expiration_date: datetime.datetime
    strike: float
    underlying_price: float
    call_put: Literal['C', 'P']
    price_bid: float
    price_ask: float
    size_bid: int
    size_ask: int
    volume: int
    iv: float
    delta: float
    gamma: float
    theta: float
    vega: float
    rho: float

    def __eq__(self, other):
        if isinstance(other, Option):
            return (
                    self.stock_symbol == other.stock_symbol and
                    self.expiration_date == other.expiration_date and
                    self.strike == other.strike and
                    self.call_put == other.call_put
            )
        return False

    @classmethod
    def from_csv_row(cls, row: dict):
        return cls(
            t_date=datetime.datetime.strptime(row['t_date'], "%Y-%m-%d %H:%M:%S"),
            stock_symbol=row['stock_symbol'],
            expiration_date=datetime.datetime.strptime(row['expiration_date'], "%Y-%m-%d"),
            strike=float(row['strike']),
            underlying_price=float(row['price_opt']) if row['price_opt'] else 0.0,
            call_put=row['call_put'],
            price_bid=float(row['price_bid']) if row['price_bid'] else 0.0,
            price_ask=float(row['price_ask']) if row['price_ask'] else 0.0,
            size_bid=int(row['size_bid']) if row['size_bid'] else 0,
            size_ask=int(row['size_ask']) if row['size_ask'] else 0,
            volume=int(row['volume']) if row['volume'] else 0,
            iv=float(row['iv']) if row['iv'] else 0.0,
            delta=float(row['delta']) if row['delta'] else 0.0,
            gamma=float(row['gamma']) if row['gamma'] else 0.0,
            theta=float(row['theta']) if row['theta'] else 0.0,
            vega=float(row['vega']) if row['vega'] else 0.0,
            rho=float(row['rho']) if row['rho'] else 0.0
        )


class OptionChainSnapshot(BaseModel):
    dte_file: DteFile
    options: List[Option]  # replace with df?

    def get_option(self, option: Option) -> Option | None:
        for o in self.options:
            if o == option:
                return o
        return None

    # validate all options rows have the same t_date
