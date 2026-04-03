import torch
import torch.nn as nn

class LSTMPredictor(nn.Module):
    def __init__(self, input_dim=7, n_hidden=51):
        super().__init__()
        self.n_hidden = n_hidden
        # lstm1, lstm2, linear
        self.lstm1 = nn.LSTMCell(input_dim, self.n_hidden)
        self.lstm2 = nn.LSTMCell(self.n_hidden, self.n_hidden)
        self.linear = nn.Linear(self.n_hidden, 1)

    def forward(self, x, future=0):
        n_samples = x.size(0)
        device = x.device

        h_t = torch.zeros(n_samples, self.n_hidden, dtype=torch.float32, device=device)
        c_t = torch.zeros(n_samples, self.n_hidden, dtype=torch.float32, device=device)
        h_t2 = torch.zeros(n_samples, self.n_hidden, dtype=torch.float32, device=device)
        c_t2 = torch.zeros(n_samples, self.n_hidden, dtype=torch.float32, device=device)

        for input_t in x.unbind(dim=1):
            h_t, c_t = self.lstm1(input_t, (h_t, c_t))
            h_t2, c_t2 = self.lstm2(h_t, (h_t2, c_t2))
        
        outputs = self.linear(h_t2)
        return outputs