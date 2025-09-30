# proj/iris/model.py
import pickle
from pathlib import Path
import pandas as pd
from sklearn.model_selection import GridSearchCV, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression

CSV_PATH = Path("proj/iris/static/assets/iris.csv")
MODEL_PATH = Path("proj/iris/model.pkl")

def train_and_save():
    iris = pd.read_csv(CSV_PATH).drop_duplicates()
    X = iris.drop(columns=["species"]).astype(float).values
    y = iris["species"].values

    pipe = Pipeline([
        ("scaler", StandardScaler()),
        ("clf", LogisticRegression(max_iter=2000, random_state=42))
    ])

    param_grid = {
        "clf__C": [0.01, 0.1, 1, 10, 100],
        "clf__solver": ["lbfgs", "liblinear"],
        "clf__penalty": ["l2"],
    }

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    grid = GridSearchCV(pipe, param_grid=param_grid, cv=cv, n_jobs=-1, refit=True, scoring="accuracy")
    grid.fit(X, y)

    print("Best params:", grid.best_params_)
    print("Best CV accuracy:", grid.best_score_)

    # Save a payload containing the fitted pipeline and metadata (accuracy)
    payload = {
        "model": grid.best_estimator_,
        "cv_accuracy": float(grid.best_score_),
        "classes_": getattr(grid.best_estimator_, "classes_", None),
    }
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(payload, f)
    print(f"Saved to {MODEL_PATH.resolve()}")

if __name__ == "__main__":
    train_and_save()
