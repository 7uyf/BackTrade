import asyncio
from datetime import datetime

from server.models.option import Option, OptionChainSnapshot
from server.models.simulation import SimulationConfig, DteFile
from server.simulation.simulation import Simulation

dummy_dte_file = DteFile(file_url='ivol/all_dte_raw_data/0dte/2016-01-12.csv',
                         today_date=datetime(2016, 1, 12),
                         stock_symbol='SPX',
                         expiration_date=datetime(2016, 1, 22),
                         dte=15)

dummy_simulation_config = SimulationConfig(
    user_id="1",
    simulation_type='Test',
    start_date_time=datetime(2021, 1, 1),
    initial_capital=100000,
    universe_selection=[dummy_dte_file],
    indicator_type_selection=["Crawler"],
    playback_speed=1,
    status='PAUSED')

sample_option1 = Option(
    t_date=datetime.now(),
    stock_symbol="SPX",
    expiration_date=datetime(2023, 12, 17),
    strike=150.0,
    underlying_price=148.5,
    call_put='C',
    price_bid=2.45,
    price_ask=2.50,
    iv=0.25,
    delta=0.5,
    gamma=0.1,
    theta=-0.05,
    vega=0.2
)
sample_option2 = Option(
    t_date=datetime.now(),
    stock_symbol="SPX",
    expiration_date=datetime(2023, 12, 17),
    strike=155.0,
    underlying_price=148.5,
    call_put='P',
    price_bid=2.45,
    price_ask=2.50,
    iv=0.25,
    delta=0.5,
    gamma=0.1,
    theta=-0.05,
    vega=0.2
)
sample_option3 = Option(
    t_date=datetime.now(),
    stock_symbol="SPX",
    expiration_date=datetime(2023, 12, 17),
    strike=150.0,
    underlying_price=148.5,
    call_put='C',
    price_bid=0.9,
    price_ask=0.9,
    iv=0.25,
    delta=0.5,
    gamma=0.1,
    theta=-0.05,
    vega=0.2
)
sample_option4 = Option(
    t_date=datetime.now(),
    stock_symbol="SPX",
    expiration_date=datetime(2023, 12, 17),
    strike=155.0,
    underlying_price=148.5,
    call_put='P',
    price_bid=2.45,
    price_ask=2.50,
    iv=0.25,
    delta=0.5,
    gamma=0.1,
    theta=-0.05,
    vega=0.2
)

sample_option_chain_snapshot1 = OptionChainSnapshot(dte_file=dummy_dte_file, options=[sample_option1, sample_option2])
sample_option_chain_snapshot2 = OptionChainSnapshot(dte_file=dummy_dte_file, options=[sample_option3, sample_option4])


async def main():
    dummy_simulation = Simulation(dummy_simulation_config)

    dummy_simulation.account_service.on_market_data_update(sample_option_chain_snapshot1)
    dummy_simulation.order_management_service.on_market_data_update(sample_option_chain_snapshot1)

    print(dummy_simulation.account_service.account_snapshot)

    # long call position
    dummy_simulation.order_management_service.create_order_saga([(1, sample_option1)])
    print(dummy_simulation.account_service.account_snapshot)

    # close the long call position
    dummy_simulation.order_management_service.create_order_saga([(-1, sample_option1)])
    print(dummy_simulation.account_service.account_snapshot)

    # short put position with insufficient margin requirement
    dummy_simulation.order_management_service.create_order_saga([(-3, sample_option2)])
    print(dummy_simulation.account_service.account_snapshot)

    # short put position with sufficient margin requirement
    dummy_simulation.order_management_service.create_order_saga([(-1, sample_option2)])
    print(dummy_simulation.account_service.account_snapshot)

    # limit order:
    dummy_simulation.order_management_service.create_order_saga([(1, sample_option1)], limit=1)
    print(dummy_simulation.account_service.account_snapshot)

    # the update triggers the limit order to be filled
    dummy_simulation.account_service.on_market_data_update(sample_option_chain_snapshot2)
    dummy_simulation.order_management_service.on_market_data_update(sample_option_chain_snapshot2)

    print(dummy_simulation.order_management_service.order_history)


if __name__ == "__main__":
    asyncio.run(main())
