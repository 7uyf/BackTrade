from collections import deque


class AccountSnapshot:
    def __init__(self, positions, aggregate_pnl, aggregated_greeks, maintenance_margin, net_value):
        self.positions = positions
        self.aggregate_pnl = aggregate_pnl
        self.aggregated_greeks = aggregated_greeks
        self.maintenance_margin = maintenance_margin
        self.net_value = net_value

    @classmethod
    def from_margin_account_service(cls, margin_account_service):
        return cls(
            margin_account_service.portfolio.get_positions(),
            margin_account_service.portfolio.get_aggregated_pnl(),
            margin_account_service.portfolio.get_aggregated_greeks(),
            margin_account_service.maintenance_margin,
            margin_account_service.net_value
        )

    def to_dict(self):
        return {
            "positions": self.positions,
            "aggregate_pnl": self.aggregate_pnl,
            "aggregated_greeks": self.aggregated_greeks,
            "maintenance_margin": self.maintenance_margin,
            "net_value": self.net_value
        }

    def __str__(self):
        positions_str = ", ".join([str(position) for position in self.positions.values()])
        return (f"AccountSnapshot(positions={{ {positions_str} }}, "
                f"aggregate_pnl={self.aggregate_pnl}, aggregated_greeks={self.aggregated_greeks}, "
                f"maintenance_margin={self.maintenance_margin}, net_value={self.net_value})")


class AccountSnapshotTimeSeries:
    def __init__(self, window_size: int):
        self.snapshots = deque(maxlen=window_size)

    def add_snapshot(self, snapshot: AccountSnapshot):
        self.snapshots.append(snapshot)

    def get_latest_snapshot(self) -> AccountSnapshot | None:
        if not self.snapshots:
            return None
        return self.snapshots[-1]
