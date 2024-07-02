from typing import List

from models.options import OptionChainSnapshot
from models.orders import Order
from models.positions import Position, Positions
from simulation.i_market_data_observer import IMarketDataObserver
from simulation.utils import get_dict_key


# TODO: # Implement margin requirement check logic
# TODO: # Implement margin calculation logic

class PortfolioManager(IMarketDataObserver):
    def __init__(self, initial_capital: float):
        self.cash = initial_capital
        self.positions = Positions()
        self.maintenance_margin = 0.0
        self.latest_snapshot = None

    async def on_market_data_update(self, snapshot: OptionChainSnapshot):
        """
        since this class is an observer of the market data, this function is called on every market data update.
        it updates the portfolio with the latest market data, so it could calculate the current values of the portfolio (PnL,greeks, etc.).
        it also reports the portfolio to the margin manager.
        """
        self.latest_snapshot = snapshot
        self.positions.update_positions_with_snapshot(snapshot)

    def meets_margin_requirement(self, order: Order) -> bool:
        hypothetical_positions = self.positions.get_hypothetical_positions(order)
        return True

    def re_balance_positions(self, order: Order):
        self.positions.rebalance_positions(order)

    @staticmethod
    def calc_margin_requirement(positions: dict) -> float:
        """
        this function calculates the margin requirement for a given list of positions.
        """
        return 0.0

    @staticmethod
    def calc_positions(order: Order, positions: dict) -> dict:
        """
        this function should be called when a new order is executed. it adds the position to the portfolio, and updates the portfolio balance.
        if a position with the same option details already exists, it will update the position balance (ie quantity, premium, avg_price).
        else it will create a new position.
        """
        positions_copy = positions.copy()
        for option_order_item in order.option_order_dict.values():
            key = get_dict_key(option_order_item.option)
            if key in positions_copy:
                positions_copy[key].update_position_balance(option_order_item)
            else:
                positions_copy[key] = Position(option_order_item)

        return positions_copy
