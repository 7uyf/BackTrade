
from server.models.simulation import SimulationConfig
from server.simulation.margin_account_service import MarginAccountService
from server.simulation.market_data_service import MarketDataService
from server.simulation.order_management_service import OrderManagementService


class Simulation:

    def __init__(self, simulation_config: SimulationConfig):
        self.simulation_config = simulation_config
        self.market_data_service = MarketDataService(simulation_config)
        self.account_service = MarginAccountService(simulation_config.initial_capital)
        self.order_management_service = OrderManagementService(self.account_service)

        self.market_data_service.register_observer(self.order_management_service)
        self.market_data_service.register_observer(self.account_service)


Simulations_Dict: "dict[str, MarketDataService]" = {}
