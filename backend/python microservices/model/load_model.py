from LSTM import LSTMPredictor
import torch
import os

def load_detector_model():
    loaded_model = LSTMPredictor(input_dim=7, n_hidden=51)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    load_path = os.path.join(base_dir, "struggling_detector.pth")

    loaded_model.load_state_dict(torch.load(load_path))

    loaded_model.to(device=torch.device("mps"))

    loaded_model.eval()
    print(f"Struggling detection model loaded successfully.")

    return loaded_model