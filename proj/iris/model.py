import pickle
from sklearn.linear_model import LogisticRegression
import pandas as pd

path = 'proj/iris/static/assets/iris.csv'
iris = pd.read_csv(path)

iris.drop_duplicates(inplace=True)

X = iris.drop(columns=['species'])
y = iris['species']


model = LogisticRegression()
model.fit(X, y)

# Save it
with open("model.pkl", "wb") as f:
    pickle.dump(model, f)
