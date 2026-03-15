import joblib
import shap
import os

model = joblib.load('../models/master_xgb.pkl')


print("Initializing SHAP Explainer...")
explainer = shap.TreeExplainer(model)

joblib.dump(explainer, '../models/shap_explainer.pkl')
print("SHAP Explainer saved!")