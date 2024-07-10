import datetime
from datetime import datetime, timezone
from typing import List, Literal

from pydantic import BaseModel, Field
from typing_extensions import Optional


def datetime_now() -> datetime:
    return datetime.now(timezone.utc)


class DteFile(BaseModel):
    file_url: str  # the url to the file in the s3 ivol-options bucket
    today_date: datetime  # the historical date of the data (time 00:00:00)
    stock_symbol: str
    expiration_date: datetime  # the expiration date of the options in the file
    dte: int  # (expiration_date - today_date)


class SimulationInset(BaseModel):
    user_id: str
    simulation_type: Literal['Test', 'Practice']
    start_date_time: datetime = Field(default_factory=datetime_now)
    initial_capital: float
    universe_selection: List[DteFile]
    end_date_time: Optional[datetime] = None


class SimulationConfig(SimulationInset):
    user_id: str
    simulation_type: Literal['Test', 'Practice']
    start_date_time: datetime
    initial_capital: float
    end_date_time: Optional[datetime] = None
    universe_selection: List[DteFile]
    indicator_type_selection: List[str]
    playback_speed: float = 1
    status: Literal['RUNNING', 'FINISHED', 'PAUSED'] = "PAUSED"

# validate the simulation config:
# 1. start_date_time < end_date_time
# 2. initial_capital > 0
# 3. universe_selection is not empty
# 4. all today_date in universe_selection are between start_date_time and end_date_time
