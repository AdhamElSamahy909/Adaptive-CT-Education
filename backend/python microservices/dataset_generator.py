import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from torch.utils.data import TensorDataset, DataLoader
import torch.optim as optim
from LSTM import LSTMPredictor
import os
import random

NUM_SAMPLES = 10000
MAX_ATTEMPTS = 10
DIFFICULTY_PROBS = [0.4, 0.4, 0.2]

DIFFICULTY_MULT = {
    'easy': 1.0,
    'medium': 1.5,
    'hard': 2.0
}

DIFFICULTY_MAPPING = {
    'easy': 0.0,
    'medium': 0.5,
    'hard': 1.0
}

def get_difficulty():
    return np.random.choice(['easy', 'medium', 'hard'], p=DIFFICULTY_PROBS)

def generate_attempt(difficulty, attempt_idx, prev_progress):
    if prev_progress is None:
        progress = np.random.uniform(0, 0.3)
        time_delta = 0.0
    else:
        delta = np.random.normal(0.05, 0.15)
        delta = np.clip(delta, -0.2, 0.4)
        progress = prev_progress + delta
        progress = np.clip(progress, 0, 1.0)

        time_delta = np.random.exponential(scale=30 + 60 * (1 - prev_progress))

    return {
        'attempt_num': attempt_idx,
        'time_delta': time_delta,
        'test_progress': progress
    }, progress

def generate_sequence(difficulty):
    attempts = []
    n_attempts = 0
    final_success = False
    total_time = 0

    max_attempts_limit = 5 * DIFFICULTY_MULT[difficulty]
    prev_progress = None

    while n_attempts < MAX_ATTEMPTS and not final_success:
        attempt_data, new_progress = generate_attempt(difficulty, n_attempts + 1, prev_progress)

        attempts.append(attempt_data)
        total_time += attempt_data['time_delta']
        n_attempts += 1

        if new_progress >= 0.99:
            final_success = True
            break

        prev_progress = new_progress

    struggling = 0

    if n_attempts > max_attempts_limit:
        struggling = 1

    if total_time > 750 and not final_success:
        struggling = 1

    if not struggling and not final_success:
        for i in range(1, len(attempts)):
            if attempts[i]['test_progress'] < attempts[i-1]['test_progress']:
                struggling = 1
                break
    
    if not struggling and not final_success:
        struggling = 1

    return attempts, struggling, final_success

def create_dataset(num_samples):
    sequences = []
    labels = []
    difficulties = []

    for _ in range(num_samples):
        diff = get_difficulty()
        seq, label, success = generate_sequence(diff)
        sequences.append(seq)
        labels.append(label)
        difficulties.append(diff)
    
    return sequences, labels, difficulties

sequences, labels, difficulties = create_dataset(NUM_SAMPLES)

flat_data = []
for i, seq in enumerate(sequences):
    for attempt in seq:
        row = attempt.copy()
        row['sequence_id'] = i
        row['difficulty'] = difficulties[i]
        row['struggling'] = labels[i]
        row['final_success'] = labels[i] == 0 and attempt['test_progress'] >= 0.99
        flat_data.append(row)

df = pd.DataFrame(flat_data)
print("--- Data Sample ---")
print(df.head(20))
print("-------------------\n")

def pad_features(sequences, max_len=MAX_ATTEMPTS):
    all_times = [a['time_delta'] for seq in sequences for a in seq]
    time_mean = np.mean(all_times)
    time_std = np.std(all_times) + 1e-8

    print(f"--- IMPORTANT FOR FASTAPI ---")
    print(f"TIME_MEAN = {time_mean:.4f}")
    print(f"TIME_STD = {time_std:.4f}")
    print(f"-----------------------------\n")

    arr = []
    for i, seq in enumerate(sequences):
        diff_str = difficulties[i].lower()
        diff_numeric = DIFFICULTY_MAPPING.get(diff_str, 0.5)

        feats = []
        for a in seq:
            vec = [
                a['attempt_num'] / MAX_ATTEMPTS,
                (a['time_delta'] - time_mean) / time_std,
                a['test_progress'],
                diff_numeric
            ]
            feats.append(vec)

        if len(feats) > max_len:
            feats = feats[-max_len:]
        elif len(feats) < max_len:
            padding = [[0]*4 for _ in range(max_len - len(feats))]
            feats = padding + feats

        arr.append(feats)
    
    return np.array(arr, dtype=np.float32)

W = pad_features(sequences, MAX_ATTEMPTS)
Y = np.array(labels, dtype=np.float32)

print(f"Features (X) shape: {W.shape}")
print(f"Labels (Y) shape: {Y.shape}")
print(f"Positive (struggling) samples: {int(sum(Y))} / {NUM_SAMPLES}\n")

W_tensor = torch.tensor(W)
Y_tensor = torch.tensor(Y).unsqueeze(1)

batch_size = 64
dataset = TensorDataset(W_tensor, Y_tensor)
dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

device = torch.device("mps" if torch.backends.mps.is_available() else "cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

model = LSTMPredictor(input_dim=4, n_hidden=51).to(device)

criterion = nn.BCEWithLogitsLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

epochs = 35

print("Starting Training...")
for epoch in range(epochs):
    model.train()
    total_loss = 0.0
    correct_preds = 0
    total_samples = 0

    for batch_x, batch_y in dataloader:
        batch_x, batch_y = batch_x.to(device), batch_y.to(device)

        optimizer.zero_grad()
        logits = model(batch_x)
        loss = criterion(logits, batch_y)

        loss.backward()
        optimizer.step()

        total_loss += loss.item()

        preds = torch.sigmoid(logits).round()
        correct_preds += (preds == batch_y).sum().item()
        total_samples += batch_y.size(0)
    
    avg_loss = total_loss / len(dataloader)
    accuracy = correct_preds / total_samples
    print(f"Epoch [{epoch+1}/{epochs}] | Loss: {avg_loss:.4f} | Accuracy: {accuracy:.4f}")

model_dir = "model"
os.makedirs(model_dir, exist_ok=True)
save_path = os.path.join(model_dir, "struggling_detector1.pth")
torch.save(model.state_dict(), save_path)
print(f"Training complete! Model saved successfully to: {save_path}")