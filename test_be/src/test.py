import joblib
import numpy as np
import shap


try:
    xgb_model = joblib.load("../models/master_xgb.pkl")
    scaler = joblib.load("../models/scaler.pkl")
    shap_explainer = joblib.load("../models/shap_explainer.pkl")
    print("All models and explainer loaded successfully.")
except Exception as e:
    print(f"Load Error: {e}")
    exit()



test_input = np.array([[7, 6, 2, 8, 5, 0, 0, 0, 0, 0]]) 

try:
    
    scaled_input = scaler.transform(test_input)
    prediction = xgb_model.predict(scaled_input)
    print(f"Model Run. Prediction: {prediction[0]}")

    
    shap_values = shap_explainer.shap_values(scaled_input)
    print(f"SHAP Success. SHAP Array Shape: {np.array(shap_values).shape}")
    
    print("\nEnvi  reeady .")
except Exception as e:
    print(f"Execution Error: {e}")