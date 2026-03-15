import pandas as pd
import numpy as np
from xgboost import XGBClassifier
from sklearn.ensemble import RandomForestClassifier
import tensorflow as tf
from tensorflow.keras import layers, models
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import os


os.makedirs('../models', exist_ok=True)

print("Balancing dataset...")
# Update this path to your local CSV location
df = pd.read_csv('../data/processed/df2.csv', nrows=5000000)

# Balancing Logic
df_0 = df[df['phq4_category'] == 0].sample(n=len(df[df['phq4_category'] == 1]), random_state=42)
df_others = df[df['phq4_category'] > 0]
df_balanced = pd.concat([df_0, df_others])

# Feature Engineering
features = ["leisure_score", "me_score", "phone_score", "sleep_score", "social_score"]
for col in features:
    df_balanced[f'{col}_diff'] = df_balanced[col] - df_balanced.groupby('uid')[col].transform(lambda x: x.rolling(30, 1).mean())

final_features = features + [f'{f}_diff' for f in features]
X = df_balanced[final_features].fillna(0).values
y = df_balanced['phq4_category'].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# --- 1. Train Random Forest ---
print("Training Random Forest...")
rf_model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
rf_model.fit(X_train, y_train)

# --- 2. Train XGBoost ---
print("Training XGBoost...")
xgb_model = XGBClassifier(n_estimators=100, max_depth=6, eval_metric='mlogloss')
xgb_model.fit(X_train, y_train)

# --- 3. Train DNN ---
print("Training DNN...")
num_classes = len(np.unique(y))
dnn_model = models.Sequential([
    layers.Input(shape=(X_train.shape[1],)),
    layers.Dense(64, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(32, activation='relu'),
    layers.Dense(num_classes, activation='softmax')
])
dnn_model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
dnn_model.fit(X_train, y_train, epochs=15, batch_size=32, verbose=0)

# Save everything
joblib.dump(rf_model, '../models/master_rf.pkl')
joblib.dump(xgb_model, '../models/master_xgb.pkl')
dnn_model.save('../models/master_dnn.h5')
joblib.dump(scaler, '../models/scaler.pkl')

print("All 3 models and scaler saved in /models/")