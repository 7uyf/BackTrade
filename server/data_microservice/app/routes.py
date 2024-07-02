from flask import Flask, jsonify, request
from data_fetcher import fetch_historical_data, list_available_data, stream_historical_data
from dotenv import load_dotenv
from flask_cors import CORS

import pandas as pd
from io import StringIO

load_dotenv()

app = Flask(__name__)
CORS(app) 

@app.route('/data', methods=['GET'])
def get_data():
    dte = request.args.get('dte')
    date = request.args.get('date')
    if not dte or not date:
        return jsonify({'error': 'dte and date parameters are required'}), 400

    bucket_name = 'ivol-data'
    try:
        csv_data = fetch_historical_data(bucket_name, dte, date)
        df = pd.read_csv(StringIO(csv_data), low_memory=False)  # was pd.read_csv(StringIO(csv_data))
        return df.to_json(orient='records')
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/data/stream', methods=['GET'])
def stream_data():
    dte = request.args.get('dte')
    date = request.args.get('date')
    if not dte or not date:
        return jsonify({'error': 'dte and date parameters are required'}), 400

    bucket_name = 'ivol-data'
    try:
        return stream_historical_data(bucket_name, dte, date)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/available-data', methods=['GET'])
def available_data():
    dte = request.args.get('dte')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    bucket_name = 'ivol-data'
    try:
        files = list_available_data(bucket_name, dte, start_date, end_date)
        if files is None:
            return jsonify({'error': 'No credentials to access S3'}), 500
        return jsonify({'files': files}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
