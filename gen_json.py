import pandas as pd

db = pd.read_csv("db.tsv", sep="\t", index_col="Šifra")

for code, row in db.iterrows():
    row.to_json(f"json/{code}.json", indent=True, force_ascii=False)
