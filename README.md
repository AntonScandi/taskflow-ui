# TaskFlow - Project Management System

A full-featured task management system with authentication, role-based permissions, and multiple views.

## Features

- User authentication (register/login)
- Role-based access control (admin/user)
- Multiple task views (Kanban, Timeline, Calendar)
- Task management with comments, subtasks, and progress tracking
- Project management
- User management for admins
- Reports and analytics

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. In a separate terminal, start the backend server:

```bash
npm run server
```

## Usage

### Default Users

For testing purposes, you can use these credentials:

- Admin: alex@example.com / password123
- User: taylor@example.com / password123

Or register a new account.

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login a user

### Users

- `GET /users/me` - Get current user profile

## Tech Stack

- Frontend: React, HeroUI, TailwindCSS
- Backend: Express.js
- Authentication: JWT
- Data Visualization: Recharts
