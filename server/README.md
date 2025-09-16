# Life Planner App – Backend

Welcome to the **Life Planner App Backend** repository! This backend powers the Life Planner MVP, providing APIs and database management for authentication, timetable, goals, habits, reminders, and more.

## Express.js Server Template

A robust Express.js server template using MongoDB, built with modern ES modules and best practices.

---

## NOTE ⚠️

> **Check the [`src/docs`](src/docs) folder for all modules documentation on specific topics like Authentication, Testing, Database, and Deployment.**
>
> Each module has its own `.md` guide (e.g., `AUTH.md`, `TIMETABLE.md`, `GOALS.md`, `HABITS.md`, `REMINDERS.md`, `DATABASE.md`, `TESTING.md`).
> 
> For database setup, see the `MONGODB_SETUP.md` file in the root directory.
---

## 🚀 Features

- ES Modules support
- MongoDB integration with Mongoose
- Environment configuration
- Express.js middleware setup
- Modular route handling
- Error handling middleware
- Request logging

## 📁 Project Structure
```
server/
│
├── src/
│ ├── config/ # Configuration files
│ │ └── db.js # Database connection setup
│ │
│ ├── controllers/ # Route controllers
│ │ └── sampleController.js
│ │
│ ├── middleware/ # Custom middleware
│ │ ├── auth.js # Authentication middleware
│ │ ├── errorHandler.js # Centralized error handling
│ │ └── requestLogger.js # Logs incoming requests
│ │
│ ├── models/ # Database models (Mongoose schemas)
│ │ └── Sample.js
│ │
│ ├── routes/ # API route definitions
│ │ └── sampleRoutes.js
│ │
│ ├── services/ # Business logic and services
│ │ └── sampleService.js
│ │
│ ├── tests/ # Test files
│ │ └── sample.test.js
│ │
│ └── server.js # Application entry point
│
├── .env # Environment variables (not committed to git)
│
├── .env.example # Template for environment variables
│
├── MONGODB_SETUP.md # MongoDB setup instructions
│
├── package-lock.json # Auto-generated lock file for npm
│
├── package.json # Project metadata & dependencies
│
└── README.md # Project documentation
```


## 🔧 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas URI)
- npm or yarn package manager

## ⚙️ Installation

1. Clone the repository:
````
git clone <repository-url> cd server
````

2. Install dependencies:
````
npm install
````

3. Configure environment variables:
````
cp .env.example .env
````

4. Update the `.env` file with your configuration:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

## 🚦 Running the Server

### Development Mode
Runs the server with hot-reload using nodemon:
````
npm run dev
````

### Production Mode
Starts the server in production mode:
````
npm start
````

## 🌍 Environment Variables

| Variable     | Description                | Default Value                        |
|-------------|----------------------------|-------------------------------------|
| PORT        | Server port number         | 3000                                |
| MONGODB_URI | MongoDB connection string  | `mongodb://localhost:27017/your_database` |

## 📚 API Endpoints

### Sample Routes
- `GET /api/samples` - Get all samples
- `POST /api/samples` - Create a new sample
- `GET /api/samples/:id` - Get a specific sample
- `PUT /api/samples/:id` - Update a sample
- `DELETE /api/samples/:id` - Delete a sample

## 🔒 Authentication

[Check the `docs/AUTH.md` file for details on setting up and using authentication.]

## 🧪 Testing

[Check the `docs/TESTING.md` file for details on running tests.]

## 📦 Production Deployment

1. Ensure all environment variables are properly set
2. Build the application (if needed)
3. Start the server using:
````
npm start
````

## 🛠️ Development Guidelines

1. **Code Style**
    - Use ES modules (`import`/`export`)
    - Follow JSDoc comments for documentation
    - Use async/await for asynchronous operations

2. **Git Workflow**
    - Create feature branches from `main`
    - Use meaningful commit messages
    - Submit pull requests for review

3. **Error Handling**
    - Use the global error handler middleware
    - Always catch async errors
    - Return appropriate HTTP status codes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

[Your chosen license]

## 🆘 Support

For support, please [contact details or process]

---
Happy coding! 🚀