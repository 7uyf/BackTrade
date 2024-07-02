from server.simulation_microservice.server.models.options import OptionChainSnapshot
from server.simulation_microservice.server.models.orders import Order
from server.simulation_microservice.server.models.simulation import SimulationConfig
from server.simulation_microservice.server.simulation.market_data_generator import MarketDataGenerator


from server.simulation_microservice.server.simulation.orders_manager import PortfolioManager, OrdersManager


class Simulation:
    def __init__(self, simulation_config: SimulationConfig):
        self.simulation_config = simulation_config
        self.market_data_generator = MarketDataGenerator(simulation_config)

        self.portfolio_manager = PortfolioManager(simulation_config.initial_capital)
        self.orders_manager = OrdersManager(self.portfolio_manager)
        self.market_data_generator.register_observer(self.orders_manager)
        self.market_data_generator.register_observer(self.portfolio_manager)

