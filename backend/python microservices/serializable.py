import numpy as np
from pgmpy.factors.discrete import TabularCPD

def cpd_to_dict(cpd: TabularCPD) -> dict:
    return {
        "variable": cpd.variable,
        "variable_card": int(cpd.variable_card),
        "values": cpd.get_values().tolist(),
        "evidence": list(cpd.variables[1:]),
        "evidence_card": [int(c) for c in cpd.cardinality[1:]],
        "state_names": {k: list(v) for k, v in cpd.state_names.items()}
    }

def dict_to_cpd(data: dict) -> TabularCPD:
    return TabularCPD(
        variable= data["variable"],
        variable_card = data["variable_card"],
        values = np.array(data["values"]),
        evidence = data["evidence"] or None,
        evidence_card = data["evidence_card"] or None,
        state_names = data["state_names"]
    )

def model_to_doc(user_id: str, cpds: list[TabularCPD]) -> dict:
    return {
        "user_id": user_id,
        "cpds": [cpd_to_dict(c) for c in cpds]
    }

def doc_to_cpds(doc: dict) -> TabularCPD:
    return [dict_to_cpd(c) for c in doc["cpds"]]
