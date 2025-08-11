# Task Management

## Overview

This project implements a Task Management system with a backend API and a frontend interface. The backend is built using Node.js, and the frontend is developed with React. It includes features like user authentication (login/register), task management, and a user-friendly UI for interaction. Redux is used for state management on the frontend, and API calls are handled using `fetch`.

## Backend Features

### API Endpoints

#### Authentication

- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: Authenticate a user and return a JWT token.
- **POST /api/auth/refreshtoken**: Refresh new token
- **POST /api/users/me**: Get current login info

#### Projects

- **POST /api/project**: Create new Project.
- **GET /api/project**: Fetch all project of current user.
- **GET /api/project/:projectId**: Get Project By Id
- **PUT /api/project/:projectId**: Update an existing project by its ID.
- **DELETE /api/project/:projectId**: Delete a project by its ID.

#### Tasks

- **POST /api/project/:projectId/tasks**: Add a new task.
- **GET /api/project/:projectId/tasks**: Fetch all tasks.
- **GET /api/project/:projectId/tasks/:id**: Fetch a single task by its ID.
- **PUT /api/project/:projectId/tasks/:id**: Update an existing task by its ID.
- **DELETE /api/project/:projectId/tasks/:id**: Delete a task by its ID.

### Tech Stack

- **Backend**: Node.js with a MongoDB database.
- **Deployment**: Deployable on docker compose.

## Frontend Features

### UI Highlights

- Login/Register forms for user authentication.
- Task dashboard for viewing, creating, updating, and deleting tasks.
- Real-time updates via Redux for state management.

### Tech Stack

- **Frontend Framework**: React.js
- **State Management**: Redux
- **API Integration**: Fetch API

### Pages

- **Authentication**: Login, Register UserInfo pages.
- **Project Dashboard**: Displays all project of current login user with options to edit or delete.
- **Project Form**: Allows users to create or update project that is owned.
- **Task Dashboard**: Displays all tasks with options to edit or delete.
- **Task Form**: Allows users to create or update tasks.

## How To Run

### Run docker compose:

```sh
docker compose up -d --build
```

### Run Backend:

```sh
cd nest-server
yarn install
yarn start:dev
```

### Run Frontend:

```sh
cd web-app
yarn install
yarn start
```
