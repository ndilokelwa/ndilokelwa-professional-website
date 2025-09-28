from flask import Flask, render_template, request, jsonify
import numpy as np
import pickle

app = Flask(__name__, static_url_path='/proj/iris/static', template_folder='templates')

# Load trained model
with open("proj/iris/model.pkl", "rb") as f:
    model = pickle.load(f)

@app.route("/", methods=["GET", "POST"])
def index():
    prediction = None
    if request.method == "POST":
        try:
            # Get form inputs
            features = [
                float(request.form.get("sepal-length")),
                float(request.form.get("sepal-width")),
                float(request.form.get("petal-length")),
                float(request.form.get("petal-width"))
            ]

            # Predict
            pred = model.predict([features])[0]
            prediction = pred  # Expected: 'Setosa', 'Versicolor', or 'Virginica'
        except Exception as e:
            prediction = f"Error: {str(e)}"

    return render_template("iris.html", prediction=prediction)

if __name__ == "__main__":
    app.run(debug=True)


