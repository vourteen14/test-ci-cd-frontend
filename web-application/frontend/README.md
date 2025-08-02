# Web Application Frontend

A simple Vue.js frontend application for user management with a clean, responsive UI using Bootstrap.

## Features

- User listing with search and pagination
- Create, edit, and delete users
- Responsive design with dark theme
- Toast notifications for user feedback
- Vue Router for navigation
- API integration with backend

## Tech Stack

- **Framework**: Vue.js 3
- **Styling**: Bootstrap 5 (Dark theme)
- **Icons**: FontAwesome
- **HTTP Client**: Axios
- **Routing**: Vue Router
- **Build Tool**: Vue CLI

## Quick Start

### Prerequisites
- Node.js 20+
- Backend API running

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create .env file
VUE_APP_API_URL=http://localhost:3000
```

3. Start the development server:
```bash
npm run serve
```

The application will be available at `http://localhost:8080`

### Production Build

```bash
npm run build
```

### Docker

Build and run with Docker:
```bash
docker build --build-arg VUE_APP_API_URL=http://localhost:3000 -t web-app-frontend .
docker run -p 80:80 web-app-frontend
```

## Project Structure

```
src/
├── views/          # Page components
│   ├── Home.vue    # Homepage
│   ├── User.vue    # User listing
│   └── UserForm.vue # User create/edit form
├── services/       # API and utility services
│   ├── api.js      # API client
│   └── toast.js    # Toast notification service
├── router/         # Vue Router configuration
└── App.vue         # Root component
```

## Environment Variables

```env
VUE_APP_API_URL=http://localhost:3000
```

## Available Scripts

- `npm run serve` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test:unit` - Run unit tests

## Features Overview

### Pages
- **Home** - Welcome page with quick actions
- **Users** - List all users with CRUD operations
- **User Form** - Create or edit user details

### Components
- Responsive navigation bar
- Data tables with actions
- Modal confirmations for deletions
- Toast notifications for feedback
- Form validation

## API Integration

The frontend communicates with the backend API for all user operations. Make sure the backend is running and the `VUE_APP_API_URL` environment variable points to the correct API endpoint.