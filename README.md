# Task Management System
Simple task management system where ssers can create tasks, assign them to other users, mark tasks as complete, and categorize tasks.
## Technical Details

- Framework: Express
- Language: TypeScript
- Environment Variable Management: Dotenv
- API Parameter and Query Validation: Express-Validator
- Authentication: JWT Bearer Token
- Password Hashing: Bcrypt
- Unit Testing and Coverage: Jest and Supertest
- API Documentation: Swagger-UI-Express and Postman
- Database: In-memory arrays and objects for data storage

## Prerequisites

Before you begin, ensure you have met the following requirements:

- [Node.js](https://nodejs.org/) and npm installed on your system.
- [Git](https://git-scm.com/) for version control.

## Getting Started

### Clone the Repository

```bash
git clone <https://github.com/hsiddiqui1479/KSA-backend-challenge.git>
cd KSA-backend-challenge
```

### Install Dependencies

Install project dependencies using npm:

```bash
npm install
```

### Environment Variables

Create a .env file in the project root directory with the following variables:

```bash
SECRET_KEY=your-secret-key
PORT=4001
```

### Run the Server

Start the Node.js server:

```bash
npm start
```

The server will be running on http://localhost:3000 by default

## API Documentation

You can access the API documentation by visiting:

```bash
http://localhost:3000/api-docs
```

This documentation is generated using Swagger.

## Running Tests

To run the unit tests with coverage:

```bash
npm test
```

Unit tests are written using **JEST** and **supertest** libraries.

## How to Use

You can use Postman or any other API client to interact with the endpoints. Use the following routes:

- Sign up: `POST /api/auth/signup`
- Sign in: `POST /api/auth/signin`
- Create a new task: `POST /api/task`
- Retrieve a task by its ID: `GET /api/task/:id`
- Update a specific task: `PUT /api/task/:id`
- Delete a specific task: `DELETE /api/task/:id`
- Retrieve all tasks with pagination and filtering by **assignedTo** and **category**: `GET /api/tasks`

### JWT Authentication

To perform any authenticated actions, provide the JWT Bearer token in the Authorization header. Obtain the token by signing up or signing in via the respective routes.
