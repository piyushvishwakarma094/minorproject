# TripConnect

A full-stack web application that helps users find travel companions from their city. Built with React.js, Node.js, Express, and MongoDB.

## Features
- **User Authentication:** Secure registration and login with JWT tokens
- **Travel Posts:** Create and browse travel posts with details like from/to cities, date, time, and notes
- **Search & Filter:** Find posts by from city, to city, and date
- **Comments:** Users can comment on posts to express interest
- **Join Trips:** Users can join existing trips as travel companions
- **Real-time Chat:** Private messaging between users using Socket.io
- **User Profiles:** View and edit user profiles with basic information
- **Responsive Design:** Mobile-friendly interface

## Tech Stack
### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- Socket.io-client for real-time chat
- CSS for styling
### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Socket.io for real-time communication

## Project Structure
```
travel-partner-finder/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── posts.js
│   │   ├── users.js
│   │   └── chat.js
│   ├── middleware/
│   │   └── auth.js
│   ├── socket/
│   │   └── socketHandler.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.js
│   ├── public/
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup
Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the backend directory:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/travel-partner-finder
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

Start MongoDB service (if running locally)

Start the backend server:
```bash
npm run dev
```

### Frontend Setup
Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the frontend development server:
```bash
npm start
```

### Quick Setup (All at once)
From the root directory:
```bash
npm run install-all
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts (with optional filters)
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get single post
- `POST /api/posts/:id/comment` - Add comment to post
- `POST /api/posts/:id/join` - Join a trip

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Chat
- `GET /api/chat/:userId` - Get messages with specific user
- `GET /api/chat/conversations/all` - Get all conversations for current user
- `PUT /api/chat/:userId/read` - Mark messages as read

## Usage
- **Register/Login:** Create an account or login to access the platform
- **Browse Posts:** View all travel posts on the homepage
- **Create Post:** Share your travel plans by creating a new post
- **Search:** Use filters to find specific trips
- **Interact:** Comment on posts or join trips
- **Chat:** Message other users privately
- **Profile:** View and edit your profile information

## Development
Running in Development Mode:
- **Backend:** `npm run dev` (includes nodemon for auto-restart)
- **Frontend:** `npm start` (React development server)

## Building for Production
Frontend:
```bash
npm run build
```
(Creates optimized build in `build/` folder)

## Environment Variables
Backend (`.env`):
- **PORT:** Server port (default: 5000)
- **MONGO_URI:** MongoDB connection string
- **JWT_SECRET:** Secret key for JWT tokens

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
# minorhost
# minorhost
# minorclient
# minorclient
# client
