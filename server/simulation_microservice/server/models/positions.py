from typing import Dict

from server.simulation_microservice.server.models.options import Option, OptionChainSnapshot
from server.simulation_microservice.server.models.orders import OrderItem, Order
from server.simulation_microservice.server.simulation.utils import get_dict_key


class Position:
    """
    this object is used to represent a position in the portfolio.
    option is the option object that the position is based on, it's data should be updated on every market data update. that data includes the bid/ask prices, greeks, etc.
    quantity is the number of contracts in the position, negative quantity means short position.
    premium is the total premium paid/received for the position. the premium is calculated as the average price of the contracts in the position.
    market_value is the current market value of the position.
    daily_pnl is the daily profit/loss of the position. it is calculated as the difference between the market value and the premium.
    """

    def __init__(self, option_order_item: OrderItem):
        self.option = option_order_item.option
        self.quantity = option_order_item.quantity
        self.premium = (self.option.price_bid + self.option.price_ask) / 2 * self.quantity
        self.avg_price = self.premium / self.quantity
        self.market_value = self.premium
        self.daily_pnl = 0.0

    def update_position_balance(self, option_order_item: OrderItem):
        self.quantity += option_order_item.quantity
        self.premium += (
                                option_order_item.option.price_bid + option_order_item.option.price_ask) / 2 * option_order_item.option.quantity
        self.avg_price = self.premium / self.quantity

    def updates_position_stats(self, latest_option_data: Option):
        self.option = latest_option_data
        self.market_value = (latest_option_data.price_bid + latest_option_data.price_ask) / 2 * self.quantity
        self.daily_pnl = self.market_value - self.premium


class Positions:
    def __init__(self):
        self.positions: Dict[str, Position] = {}

    def get_hypothetical_positions(self, order: Order) -> Dict[str, Position]:
        """
        Returns a hypothetical positions dictionary after applying the order.
        """
        positions_copy = self.positions.copy()
        for option_order_item in order.option_order_dict.values():
            key = get_dict_key(option_order_item.option)
            if key in positions_copy:
                positions_copy[key].update_position_balance(option_order_item)
            else:
                positions_copy[key] = Position(option_order_item)

        return positions_copy

    def rebalance_positions(self, order: Order):
        """
        Rebalances the positions based on the given order.
        """
        for option_order_item in order.option_order_dict.values():
            key = get_dict_key(option_order_item.option)
            if key in self.positions:
                self.positions[key].update_position_balance(option_order_item)
            else:
                self.positions[key] = Position(option_order_item)

    def update_positions_with_snapshot(self, snapshot: OptionChainSnapshot):
        """
        Updates the positions with the latest market data from the snapshot.
        """
        for position in self.positions.values():
            for option in snapshot.options:
                if option.id == position.option.id:  # Assuming Option has an 'id' attribute for identification
                    position.updates_position_stats(option)
                    break