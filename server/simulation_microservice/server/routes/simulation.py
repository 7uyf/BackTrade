import asyncio
from beanie import PydanticObjectId
from fastapi import APIRouter, Response, WebSocket, WebSocketDisconnect

from server.models.option import OptionChainSnapshot
from server.models.simulation import SimulationInset, SimulationConfig
from server.simulation.observer_interfaces import IMarketDataObserver
from server.simulation.simulation import Simulations_Dict, Simulation

Router = APIRouter(prefix="/simulation", tags=["Simulation"])


@Router.post("/")
async def createSimulation(simulationInset: SimulationInset) -> SimulationConfig:
    """Create a simulation"""
    simulationConfig =  SimulationConfig(user_id= simulationInset.user_id, simulation_type= simulationInset.simulation_type,start_date_time = simulationInset.start_date_time,initial_capital = simulationInset.initial_capital,universe_selection = simulationInset.universe_selection,indicator_type_selection = [""] )
    await simulationConfig.insert()

    return simulationConfig

@Router.websocket('/{simulation_id}/ws')
async def simulation_ws(websocket: WebSocket, simulation_id:PydanticObjectId):
    """Get WS for simulation"""
    simulation_config  = await SimulationConfig.get(simulation_id)
    if simulation_config is None:
            await websocket.send_denial_response(response=Response(content="no such simulation id exists",status_code=400))
            return
    simulation = Simulations_Dict.get(simulation_id)
    if simulation is None:
         simulation = Simulation(simulation_config)
         await simulation.market_data_service.init()
         asyncio.create_task(simulation.market_data_service.run())
         Simulations_Dict[simulation_config.id] =  simulation


    await websocket.accept()
    simulationWebSocket = SimulationWebsocket(websocket)
    simulation.market_data_service.register_observer(simulationWebSocket)
    try:
        while True:
            data = await websocket.receive_json()
            print(data)
            await simulation.actionsMap[data['command']](data['payload'])
    except WebSocketDisconnect:
        # disconnect  simulation, even closeit if it has no listeners
        simulation.market_data_service.remove_observer(simulationWebSocket)
        print("closed connection")


class SimulationWebsocket(IMarketDataObserver):
    def __init__(self, websocket: WebSocket):
        self.websocket: WebSocket = websocket

    async def on_market_data_update(self, snapshot: OptionChainSnapshot):
         await self.websocket.send_json({"event": "OptionChainData","data": snapshot.model_dump_json()})


class SimulationWebsocketInteraction():
    
    def __init__(self, simulation: Simulation) -> None:
         self.simulation = simulation
         pass