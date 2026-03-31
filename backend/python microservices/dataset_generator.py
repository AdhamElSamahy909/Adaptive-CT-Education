import numpy as np
import pandas as pd
import random

NUM_SAMPLES = 10000
MAX_ATTEMPTS = 15
DIFFICULTY_PROBS = [0.4, 0.4, 0.2]

DIFFICULTY_MULT = {
    'easy': 1.0,
    'medium': 1.5,
    'hard': 2.0
}

def get_difficulty():
    return np.random.choice(['easy', 'medium', 'hard'], p=DIFFICULTY_PROBS)

def generate_attempt(difficulty, attempt_idx, prev_progress, prev_error, code_len_prev):
    if prev_progress is None:
        progress = np.random.uniform(0, 0.3)
    else:
        delta = np.random.normal(0.05, 0.1)
        delta = np.clip(delta, -0.2, 0.3)
        progress = prev_progress + delta
        progress = np.clip(progress, 0, 1.0)

    if prev_progress is None:
        time_delta = 0
    else:
        time_delta = np.random.exponential(scale=30 + 60 * (1 - prev_progress))

    error_probs = [0.3, 0.3, 0.2, 0.2]
    if progress < 0.3:
        error_probs = [0.1, 0.3, 0.3, 0.3]
    error_type = np.random.choice([0, 1, 2, 3], p=error_probs)

    if code_len_prev is None:
        code_len_change = 0
    else:
        change = np.random.normal(0.1, 0.3)
        code_len_change = np.clip(change, -0.5, 0.8)

    similarity = progress * 0.8 + np.random.normal(0, 0.1)
    similarity = np.clip(similarity, 0, 1)

    consecutive_same_error = 0

    return {
        'attempt_num': attempt_idx,
        'time_delta': time_delta,
        'error_type': error_type,
        'test_progress': progress,
        'code_length_change': code_len_change,
        'similarity_to_solution': similarity,
        'consecutive_same_error': consecutive_same_error
    }, progress, error_type, code_len_prev + code_len_change if code_len_prev else 100

def generate_sequence(difficulty):
    attempts = []
    n_attempts = 0
    final_success = False
    total_time = 0
    max_attempts_limit = 10 * DIFFICULTY_MULT[difficulty]

    prev_progress = None
    prev_error = None
    code_len = 100
    error_history = []

    while n_attempts < MAX_ATTEMPTS and not final_success:
        attempt_data, new_progress, new_error, code_len = generate_attempt(
            difficulty, n_attempts + 1, prev_progress, prev_error, code_len
        )

        error_history.append(new_error)
        if (len(error_history) >= 3 and all(e == new_error for e in error_history[-3:])):
            consecutive_same_error = 3
        else:
            consecutive_same_error = 0
        attempt_data["consecutive_same_error"] = consecutive_same_error

        attempts.append(attempt_data)
        total_time += attempt_data['time_delta']
        n_attempts += 1

        if new_progress >= 0.99:
            final_success = True
            break
        
        prev_progress = new_progress
        prev_error = new_error

    struggling = 0
    if n_attempts > max_attempts_limit:
        struggling = 1
    
    if total_time > 1000 and not final_success:
        struggling = 1

    if not struggling and not final_success:
        for i in range(1, len(attempts)):
            if attempts[i]['test_progress'] < attempts[i-1]['test_progress']:
                struggling = 1
                break
    
    if not struggling and any(a['consecutive_same_error'] >= 3 for a in attempts):
        struggling = 1

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
print(df.head(20))

def pad_features(sequences, max_len=MAX_ATTEMPTS):
    feature_names = ['attempt_num', 'time_delta', 'error_type', 'test_progress', 'code_length_change',
                     'similarity_to_solution', 'consecutive_same_error']
    
    all_times = [a['time_delta'] for seq in sequences for a in seq]
    time_mean = np.mean(all_times)
    time_std = np.std(all_times) + 1e-8

    arr = []
    for seq in sequences:
        feats = []
        for a in seq:
            vec = [
                a['attempt_num'] / MAX_ATTEMPTS,
                (a['time_delta'] - time_mean) / time_std,
                a['error_type'] / 3.0,
                a['test_progress'],
                a['code_length_change'],
                a['similarity_to_solution'],
                a['consecutive_same_error'] / 3.0
            ]
            feats.append(vec)
        if len(feats) > max_len:
            feats = feats[-max_len:]
        elif len(feats) < max_len:
            padding = [[0]*7 for _ in range(max_len - len(feats))]
            feats = padding + feats
        arr.append(feats)
    return np.array(arr, dtype=np.float32)

W = pad_features(sequences, MAX_ATTEMPTS)
Y = np.array(labels, dtype=np.int32)

print(f"X shape: {W.shape}")
print(f"Y shape: {Y.shape}")
print(f"Positive (struggling) samples: {sum(Y)}")