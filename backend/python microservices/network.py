from pgmpy.models import DiscreteBayesianNetwork
from pgmpy.factors.discrete import TabularCPD
from pgmpy.inference import VariableElimination
from serializable import model_to_doc, doc_to_cpds

EDGES = [
    ("LearningStyle", "VisualScore"),
    ("LearningStyle", "VerbalScore"),
    ("LearningStyle", "BehaviorSignal"),
]

def _attach_cpds(model: DiscreteBayesianNetwork, cpds: list[TabularCPD]) -> DiscreteBayesianNetwork:
    model.add_cpds(*cpds)
    assert model.check_model(), "CPDs are inconsistent with the network structure"
    return model

def _default_cpds():
    # model = DiscreteBayesianNetwork([('LearningStyle', 'VisualScore'),
    #                                 ('LearningStyle', 'VerbalScore'),
    #                                 ('LearningStyle', 'BehaviorSignal')])
    
    cpd_style = TabularCPD(
        variable="LearningStyle",
        variable_card=2,
        values=[[0.5], [0.5]],
        state_names={"LearningStyle": ["Visual", "Verbal"]}
    )

    cpd_visual = TabularCPD(
        variable="VisualScore",
        variable_card=2,
        values=[
            [0.80, 0.35], # P(Pass | Visual), P(Pass | Verbal)
            [0.20, 0.65] # P(Fail | Visual), P(Fail | Verbal)
        ],
        evidence=["LearningStyle"],
        evidence_card=[2],
        state_names={
            "VisualScore": ["Pass", "Fail"],
            "LearningStyle": ["Visual", "Verbal"]
        }
    )

    cpd_verbal = TabularCPD(
        variable="VerbalScore",
        variable_card=2,
        values=[
            [0.40, 0.80], # P(Pass | Visual), P(Pass | Verbal)
            [0.60, 0.20] # P(Fail | Visual), P(Fail | Verbal)
        ],
        evidence=["LearningStyle"],
        evidence_card=[2],
        state_names={
            "VerbalScore": ["Pass", "Fail"],
            "LearningStyle": ["Visual", "Verbal"]
        }
    )

    cpd_behavior = TabularCPD(
        variable="BehaviorSignal",
        variable_card=2,
        values=[
            [0.75, 0.25], # P(VisualDominant | Visual), P(VisualDominant | Verbal) 
            [0.25, 0.75] # P(VerbalDominant | Visual), P(VerbalDominant | Verbal)
        ],
        evidence=["LearningStyle"],
        evidence_card=[2],
        state_names={
            "BehaviorSignal": ["VisualDominant", "VerbalDominant"],
            "LearningStyle": ["Visual", "Verbal"]
        }
    )

    # model.add_cpds(cpd_style, cpd_visual, cpd_verbal, cpd_behavior)
    # assert model.check_model(), "Invalid Bayesian Network"
    # return model
    return [cpd_style, cpd_visual, cpd_verbal, cpd_behavior]

def build_model() -> DiscreteBayesianNetwork:
    model = DiscreteBayesianNetwork(EDGES)
    return _attach_cpds(model, _default_cpds())

def load_model(doc: dict) -> DiscreteBayesianNetwork:
    model = DiscreteBayesianNetwork(EDGES)
    cpds = doc_to_cpds(doc)
    return _attach_cpds(model, cpds)

def serialize_learning_style_model(user_id: str, model: DiscreteBayesianNetwork) -> dict:
    return model_to_doc(user_id, model.cpds, network_type="learning_style")

def serialize_difficulty_model(user_id: str, model: DiscreteBayesianNetwork) -> dict:
    return model_to_doc(user_id, model.cpds, network_type="difficulty")

def infer_style(model: DiscreteBayesianNetwork, evidence: dict) -> dict:
    infer = VariableElimination(model)
    result = infer.query(variables=["LearningStyle"], evidence=evidence)
    states = result.state_names["LearningStyle"]
    values = result.values.tolist()
    return dict(zip(states, values))

def update_prior(model: DiscreteBayesianNetwork, posterior: dict) -> DiscreteBayesianNetwork:
    new_prior = TabularCPD(
        variable="LearningStyle",
        variable_card=2,
        values=[[posterior["Visual"]], [posterior["Verbal"]]],
        state_names={"LearningStyle": ["Visual", "Verbal"]}
    )
    model.remove_cpds(model.get_cpds("LearningStyle"))
    model.add_cpds(new_prior)
    assert model.check_model()
    return model

DIFFICULTY_EDGES = [("DifficultyLevel", "PerformanceSignal")]
def _default_difficulty_cpds():
    cpd_difficulty = TabularCPD(
        variable="DifficultyLevel",
        variable_card=3,
        values=[[0.33], [0.33], [0.33]],
        state_names={"DifficultyLevel": ["Easy", "Medium", "Hard"]}
    )

    cpd_performance = TabularCPD(
        variable="PerformanceSignal",
        variable_card=3,
        values=[
            [0.70, 0.20, 0.10],
            [0.20, 0.60, 0.20],
            [0.10, 0.20, 0.70]
        ],
        evidence=["DifficultyLevel"],
        evidence_card=[3],
        state_names={
            "PerformanceSignal": ["EasySignal", "MediumSignal", "HardSignal"],
            "DifficultyLevel": ["Easy", "Medium", "Hard"]
        }
    )

    return [cpd_difficulty, cpd_performance]

def build_difficulty_model() -> DiscreteBayesianNetwork:
    model = DiscreteBayesianNetwork(DIFFICULTY_EDGES)
    return _attach_cpds(model, _default_difficulty_cpds())

def load_difficulty_model(doc: dict) -> DiscreteBayesianNetwork:
    model = DiscreteBayesianNetwork(DIFFICULTY_EDGES)
    cpds = doc_to_cpds(doc)
    return _attach_cpds(model, cpds)

def infer_difficulty_level(model: DiscreteBayesianNetwork, evidence: dict) -> dict:
    infer = VariableElimination(model)
    result = infer.query(variables=["DifficultyLevel"], evidence=evidence)
    states = result.state_names["DifficultyLevel"]
    values = result.values.tolist()
    return dict(zip(states, values))

def update_difficulty_prior(model: DiscreteBayesianNetwork, posterior: dict) -> DiscreteBayesianNetwork:
    new_prior = TabularCPD(
        variable="DifficultyLevel",
        variable_card=3,
        values=[[posterior["Easy"]], [posterior["Medium"]], [posterior["Hard"]]],
        state_names={"DifficultyLevel": ["Easy", "Medium", "Hard"]}
    )
    model.remove_cpds(model.get_cpds("DifficultyLevel"))
    model.add_cpds(new_prior)
    assert model.check_model()
    return model