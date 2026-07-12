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
