import datetime
from typing import List, Literal

from pydantic import BaseModel

from server.simulation_microservice.server.models.simulation import DteFile


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

    def to_dict(self):
        return {
            "t_date": self.t_date.isoformat(),
            "stock_symbol": self.stock_symbol,
            "expiration_date": self.expiration_date.isoformat(),
            "strike": self.strike,
            "underlying_price": self.underlying_price,
            "call_put": self.call_put,
            "price_bid": self.price_bid,
            "price_ask": self.price_ask,
            "iv": self.iv,
            "delta": self.delta,
            "gamma": self.gamma,
            "theta": self.theta,
            "vega": self.vega,
        }

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

    def get_option(self, option: Option) -> Option | None:
        for o in self.options:
            if o == option:
                return o
        return None

    def to_dict(self):
        return {
            "dte_file": {
                "file_url": self.dte_file.file_url,
                "today_date": self.dte_file.today_date.isoformat(),
                "stock_symbol": self.dte_file.stock_symbol,
                "expiration_date": self.dte_file.expiration_date.isoformat(),
                "dte": self.dte_file.dte,
            },
            "options": [option.to_dict() for option in self.options],
        }
    # validate all options rows have the same t_date
