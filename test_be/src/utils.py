import joblib
import numpy as np
import shap

xgb_model = joblib.load("../models/master_xgb.pkl")
scaler = joblib.load("../models/scaler.pkl")
shap_explainer = joblib.load("../models/shap_explainer.pkl")

def get_curated_tasks(current, avg, shap_scores, trigger):
    tasks = []
    
    # 1. DYNAMIC PRIORITY LOGIC
    # We use the raw SHAP values to determine 'Urgency'
    # 0.0 - 0.3: Low | 0.3 - 0.7: Medium | > 0.7: Critical
    def get_priority(feature_name):
        val = abs(shap_scores.get(feature_name, 0))
        if val > 0.7: return "CRITICAL"
        if val > 0.3: return "HIGH"
        return "MEDIUM"

    # 2. TRIGGER TASK (The Primary Intervention)
    trigger_map = {
        'sleep_score': {
            "task": "Sleep Calibration",
            "detail": f"Sleep is your {get_priority('sleep_score')} trigger today. Aim for a consistent 7.5h.",
            "priority": get_priority('sleep_score'),
            "category": "Sleep"
        },
        'phone_score': {
            "task": "Digital Sunset",
            "detail": f"Phone usage is a {get_priority('phone_score')} factor. Turn off screens 1h before bed.",
            "priority": get_priority('phone_score'),
            "category": "Phone"
        },
        'social_score': {
            "task": "Social Re-engagement",
            "detail": "Social withdrawal detected. Connect with one person to lower your stress score.",
            "priority": get_priority('social_score'),
            "category": "Social"
        }
    }
    
    if trigger in trigger_map:
        tasks.append(trigger_map[trigger])

    # 3. THE "DISTRIBUTION" LOGIC (Using SHAP to find 'Neglected' areas)
    # We find the feature with the LOWEST SHAP score—this is the area 
    # the user is ignoring or "borrowing" time from.
    base_shaps = {k: v for k, v in shap_scores.items() if '_diff' not in k}
    neglected_feature = min(base_shaps, key=base_shaps.get)

    distribution_map = {
        'social_score': {
            "task": "Energy Redistribution",
            "detail": f"Your data shows you're over-focused on {trigger.split('_')[0]}. Shift 20 mins to social connection.",
            "priority": "LOW",
            "category": "Social"
        },
        'leisure_score': {
            "task": "Active Recovery",
            "detail": "Balance your day by adding 15 mins of a physical hobby or stretching.",
            "priority": "LOW",
            "category": "Leisure"
        }
    }

    if neglected_feature in distribution_map:
        tasks.append(distribution_map[neglected_feature])

    # 4. CONDITIONAL SCENARIOS (High/Low/Mild)
    # Sleep Over-performance (Your 105% case)
    if current['sleep_score'] > 8.5:
        tasks.append({
            "task": "Sleep Inertia Prevention",
            "detail": "You've over-slept relative to your average. Use a cold shower or 10-min walk to wake up your system.",
            "priority": "MEDIUM",
            "category": "Sleep"
        })

    # High Screen Time + Low Productivity
    if current['phone_score'] > avg['phone_score'] + 2 and current['me_score'] < avg['me_score']:
        tasks.append({
            "task": "Deep Work Swap",
            "detail": "Swap 30 mins of social media for one focused 25-min study block.",
            "priority": "HIGH",
            "category": "Productivity"
        })

    return tasks

def get_mental_health_recommendation(current_dict, history_avg_dict):
    features = ["leisure_score", "me_score", "phone_score", "sleep_score", "social_score"]
    
    input_list = [current_dict[f] for f in features]
    diff_list = [current_dict[f] - history_avg_dict[f] for f in features]
    
    full_vector_10 = np.array(input_list + diff_list).reshape(1, -1)
    
    scaled_vector_10 = scaler.transform(full_vector_10)
    
    try:
        prediction = int(xgb_model.predict(scaled_vector_10)[0])
        all_class_shaps = shap_explainer.shap_values(scaled_vector_10)
    except ValueError:
        prediction = int(xgb_model.predict(scaled_vector_10[:, :5])[0])
        all_class_shaps = shap_explainer.shap_values(scaled_vector_10[:, :5])


    if isinstance(all_class_shaps, list):
        idx = prediction if prediction < len(all_class_shaps) else 0
        current_shap = all_class_shaps[idx][0]
    elif len(all_class_shaps.shape) == 3:
        idx = prediction if prediction < all_class_shaps.shape[0] else 0
        current_shap = all_class_shaps[idx][0]
    else:
        current_shap = all_class_shaps[0]


    all_feature_names = features + [f"{f}_diff" for f in features]
    shap_data = {}
    for i in range(len(current_shap)):
        name = all_feature_names[i] if i < len(all_feature_names) else f"feat_{i}"
        shap_data[name] = float(current_shap[i])

    trigger = max(shap_data, key=shap_data.get) if shap_data else "Pattern match"
    curated_tasks = get_curated_tasks(current_dict, history_avg_dict, shap_data, trigger)

    plans = {
        0: "Status: Normal. Your habits are stable.",
        1: f"Status: Mild. {trigger} is slightly impacting your stability.",
        2: f"Status: Moderate. Significant shift detected in {trigger}.",
        3: f"Status: Severe. Critical anomaly in {trigger} identified."
    }

    return {
        "prediction": prediction,
        "status": ["Normal", "Mild", "Moderate", "Severe"][prediction],
        "trigger": trigger,
        "tasks": curated_tasks,
        "shap_scores": shap_data
    }