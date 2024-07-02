from models.options import OptionChainSnapshot
from models.orders import Order
from models.simulation import SimulationConfig
from simulation.market_data_generator import MarketDataGenerator


from simulation.orders_manager import  OrdersManager
from simulation.portfolio_manager import PortfolioManager


class Simulation:
    def __init__(self, simulation_config: SimulationConfig):
        self.simulation_config = simulation_config
        self.market_data_generator: MarketDataGenerator = MarketDataGenerator(simulation_config)

        self.portfolio_manager:PortfolioManager = PortfolioManager(simulation_config.initial_capital)
        self.orders_manager: OrdersManager = OrdersManager(self.portfolio_manager)
        self.market_data_generator.register_observer(self.orders_manager)
        self.market_data_generator.register_observer(self.portfolio_manager)




Simulations_Dict: "dict[str, Simulation]" = {}