from server.simulation_microservice.server.models.options import OptionChainSnapshot
from server.simulation_microservice.server.models.orders import Order, OrderPriorityQueue
from server.simulation_microservice.server.simulation.i_market_data_observer import IMarketDataObserver
from server.simulation_microservice.server.simulation.portfolio_manager import PortfolioManager


class OrdersManager(IMarketDataObserver):
    def __init__(self, portfolio_manager: PortfolioManager):
        self.pending_orders = OrderPriorityQueue()
        self.portfolio_manager = portfolio_manager
        self.latest_snapshot = None

    async def on_market_data_update(self, snapshot: OptionChainSnapshot):
        """
        since this class is an observer of the market data, this function is called on every market data update.
        it updates the pending orders with the latest market data, and tries to execute them if the market conditions are met.
        """
        self.pending_orders.update_orders(snapshot)
        self.latest_snapshot = snapshot
        self._try_fill()

    async def register_order(self, order: Order):
        """
        this function should be called when a new order is created. it adds the order to the pending orders' dict.
        if it's a limit order it will be executed when the market conditions are met.
        if the order doesn't meet the portfolio margin requirement, the order will be canceled, and it will be removed from the pending orders.
        """
        self.pending_orders.put(order)
        self._try_fill()

    async def remove_pending_order(self, order: Order):
        """
        this function should be called when an order is canceled or executed. it removes the order from the pending orders' dict.
        """
        self.pending_orders.remove(order)

    def _try_fill(self):
        if self.latest_snapshot is None:
            for order in self.pending_orders:
                if not self.portfolio_manager.meets_margin_requirement(order):
                    self.pending_orders.remove(order)
                    print("order failed due to margin requirement")

                elif order.meets_market_conditions():
                    self.portfolio_manager.re_balance_positions(order)
                    self.pending_orders.remove(order)
