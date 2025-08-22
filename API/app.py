
# ---------------------------------------------
# Seismic Waves API
# ---------------------------------------------
# This Flask API serves endpoints for lunar and Martian seismic data analysis.
# It loads ML models, processes uploaded files, and returns predictions and visualizations.
#
# Main Endpoints:
#   - /upload_mseed_lunar: Upload lunar mseed file for analysis
#   - /upload_mseed_mars: Upload Martian mseed file for analysis
#   - /upload_csv_lunar: Upload lunar CSV file for analysis
# ---------------------------------------------

import random
from flask import Flask, request, jsonify
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64
from flask_cors import CORS
from obspy import read

# ---------------------------------------------
# Helper Functions
# ---------------------------------------------

def predict_seismic_event(passed_model=None):
    """
    Processes an uploaded mseed file, runs prediction logic, and returns results.
    Args:
        passed_model: Optional ML model (not used in demo)
    Returns:
        dict: Contains base64 image, speed, lat, lng, date, and time
    """
    file = request.files['file']
    # Read the mseed file using ObsPy
    mseed_data = read(file)
    traces = mseed_data.traces[0].copy()
    tr_times = traces.times()
    tr_data = traces.data

    # TODO: Replace with actual ML model prediction
    predicted_relative_time = 73500  # Dummy output for demonstration

    # Extract start date and time from trace metadata
    date_time = traces.stats.starttime
    date_time_str = str(date_time)
    date, time = date_time_str.split('T', 1)
    time_str = time.split('Z')[0]
    seconds = time_to_seconds(time_str)

    # Calculate event start time
    start_time_seconds = seconds + predicted_relative_time
    start_time_clock = seconds_to_time(start_time_seconds)

    # Get speed at predicted time (absolute value)
    speed = abs(tr_data[int(predicted_relative_time)])

    # Randomize latitude and longitude for demo
    lat = random.randint(-84, 77)
    lng = random.randint(-134, 101)

    # Plot seismic data and mark prediction
    fig, ax = plt.subplots()
    ax.plot(tr_times, tr_data)  # X: time, Y: velocity
    ax.axvline(x=predicted_relative_time, color='r', linestyle='--')

    # Convert plot to base64 PNG
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode('utf-8')

    return {
        'image': image_base64,
        'speed': speed,
        'lat': lat,
        'lng': lng,
        'date': date,
        'time': start_time_clock
    }

def time_to_seconds(time_str):
    """
    Converts a time string (HH:MM:SS) to seconds (float).
    """
    if isinstance(time_str, str):
        h, m, s = time_str.split(':')
        if '.' in s:
            s, ms = s.split('.')
        else:
            ms = '0'
        return int(h) * 3600 + int(m) * 60 + int(s) + float('0.' + ms)
    else:
        raise ValueError("Input must be a string in the format 'HH:MM:SS'")

def seconds_to_time(seconds):
    """
    Converts seconds (float) to time string (HH:MM:SS).
    """
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    secs = seconds % 60
    return f"{int(hours):02}:{int(minutes):02}:{int(secs):02}"

# ---------------------------------------------
# Flask App Setup
# ---------------------------------------------

app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB upload limit

# ---------------------------------------------
# API Endpoints
# ---------------------------------------------

@app.route('/')
def index():
    """Landing page endpoint."""
    return 'Welcome to the landing page'

@app.route('/upload_mseed_lunar', methods=['POST'])
def upload_mseed_file_lunar():
    """Endpoint for lunar mseed file upload and analysis."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    try:
        final_dict = predict_seismic_event()
        return jsonify(final_dict), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/upload_mseed_mars', methods=['POST'])
def upload_mseed_file_mars():
    """Endpoint for Martian mseed file upload and analysis."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    try:
        final_dict = predict_seismic_event()
        return jsonify(final_dict), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/upload_csv_lunar', methods=['POST'])
def upload_file():
    """Endpoint for lunar CSV file upload and analysis."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    try:
        data = pd.read_csv(file)
        # TODO: Replace with actual ML model prediction
        start_time = 12720  # Dummy output for demonstration
        fig, ax = plt.subplots()
        ax.plot(data['time_rel(sec)'], data['velocity(m/s)'])
        ax.axvline(x=start_time, color='r', linestyle='--')
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        image_base64 = base64.b64encode(buf.read()).decode('utf-8')
        return jsonify({'image': image_base64}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ---------------------------------------------
# Main Entrypoint
# ---------------------------------------------

if __name__ == '__main__':
    app.run(debug=True, port=2003)
