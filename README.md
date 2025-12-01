# Smart Habit + Productivity Tracker

A personal productivity app where users create habits, track streaks, and get insights.

## Contributors
- Adedamola Adejumobi
- Omotayo Oludemi

## Dependencies

### Frontend
- React
- TypeScript
- Tailwind CSS
- Vite

### Backend
- Express.js
- SQLite3
- TypeScript
- bcrypt-ts
- dotenv
- uuid

## Build Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd smart-habit-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   The server runs at `http://localhost:3000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd smart-habit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The app runs at `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register a new user |
| POST | `/api/users/login` | Login user |
| GET | `/app/habits/:userId` | Get all habits for a user |
| POST | `/app/habits/` | Create a new habit |
| DELETE | `/api/habits/:id` | Delete a habit |
| POST | `/api/habits/log` | Log habit completion |
| GET | `/api/reports/weekly/:userId` | Get weekly report |
| GET | `/api/reports/monthly/:userId` | Get monthly report |
| GET | `/api/reminders/:userId` | Get reminder settings |
| PUT | `/api/reminders/:userId` | Update reminder settings |
