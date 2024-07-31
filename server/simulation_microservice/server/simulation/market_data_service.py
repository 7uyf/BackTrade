import asyncio
import csv
from datetime import datetime
from pathlib import Path

from server.models.option import OptionChainSnapshot, Option
from server.models.simulation import SimulationConfig, DteFile
from server.simulation.observer_interfaces import IMarketDataSubject


class MarketDataService(IMarketDataSubject):
    def __init__(self, simulation_config: SimulationConfig):
        super().__init__()
        self.simulation_config = simulation_config
        self.timeframes: "dict[str,OptionChainSnapshot]" = {}
        self.tasks = []
        self.pause_requested = False
        self.pause_condition = asyncio.Condition()

    async def pause(self):
        async with self.pause_condition:
            self.pause_requested = True

    async def resume(self):
        async with self.pause_condition:
            self.pause_requested = False
            self.pause_condition.notify_all()

    async def set_playback_speed(self, speed: float):
        print(speed)
        self.simulation_config.playback_speed = speed
        self.simulation_config.save()

    async def init(self):
        await self._populate_timeframes_with_dummy_data()

    async def run(self):
        for target_datetime in self.timeframes:

            async with self.pause_condition:
                while self.pause_requested:
                    await self.pause_condition.wait()

            snapshot = self.timeframes[target_datetime]
            print("snapshot")
            self.notify_observers(snapshot)
            await asyncio.sleep(60 / self.simulation_config.playback_speed)

    async def _populate_timeframes_with_dummy_data(self):
        # in reality this function should call the data_microservice to get the data
        # but for the POC it will use the sample data from the local csv.
        dummy_dte_file = DteFile(file_url='ivol/all_dte_raw_data/0dte/2016-01-12.csv',
                                 today_date=datetime(2016, 1, 12),
                                 stock_symbol='SPX',
                                 expiration_date=datetime(2016, 1, 22),
                                 dte=15)

        csv_file = Path(Path(__file__).parent, '2016-01-12.csv')
        with open(csv_file, 'r') as file:
            csv_reader = csv.reader(file)
            headers = next(csv_reader)  # Read the header row
            # ...
            for row in csv_reader:
                row_dict = dict(zip(headers, row))
                option = Option.from_csv_row(row_dict)
                if option.t_date not in self.timeframes:
                    self.timeframes[option.t_date] = OptionChainSnapshot(
                        dte_file=dummy_dte_file,
                        option_chain=[]
                    )
                self.timeframes[option.t_date].options.append(option)
        # print(f"Loaded {sum(len(snapshot.options) for snapshot in self.timeframes.values())} option chain rows.")
