# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




EventaSphere - Event Management Dashboard
EventaSphere is a comprehensive, web-based dashboard designed to streamline the process of organizing and managing events. Built as a full-stack application, it provides event organizers with the tools to create events, assign and track tasks, and manage attendees efficiently, all within a modern and responsive user interface.

✨ Features
This dashboard is packed with features to provide a complete event management experience:

User Authentication: Secure user registration and login system using JSON Web Tokens (JWT).

Event Management (CRUD): Full capabilities to create, read, update, and delete events.

Task Management: A detailed system to add tasks to specific events, assign them to attendees, and update their status between "Pending" and "Completed."

Attendee Management: Easily view, add, and remove attendees for any event from a centralized list of registered users.

Dynamic Progress Visualization: A real-time progress bar for each event, automatically calculated based on the completion status of its tasks.

Interactive Calendar View: A full-screen calendar that visually displays all events, allowing for easy navigation and planning.

Professional Notifications: A modern, non-intrusive notification system for all user actions (e.g., creating an event, deleting a task) using toast messages.

Responsive Design: The entire application is fully responsive and works seamlessly on both desktop and mobile devices.

🛠️ Tech Stack
The project is built using a modern MERN-like stack:

Frontend:

React (with Vite for a fast development experience)

Tailwind CSS for utility-first styling

React Router for client-side routing

Axios for making API requests

React Big Calendar for the calendar view

React Hot Toast for notifications

Backend:

Node.js & Express.js for the server and RESTful API

MongoDB (with Mongoose) as the database

JSON Web Tokens (JWT) for authentication

Bcrypt.js for password hashing

🚀 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js (v18 or later recommended)

npm (Node Package Manager)

MongoDB: You can use a local installation or a free cloud instance from MongoDB Atlas.

Backend Setup
Navigate to the backend directory:

Bash

cd backend
Install dependencies:

Bash

npm install
Create an environment file:
Create a file named .env in the root of the backend directory and add the following variables.

Code snippet

# Your MongoDB connection string
MONGO_URI=your_mongodb_connection_string

# A long, random string for signing JWTs
JWT_SECRET=your_super_secret_jwt_key

# The port for the server to run on
PORT=5000
Start the backend server:

Bash

npm run dev
The server will be running on http://localhost:5000.

Frontend Setup
Navigate to the frontend directory:

Bash

cd frontend
Install dependencies:

Bash

npm install
Start the frontend development server:

Bash

npm run dev
The application will be available at http://localhost:5173 (or another port if 5173 is in use).

📋 API Endpoints
The backend provides the following RESTful API endpoints:

Method	Endpoint	Description	Access
POST	/api/users/register	Register a new user.	Public
POST	/api/users/login	Authenticate a user and get a JWT.	Public
GET	/api/users	Get a list of all users.	Private
POST	/api/events	Create a new event.	Private
GET	/api/events	Get all events for the logged-in user.	Private
GET	/api/events/:id	Get details for a single event.	Private
PUT	/api/events/:id	Update an event.	Private
DELETE	/api/events/:id	Delete an event.	Private
POST	/api/events/:id/attendees	Add an attendee to an event.	Private
DELETE	/api/events/:id/attendees	Remove an attendee from an event.	Private
POST	/api/tasks	Create a new task for an event.	Private
GET	/api/tasks/event/:eventId	Get all tasks for a specific event.	Private
PUT	/api/tasks/:id	Update a task's status.	Private
GET	/api/tasks/progress/:eventId	Get the task completion progress for an event.	Private