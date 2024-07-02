import datetime

from pandas import DataFrame
from pydantic import BaseModel
from typing import List, Literal
from typing_extensions import Annotated, Any, Optional
from beanie import Document, Indexed


class DteFile(BaseModel):
    file_url: str  # the url to the file in the s3 ivol-options bucket
    today_date: datetime.datetime  # the historical date of the data (time 00:00:00)
    stock_symbol: str
    expiration_date: datetime.datetime  # the expiration date of the options in the file
    dte: int  # (expiration_date - today_date)


class SimulationConfig(Document, BaseModel):
    simulation_id: str
    user_id: str
    simulation_type: Literal['Test', 'Practice']
    start_date_time: datetime.datetime
    initial_capital: float
    end_date_time: Optional[datetime.datetime]
    universe_selection: List[DteFile]
    indicator_type_selection: List[str]
    playback_speed: float

# validate the simulation config:
# 1. start_date_time < end_date_time
# 2. initial_capital > 0
# 3. universe_selection is not empty
# 4. all today_date in universe_selection are between start_date_time and end_date_time