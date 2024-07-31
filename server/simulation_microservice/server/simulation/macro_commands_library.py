from logs.logger_config import get_class_logger
from server.models.option import OptionChainSnapshot
from server.simulation.margin_account_service import MarginAccountService
from server.simulation.order_management_service import OrderManagementService
from server.simulation.utils import get_closest_strike


class MacroCommandsLibrary:

    def __init__(self):
        self.logger = get_class_logger(self)

    def exit_all_positions(self, account_service: MarginAccountService,
                           order_management_service: OrderManagementService, auto_fill=False):
        if not self.__validate_exit_all_positions(account_service):
            return False

        positions = account_service.positions
        exit_orders = []
        for position in positions.values():
            opposite_quantity = -position.quantity
            exit_orders.append((opposite_quantity, position.latest_option_data))
        order_management_service.create_order_saga(orders=exit_orders, auto_fill=auto_fill)
        return True

    def entry(self, snapshot: OptionChainSnapshot, order_management_service: OrderManagementService, action_type: str,
              straddle_offset: int, quantity=None, gamma=None, auto_fill=False):
        if not self.__validate_entry(action_type, quantity, gamma):
            return False

        atm_strike = get_closest_strike(snapshot.index_price, 5)
        straddle_strike = atm_strike + straddle_offset
        if straddle_strike not in snapshot.strikes:
            self.logger.error("Straddle Offset out of bounds")
            return False

        call_option = snapshot.strikes[straddle_strike].call_option
        put_option = snapshot.strikes[straddle_strike].put_option

        if gamma is not None:
            total_gamma = call_option.gamma + put_option.gamma
            quantity = round(gamma / total_gamma)

        if action_type == "Buy":
            orders = [
                (quantity, call_option),
                (quantity, put_option)
            ]
        else:
            orders = [
                (-quantity, call_option),
                (-quantity, put_option)
            ]
        order_management_service.create_order_saga(orders=orders, auto_fill=auto_fill)
        return True

    def hedge(self, snapshot: OptionChainSnapshot, account_service: MarginAccountService,
              order_management_service: OrderManagementService, action_type: str,
              percentage_portfolio_delta_to_hedge: int, option_delta_to_hedge: int, auto_fill=False):
        if not self.__validate_hedge(action_type, percentage_portfolio_delta_to_hedge, option_delta_to_hedge):
            return False

        portfolio_delta = account_service.aggregated_greeks["delta"]
        delta_to_hedge = (portfolio_delta * percentage_portfolio_delta_to_hedge) / 100

        if portfolio_delta > 0:
            option_type = "P" if action_type == "Buy" else "C"
        else:
            option_type = "C" if action_type == "Buy" else "P"

        closest_option = None
        closest_delta_diff = float('inf')
        for option in snapshot.options:
            if option.call_put == option_type:
                delta_diff = abs(abs(option.delta) - option_delta_to_hedge)
                if delta_diff < closest_delta_diff:
                    closest_delta_diff = delta_diff
                    closest_option = option

        if closest_option is None:
            self.logger.warning("No suitable option found for hedging")
            return False

        number_of_contracts = abs(delta_to_hedge) / abs(closest_option.delta)
        number_of_contracts = int(number_of_contracts)

        order_quantity = number_of_contracts if action_type == "Buy" else -number_of_contracts

        orders = [(order_quantity, closest_option)]
        order_management_service.create_order_saga(orders=orders, auto_fill=auto_fill)
        return True

    def sizing(self, snapshot: OptionChainSnapshot, account_service: MarginAccountService,
               order_management_service: OrderManagementService, action_type: str,
               position_gamma=None, absolute_margin=None, percentage_margin=None, auto_fill=False):
        if not self.__validate_sizing(action_type, position_gamma, absolute_margin, percentage_margin):
            return False

        if action_type == "Increase":
            if position_gamma is not None:
                return self.__increase_by_position_gamma(snapshot, account_service, order_management_service,
                                                         position_gamma, auto_fill)
            elif absolute_margin is not None:
                return self.__increase_by_absolute_margin(snapshot, account_service, order_management_service,
                                                          absolute_margin, auto_fill)
            elif percentage_margin is not None:
                return self.__increase_by_percentage_margin(snapshot, account_service, order_management_service,
                                                            percentage_margin, auto_fill)
        return False

    def __increase_by_position_gamma(self, snapshot: OptionChainSnapshot, account_service: MarginAccountService,
                                     order_management_service: OrderManagementService, position_gamma: float,
                                     auto_fill):
        portfolio_gamma = account_service.aggregated_greeks["gamma"]
        gamma_to_increase = portfolio_gamma * (position_gamma / 100)

        atm_strike = get_closest_strike(snapshot.index_price, 5)
        call_option = snapshot.strikes[atm_strike].call_option
        put_option = snapshot.strikes[atm_strike].put_option

        straddle_gamma = call_option.gamma + put_option.gamma
        quantity = round(gamma_to_increase / straddle_gamma)

        orders = [
            (quantity, call_option),
            (quantity, put_option)
        ]
        order_management_service.create_order_saga(orders=orders, auto_fill=auto_fill)
        return True

    def __increase_by_absolute_margin(self, snapshot: OptionChainSnapshot, account_service: MarginAccountService,
                                      order_management_service: OrderManagementService, absolute_margin, auto_fill):
        raise NotImplementedError("Increase by absolute margin is not implemented yet")

    def __increase_by_percentage_margin(self, snapshot: OptionChainSnapshot, account_service: MarginAccountService,
                                        order_management_service: OrderManagementService, percentage_margin, auto_fill):
        raise NotImplementedError("Increase by percentage margin is not implemented yet")

    def __validate_hedge(self, action_type: str, percentage_portfolio_delta_to_hedge: int,
                         option_delta_to_hedge: int) -> bool:
        if action_type not in ["Buy", "Sell"]:
            self.logger.error("Invalid action type")
            return False

        if percentage_portfolio_delta_to_hedge not in [33, 50, 100]:
            self.logger.error("Invalid percentage_portfolio_delta_to_hedge")
            return False

        if option_delta_to_hedge not in [20, 30, 50]:
            self.logger.error("Invalid option_delta_to_hedge")
            return False

        return True

    def __validate_entry(self, action_type: str, quantity=None, gamma=None) -> bool:
        if action_type not in ["Buy", "Sell"]:
            self.logger.error("Invalid action type")
            return False

        if (quantity is None and gamma is None) or (quantity is not None and gamma is not None):
            self.logger.error("Exactly one of quantity or abs_gamma should be provided")
            return False

        return True

    def __validate_exit_all_positions(self, account_service: MarginAccountService) -> bool:
        if not account_service.positions:
            self.logger.warning("No positions to exit")
            return False
        return True

    def __validate_sizing(self, action_type: str, position_gamma=None, absolute_margin=None,
                          percentage_margin=None) -> bool:
        if action_type not in ["Increase", "Decrease"]:
            self.logger.error("Invalid action type")
            return False

        if sum(x is not None for x in [position_gamma, absolute_margin, percentage_margin]) != 1:
            self.logger.error("Exactly one of position_gamma, absolute_margin, or percentage_margin should be provided")
            return False

        if action_type == "Decrease":
            self.logger.error("Decrease action type is not implemented yet")
            return False

        return True
