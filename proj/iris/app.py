# proj/iris/app.py
from flask import Flask, render_template, request, jsonify
import numpy as np
import pickle
from pathlib import Path

APP_ROOT = Path(__file__).resolve().parent
MODEL_PATH = APP_ROOT / "model.pkl"

app = Flask(
    __name__,
    static_url_path="/proj/iris/static",
    template_folder="templates"
)

with open(MODEL_PATH, "rb") as f:
    payload = pickle.load(f)
model = payload["model"]                 # Pipeline(scaler + logreg)
MODEL_CV_ACC = payload.get("cv_accuracy")

@app.route("/", methods=["GET", "POST"])
def index():
    prediction = None
    confidence = None  # per-sample probability of the predicted class

    if request.method == "POST":
        try:
            features = [
                float(request.form.get("sepal-length")),
                float(request.form.get("sepal-width")),
                float(request.form.get("petal-length")),
                float(request.form.get("petal-width")),
            ]
            X = np.array(features, dtype=float).reshape(1, -1)

            prediction = model.predict(X)[0]
            if hasattr(model, "predict_proba"):
                proba = model.predict_proba(X)[0]
                confidence = float(np.max(proba))  # 0..1
        except Exception as e:
            prediction = f"Error: {str(e)}"

    return render_template(
        "iris.html",
        prediction=prediction,
        accuracy=MODEL_CV_ACC,   # e.g., 0.97
        confidence=confidence    # e.g., 0.99 for this sample
    )

# Optional JSON endpoint too
@app.route("/predict", methods=["POST"])
def predict_api():
    data = request.get_json(silent=True) or {}
    feats = data.get("features")
    if feats is None:
        return jsonify({"error": "Provide JSON with 'features'"}), 400

    X = np.array(feats, dtype=float)
    if X.ndim == 1:
        X = X.reshape(1, -1)
    if X.shape[1] != 4:
        return jsonify({"error": "Expect 4 features per sample"}), 400

    preds = model.predict(X).tolist()
    probs = model.predict_proba(X).tolist() if hasattr(model, "predict_proba") else None
    return jsonify({"predictions": preds, "probabilities": probs})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
