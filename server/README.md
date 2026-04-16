# Project Management System Server

This is the backend for the project management application, built with Express, Node.js, and MongoDB.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory (already created) and set your `MONGODB_URI` and `PORT`.

3. **Run the server**:
   - For development: `npm run dev`
   - For production: `npm start`

## API Endpoints

- `GET /`: Health check
- `GET /api/users`: Get all users
- `POST /api/users/register`: Register a new user
