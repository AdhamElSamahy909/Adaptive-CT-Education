from LSTM import LSTMPredictor
import torch
import os

def load_detector_model():
    if torch.cuda.is_available():
        device = torch.device("cuda")
    elif torch.backends.mps.is_available():
        device = torch.device("mps")
    else:
        device = torch.device("cpu")

    print(f"Using device: {device}")

    loaded_model = LSTMPredictor(input_dim=7, n_hidden=51)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    load_path = os.path.join(base_dir, "struggling_detector.pth")

    state_dict = torch.load(load_path, map_location=device)
    loaded_model.load_state_dict(state_dict)

    loaded_model.to(device)

    loaded_model.eval()
    print(f"Struggling detection model loaded successfully.")

    return loaded_model