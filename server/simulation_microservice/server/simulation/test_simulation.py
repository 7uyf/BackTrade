import asyncio
from datetime import datetime

from models import SimulationConfig, DteFile
from simulation import Simulation


async def main():
    # Create a sample SimulationConfig
    simulation_config = SimulationConfig(
        simulation_id="test_sim_001",
        user_id="user123",
        simulation_type="Practice",
        start_date_time=datetime(2016, 1, 12, 9, 30),
        end_date_time=datetime(2016, 1, 12, 16, 0),
        initial_capital=100000.0,
        universe_selection=[
            DteFile(
                file_url='ivol/all_dte_raw_data/0dte/2016-01-12.csv',
                today_date=datetime(2016, 1, 12),
                stock_symbol='SPX',
                expiration_date=datetime(2016, 1, 22),
                dte=10
            )
        ],
        indicator_type_selection=["Crawler"],
        playback_speed=0.1
    )

    simulation = Simulation(simulation_config)
    await simulation.init()

    print(f"MarketDataGenerator initialized with {len(simulation.timeframes)} timeframes.")
    if simulation.timeframes:
        print(f"First timeframe: {min(simulation.timeframes.keys())}")
        print(f"Last timeframe: {max(simulation.timeframes.keys())}")

    await simulation.run()

    print("MarketDataGenerator completed.")

if __name__ == "__main__":
    asyncio.run(main())