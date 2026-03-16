from flask import Flask, request, jsonify
from flask_cors import CORS 
import joblib
import numpy as np
import tensorflow as tf
from utils import get_mental_health_recommendation

app = Flask(__name__)
CORS(app) 

model = joblib.load('../models/master_xgb.pkl')
scaler = joblib.load('../models/scaler.pkl')

@app.route('/api/recommend', methods=['POST'])
def recommend():
    data = request.json
    current = data['current']
    avg = data['history_avg']
    
    features = ["leisure_score", "me_score", "phone_score", "sleep_score", "social_score"]
    diff_vals = [current[f] - avg[f] for f in features]
    
    # if np.abs(diff_vals).mean() < 0.5:
    #     return jsonify({
    #         "status": "Normal",
    #         "plan": "You are consistent! No changes needed.",
    #         "trigger": "None",
    #         "code": 0
    #     })

    result = get_mental_health_recommendation(current, avg)
    
    return jsonify({
        "status": ["Normal", "Mild", "Moderate", "Severe"][result["prediction"]],
        "plan": result["tasks"],
        "trigger": result["trigger"],
        "code": result["prediction"],
        "shap_scores": result["shap_scores"]
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)