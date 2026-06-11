# MERN Stack Production Setup

A production-ready MERN (MongoDB, Express, React, Node.js) application template utilizing best practices.

## Features

### Backend
- Node.js & Express API
- MongoDB with Mongoose ORM
- Zod schema validation
- Global Error Handling
- JWT Authentication & HTTP-Only cookies
- Express security middleware (Helmet, Rate Limit, Mongo Sanitize, XSS-Clean)
- Organized Controller/Service/Route architecture

### Frontend
- Vite + React 18
- React Router v6 for routing
- Axios instance with JWT automatic rotation interceptors
- Tailwind CSS styling
- Auth Context API

## Quick Start

### Installation

1. Install root dependencies (concurrently):
\`\`\`bash
npm install
\`\`\`

2. Install server dependencies:
\`\`\`bash
cd server
npm install
cd ..
\`\`\`

3. Install client dependencies:
\`\`\`bash
cd client
npm install
cd ..
\`\`\`

### Environment Setup
1. Copy `server/.env.example` to `server/.env` and update the values.
2. Copy `client/.env.example` to `client/.env` and update the values.

### Running the App
Run both frontend and backend concurrently from the root directory:
\`\`\`bash
npm run dev
\`\`\`

Backend runs on \`http://localhost:5000\`
Frontend runs on \`http://localhost:5173\`
