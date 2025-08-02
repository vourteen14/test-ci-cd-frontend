# Web Application Backend

A simple REST API backend built with Node.js, Express, and PostgreSQL for user management.

## Features

- CRUD operations for user management
- PostgreSQL database with Sequelize ORM
- Input validation with Joi
- RESTful API endpoints
- Health check endpoint

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Validation**: Joi
- **Environment**: Docker support

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL
- Docker (optional)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Run database migrations:
```bash
npm run migrate
```

4. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Docker

Build and run with Docker:
```bash
docker build -t web-app-backend .
docker run -p 3000:3000 web-app-backend
```

## API Endpoints

| Method | Endpoint     | Description     |
| ------ | ------------ | --------------- |
| GET    | `/health`    | Health check    |
| GET    | `/users`     | Get all users   |
| GET    | `/users/:id` | Get user by ID  |
| POST   | `/users`     | Create new user |
| PUT    | `/users/:id` | Update user     |
| DELETE | `/users/:id` | Delete user     |

## Environment Variables

```env
NODE_ENV=development
HOST=127.0.0.1
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=backend
DB_USER=postgres
DB_PASSWORD=password
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo last migration

## Author

Angga Suriana