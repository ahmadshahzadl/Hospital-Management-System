# Hospital Management System 🏥

A full-stack Hospital Management System built with **React** (frontend) and **Node.js + Express + MongoDB** (backend). It provides a modern, streamlined web interface for managing appointments, doctors, and user authentication.

## 📁 Project Structure
```bash
hms/
├── Client/        # React frontend (Vite)
└── Server/        # Node.js backend (Express + MongoDB)
```

## ✨ Features

### ✅ Frontend (React)
- Built with **Vite** for lightning-fast development
- Routing with **react-router-dom**
- State handling and API integration via **axios**
- Clean and responsive UI

### 🛠 Backend (Express + MongoDB)
- RESTful API using **Express**
- MongoDB database integration via **Mongoose**
- JWT-based authentication
- Password hashing with **bcrypt**
- Environment-based configuration

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 14.x
- **MongoDB** running locally or via cloud (e.g., MongoDB Atlas)

### 🔧 Installation

1️⃣ **Clone the repository**
```bash
git clone https://github.com/your-username/hms.git
cd hms
```

2️⃣ **Setup Backend (Server)**
```bash
cd Server
cp .env-example .env  # Edit with your MongoDB URI and secret
npm install
npm start             # Starts on http://localhost:5000
```

3️⃣ **Setup Frontend (Client)**
```bash
cd ../Client
npm install
npm run dev           # Starts on http://localhost:5173
```

### 🔐 Environment Variables
Create a `.env` file in the `Server` directory with the following:
```ini
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## 📦 Main Dependencies

### Frontend
- `react`
- `react-router-dom`
- `axios`

### Backend
- `express`
- `mongoose`
- `bcryptjs`
- `jsonwebtoken`
- `dotenv`
- `cors`

## 📂 Folder Overview
- **Client/**
  - `src/`: Contains React components and routing
  - `public/`: Static assets
- **Server/**
  - `controllers/`: Logic for routes like appointments, auth, doctors
  - `config/`: MongoDB connection setup
  - `server.js`: App entry point