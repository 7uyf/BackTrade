from beanie import PydanticObjectId
from fastapi import APIRouter, Response, WebSocket, WebSocketDisconnect
from  models.simulation import  SimulationInset,SimulationConfig
from models.options import OptionChainSnapshot
from simulation.i_market_data_observer import IMarketDataObserver
from simulation.simulation import Simulation, Simulations_Dict

router = APIRouter(prefix="/simulation", tags=["Simulation"])


@router.post("/")
async def createSimulation(simulationInset: SimulationInset) -> SimulationConfig:
    """Create a simulation"""
    simulationConfig =  SimulationConfig(user_id= simulationInset.user_id, simulation_type= simulationInset.simulation_type,start_date_time = simulationInset.start_date_time,initial_capital = simulationInset.initial_capital,universe_selection = simulationInset.universe_selection,indicator_type_selection = [""] )
    await simulationConfig.insert()
    
    return simulationConfig

@router.websocket('/{simulation_id}/ws')
async def simulation_ws(websocket: WebSocket, simulation_id:PydanticObjectId):
    """Get WS for simulation"""
    simulation_config  = await SimulationConfig.get(simulation_id)
    if simulation_config is None:
            await websocket.send_denial_response(response=Response(content="no such simulation id exists",status_code=400))
            return
    simulation = Simulations_Dict.get(simulation_id)
    if simulation is None:
         simulation = Simulation(simulation_config)
         await simulation.market_data_generator.init()
         simulation.market_data_generator.run()


    await websocket.accept()
    simulation.market_data_generator.register_observer(SimulationWebsocket(websocket))
    try:
        while True: 
            data = await websocket.receive_text()
            print(data)
            await websocket.send_text(data)
    except WebSocketDisconnect:
        # disconnect  simulation, even closeit if it has no listeners
        print("closed connection")

    
class SimulationWebsocket(IMarketDataObserver):
    def __init__(self, websocket: WebSocket):
        self.websocket: WebSocket = websocket

    async def on_market_data_update(self, snapshot: OptionChainSnapshot):
         await self.websocket.send_json(snapshot.model_dump_json())
