from server.models.option import Option
from server.models.order import OrderItem


class Position:

    def __init__(self, option_order_item: OrderItem):
        self.latest_option_data = option_order_item.option_at_placement
        self.quantity = option_order_item.quantity

        premium = (self.latest_option_data.price_bid + self.latest_option_data.price_ask) * 100 / 2
        self.premiums = [premium for _ in range(abs(option_order_item.quantity))]
        self.total_premium = premium * self.quantity
        self.avg_price_paid = premium
        self.latest_market_value = self.total_premium
        self.latest_daily_pnl = 0.0

    def update_position_balance(self, option_order_item: OrderItem):
        self.quantity += option_order_item.quantity
        if self.quantity == 0:
            self.premiums = []
            self.total_premium = 0
            self.avg_price_paid = 0

        else:
            premium = (
                              option_order_item.option_at_execution.price_bid + option_order_item.option_at_execution.price_ask) / 2
            self.premiums.extend([premium for _ in range(option_order_item.quantity)])
            self.total_premium += premium * option_order_item.quantity
            self.avg_price_paid = self.total_premium / self.quantity

    def updates_position_stats(self, latest_option_data: Option):
        self.latest_option_data = latest_option_data
        self.latest_market_value = (latest_option_data.price_bid + latest_option_data.price_ask) / 2 * self.quantity
        self.latest_daily_pnl = self.latest_market_value - self.total_premium

    def __str__(self):
        return (f"Position(latest_option_data={self.latest_option_data}, "
                f"quantity={self.quantity}, total_premium={self.total_premium}, "
                f"avg_price_paid={self.avg_price_paid}, latest_market_value={self.latest_market_value}, "
                f"latest_daily_pnl={self.latest_daily_pnl})")
