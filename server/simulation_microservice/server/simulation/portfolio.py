from typing import Dict

from server.simulation_microservice.server.models.option import OptionChainSnapshot


class Portfolio:
    def __init__(self):
        self.positions = {}

    def get_latest_daily_pnl(self) -> float:
        pnl = 0.0
        for position in self.positions.values():
            pnl += position.latest_daily_pnl
        return pnl

    def get_positions(self) -> Dict:
        return self.positions

    def set_positions(self, positions: dict):
        self.positions = positions

    def update_positions_with_latest_market_data(self, snapshot: OptionChainSnapshot):
        for position in self.positions.values():
            for option in snapshot.options:
                if option == position.option:
                    position.updates_position_stats(option)
                    break
