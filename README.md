# Adaptive CT Education

Adaptive CT Education is a web application for adaptive learning. It is split into a React frontend and a backend that combines a Node.js server with Python microservices.

## Architecture

The application is organized into three main parts:

1. Frontend
   - A React application built with Vite.
   - Handles user authentication and the main learning experience.
   - Key pages include Login, Lecture, and Exercise.

2. Node.js server
   - Manages authentication and request orchestration.
   - Acts as the bridge between the frontend and the Python microservices.
   - Sends requests to Python when machine learning or code execution features are needed.

3. Python microservices
   - Responsible for machine learning operations.
   - Handles submitted code execution.
   - Provides the adaptive logic used by the learning experience.

## Frontend

The frontend is a React app that provides the user interface for the platform. After signing in, users can access the main learning pages:

- Login page: authenticates the user before entering the app.
- Lecture page: displays lecture slides and related learning content.
- Exercise page: presents exercises adapted to the user level and shows an adaptive guide when the user is struggling.

## Core Adaptive Features

The application adapts the learning experience through three main mechanisms.

### 1. Learning Style Adaptivity

Learning style adaptivity starts with a cold-start challenge that initializes the learning-style Bayesian networks. After that, the Lecture page tracks navigation behavior, especially the `next` and `previous` clicks.

- Every 4 `next` clicks, the tracked click data is sent to the Node server for analysis.
- If `previous` clicks are roughly 50% of the `next` clicks, the opposite style probability is increased.
- Otherwise, the current style probability is increased.
- Learning-style probabilities are clamped so they stay within the `0.2` to `0.8` range.

### 2. Difficulty Adaptivity

Difficulty adaptivity tracks the time it takes a user to successfully solve an exercise and sends that information to the server for analysis.

- The user starts with three equal difficulty probabilities at roughly `0.33` each.
- The initial exercise level is chosen from the least likely level in that distribution.
- If the current level is easy and the solving time is less than `3.5` minutes, the medium probability increases; otherwise the easy probability increases.
- If the current level is medium and the solving time is less than `6.5` minutes, the hard probability increases; otherwise the medium probability increases.
- If the current level is hard and the solving time is more than `12.5` minutes, the medium probability increases; otherwise the hard probability increases.

### 3. Adaptivity to Struggling

As the user works on an exercise, four metrics are tracked and sent to the server on every run click:

- current level
- test case success ratio
- difference in time since the last try
- attempt number

The struggling detector flags a user when any of the following conditions is met:

- Excessive attempts condition: the number of attempts is above the expected threshold for the current difficulty level. Easy flags after more than 5 attempts, medium after more than 7, and hard after more than 10.
- Excessive time condition: the user spends more than 750 seconds, or 12.5 minutes, on the problem without solving it by the end of the attempt sequence.
- Regression condition: if a later attempt performs worse than the immediately previous attempt, the user is flagged for backward progress.
- Unsolved catch-all condition: if the user reaches the maximum attempt cap and never reaches a test progress of `0.99`, they are flagged as struggling regardless of timing or monotonic progress.

When struggling is detected, the adaptive guide shown to the user is based on the learning-style Bayesian network.

Frontend scripts are defined in `frontend/package.json`:

- `npm run dev` - start the Vite development server
- `npm run build` - build the production bundle
- `npm run lint` - run ESLint
- `npm run test` - run the test suite with Vitest

## Backend

### Node.js server

The Node.js server lives in `backend/node server/`. It is the application orchestrator and manages authentication, API routing, and communication with the Python service.

Main entry point:

- `backend/node server/server.js`

Available scripts:

- `npm start` - start the Node server
- `npm test` - run backend tests with Jest

### Python microservices

The Python service lives in `backend/python microservices/`. It focuses on ML and execution workflows, including adaptive modeling and code execution support.

Main entry point:

- `backend/python microservices/main.py`

The Python service uses FastAPI and includes dependencies for machine learning, model inference, and testing.

## Repository Structure

```text
frontend/                  React client
backend/node server/       Authentication and API orchestration server
backend/python microservices/  ML and code execution microservices
adaptive-ct-education-db.exercises.json  Exercise data set
```

## Notes

- The backend expects its runtime configuration, such as database and service connection values, to be provided through environment variables or deployment configuration.
- The Python service is designed to work alongside the Node server rather than as a standalone user-facing app.
