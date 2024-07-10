import asyncio
from beanie import PydanticObjectId
from fastapi import APIRouter, Response, WebSocket, WebSocketDisconnect

from server.simulation_microservice.server.models.simulation import SimulationInset, SimulationConfig
from server.simulation_microservice.server.simulation.market_data_generator import MarketDataGenerator
from server.simulation_microservice.server.simulation.simulation import Simulations_Dict, Simulation

router = APIRouter(prefix="/simulation", tags=["Simulation"])


@router.post("/")
async def createSimulation(simulationInset: SimulationInset) -> SimulationConfig:
    """Create a simulation"""
    simulationConfig = SimulationConfig(user_id=simulationInset.user_id,
                                        simulation_type=simulationInset.simulation_type,
                                        start_date_time=simulationInset.start_date_time,
                                        initial_capital=simulationInset.initial_capital,
                                        universe_selection=simulationInset.universe_selection,
                                        indicator_type_selection=[""])
    await simulationConfig.insert()

    return simulationConfig


@router.websocket('/{simulation_id}/ws')
async def simulation_ws(websocket: WebSocket, simulation_id: PydanticObjectId):
    """Get WS for data_generator"""
    simulation_config = await SimulationConfig.get(simulation_id)
    if simulation_config is None:
        await websocket.send_denial_response(response=Response(content="no such data_generator id exists", status_code=400))
        return
    data_generator = Simulations_Dict.get(simulation_id)
    if data_generator is None:
        data_generator = MarketDataGenerator(simulation_config)
        await data_generator.market_data_generator.init()
        asyncio.create_task(data_generator.market_data_generator.run())

    await websocket.accept()
    data_generator.market_data_generator.register_observer(SimulationWebsocket(websocket))
    try:
        while True:
            data = await websocket.receive_text()
            print(data)
            await websocket.send_text(data)
    except WebSocketDisconnect:
        # disconnect  data_generator, even closeit if it has no listeners
        print("closed connection")


class SimulationWebsocket(IMarketDataObserver):
    def __init__(self, websocket: WebSocket):
        self.websocket: WebSocket = websocket

    async def on_market_data_update(self, snapshot: OptionChainSnapshot):
        print(snapshot)
        await self.websocket.send_json(snapshot.model_dump_json())
