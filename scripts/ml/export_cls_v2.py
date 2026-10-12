"""Re-export the classifier from shelf_life_regressor.joblib to a compact JSON that
preserves class probabilities (the app's cls_trees_compact.json keeps only each leaf's
argmax class). Also writes golden.json: sklearn predictions for every CSV row plus a
few extra probes.
Model: ML/shelf_life_regressor.joblib from the original app's origin/revision branch
(the April 16 model, trained on ML/merged_avocado_dataset.csv); its regression trees are
the app's assets/reg_trees_compact.json.
Usage: python -I export_cls_v2.py <model.joblib> <csv> <outdir>"""
import sys, json, warnings
import numpy as np, pandas as pd, joblib
warnings.filterwarnings("ignore")
model_path, csv_path, outdir = sys.argv[1:4]
a = joblib.load(model_path); reg = a["reg_model"]; cls = a["cls_model"]

def export_cls(tree):
    nodes = []
    def trav(i):
        if tree.children_left[i] == -1:
            v = tree.value[i][0]; p = v / v.sum()
            k = int(np.argmax(p))
            nodes.append([k] if p[k] >= 0.999999999 else [float(x) for x in p])
            return len(nodes) - 1
        l = trav(tree.children_left[i]); r = trav(tree.children_right[i])
        nodes.append([int(tree.feature[i]), float(tree.threshold[i]), l, r])
        return len(nodes) - 1
    trav(0)
    return nodes

out = {"t": [export_cls(e.tree_) for e in cls.estimators_], "c": [int(c) for c in cls.classes_]}
with open(f"{outdir}/cls_trees_v2.json", "w") as f:
    json.dump(out, f, separators=(",", ":"))

df = pd.read_csv(csv_path)
df = df.rename(columns={"Gas Resistance": "gas_resistance", "CO2": "co2", "Temperature": "temperature",
                        "Humidity": "humidity", "Pressure": "pressure", "Label": "ripeness_label"})
X = df[["gas_resistance", "co2", "temperature", "humidity", "pressure"]].to_numpy(dtype=float)
extra = np.array([[224.2,3232,30.5,68.3,1003.1],[453.63,1020,31.5,67.1,1012.4],[110.5,2393,26.9,64.6,1003.5],[491.4,5094,32.8,88.3,1009.8],[0,0,0,0,0],[291.6,4102,29.4,79.3,1006.9],
                  # inputs from app/CLI screenshots
                  [127.7,3363,31.2,78.2,1004.3],[297.7,2379,31.3,76.4,1002.6],[210,1500,32.3,68,1013],
                  [223.1,1490,29.2,73.5,1007.1],[388.6,1786,31.2,68.7,1005.1],[163.7,765,30.6,76.2,1005.2]])
Xall = np.vstack([X, extra])
cp = cls.predict(Xall); rp = reg.predict(Xall)
rows = []
for i, x in enumerate(Xall):
    rows.append({"source": (f"csv line {i+2}" if i < len(X) else f"extra {i-len(X)}"),
                 "features": [float(v) for v in x],
                 "csvLabel": (int(df["ripeness_label"].iloc[i]) if i < len(X) else None),
                 "ripeness_class": int(cp[i]), "raw_hours": float(rp[i])})
with open(f"{outdir}/golden.json", "w") as f:
    json.dump({"featureOrder": ["gas_resistance","co2","temperature","humidity","pressure"],
               "note": "ripeness_class and raw_hours are sklearn RandomForest predict() outputs from shelf_life_regressor.joblib (origin/revision, April 16 model). raw_hours is BEFORE the class>=4 clamp.",
               "rows": rows}, f, indent=1)
print("ok", len(rows), "cls train acc", float((cp[:len(X)] == df["ripeness_label"].to_numpy()).mean()))
