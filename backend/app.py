from flask import Flask, jsonify, request
import subprocess
import os
import pandas as pd

app = Flask(__name__)

@app.route('/vehicle_count', methods=['GET'])
def get_vehicle_count():
    try:
        df_vehicle_count = pd.read_csv('data/vehicle_counts.csv')
        data_vehicle_count = df_vehicle_count.to_dict(orient='records')
        return jsonify(data_vehicle_count)
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/vehicle_track', methods=['GET'])
def get_vehicle_track():
    try:
        df_vehicle_track = pd.read_csv('data/vehicle_track.csv')
        data_vehicle_track = df_vehicle_track.to_dict(orient='records')
        return jsonify(data_vehicle_track)
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/run-detection', methods=['POST'])
def run_detection():
    try:
        # Jalankan deteksi.py menggunakan subprocess
        result = subprocess.run(['python', 'code/deteksi.py'], capture_output=True, text=True)

        # Cek apakah script berhasil dijalankan
        if result.returncode != 0:
            return jsonify({'error': result.stderr}), 500

        # Jika berhasil, berikan respon sukses
        return jsonify({'message': 'Deteksi kendaraan berhasil dijalankan!', 'output': result.stdout}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)