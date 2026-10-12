"""Re-export the classifier from shelf_life_regressor.joblib to a compact JSON that
preserves class probabilities (the original cls_trees_compact.json stored only P(class 0)).
Also writes golden.json: sklearn predictions for every CSV row plus a few extra probes.
Usage: python -I export_v2.py <model.joblib> <csv> <outdir>"""
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
X = df[["Gas Resistance", "CO2", "Temperature", "Humidity", "Pressure"]].to_numpy(dtype=float)
extra = np.array([[224.2,3232,30.5,68.3,1003.1],[453.63,1020,31.5,67.1,1012.4],[110.5,2393,26.9,64.6,1003.5],[491.4,5094,32.8,88.3,1009.8],[0,0,0,0,0],[291.6,4102,29.4,79.3,1006.9]])
Xall = np.vstack([X, extra])
cp = cls.predict(Xall); rp = reg.predict(Xall)
rows = []
for i, x in enumerate(Xall):
    rows.append({"source": (f"csv line {i+2}" if i < len(X) else f"extra {i-len(X)}"),
                 "features": [float(v) for v in x],
                 "csvLabel": (int(df["Label"].iloc[i]) if i < len(X) else None),
                 "ripeness_class": int(cp[i]), "raw_hours": float(rp[i])})
with open(f"{outdir}/golden.json", "w") as f:
    json.dump({"featureOrder": ["gas_resistance","co2","temperature","humidity","pressure"],
               "note": "ripeness_class and raw_hours are sklearn RandomForest predict() outputs from shelf_life_regressor.joblib (origin/hans-test). raw_hours is BEFORE the class>=4 clamp.",
               "rows": rows}, f, indent=1)
print("ok", len(rows), "cls train acc", float((cp[:len(X)] == df["Label"].to_numpy()).mean()))
