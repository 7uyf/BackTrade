from flask import Flask, jsonify, request
from flask_cors import CORS
import asyncio
from datetime import datetime

from models import SimulationConfig, DteFile
from simulation import Simulation

app = Flask(__name__)
CORS(app)

@app.route('/start_simulation', methods=['GET'])
async def start_simulation():
    file_url = request.args.get('file_url')
    start_date = request.args.get('start_date')
    simulation_config = SimulationConfig(
        simulation_id="test_sim_001",
        user_id="user123",
        simulation_type="Practice",
        start_date_time=datetime(2016, 1, 12, 9, 30), # change to start_date
        end_date_time=datetime(2016, 1, 12, 16, 0), # change to start_date
        initial_capital=100000.0,
        universe_selection=[
            DteFile(
                file_url=file_url#'ivol/all_dte_raw_data/0dte/2016-01-12.csv',
                today_date=datetime(2016, 1, 12), # change to start_date
                stock_symbol='SPX',
                expiration_date=datetime(2016, 1, 22), # change to start_date
                dte=10 
            )
        ],
        indicator_type_selection=["Crawler"],
        playback_speed=100
    )

    simulation = Simulation(simulation_config)
    await simulation.init()

    print(f"Simulation initialized with {len(simulation.timeframes)} timeframes.")
    if simulation.timeframes:
        print(f"First timeframe: {min(simulation.timeframes.keys())}")
        print(f"Last timeframe: {max(simulation.timeframes.keys())}")

    await simulation.run()

    print("Simulation completed.")

    return "Simulation completed."

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
