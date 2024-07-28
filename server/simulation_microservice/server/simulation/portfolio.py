from server.models.option import OptionChainSnapshot


class Portfolio:
    def __init__(self):
        self.positions = {}

    def get_aggregated_pnl(self) -> float:
        pnl = 0.0
        for position in self.positions.values():
            pnl += position.latest_daily_pnl
        return pnl

    def get_aggregated_greeks(self):
        delta = 0
        gamma = 0
        theta = 0
        vega = 0
        for position in self.positions.values():
            delta += position.latest_option_data.delta * position.quantity
            gamma += position.latest_option_data.gamma * position.quantity
            theta += position.latest_option_data.theta * position.quantity
            vega += position.latest_option_data.vega * position.quantity
        return {
            "delta": delta,
            "gamma": gamma,
            "theta": theta,
            "vega": vega
        }

    def update_positions_with_latest_market_data(self, snapshot: OptionChainSnapshot):
        for position in self.positions.values():
            for option in snapshot.options:
                if option == position.latest_option_data:
                    position.updates_position_stats(option)
                    break
