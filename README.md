# ALL STARS Football Academy Web Application

A web application for managing a football academy, built with Express.js, EJS, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Git (optional, for cloning)

## Setup Instructions

1. Clone the repository (if using git):
   ```bash
   git clone <repository-url>
   cd allstarsfinal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   Create a new file named `.env` in the root directory with the following content:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/allstars
   SESSION_SECRET=your_secure_secret_here
   NODE_ENV=development
   ```

4. Start MongoDB:
   Make sure MongoDB is running on your system. The application will create the database automatically when it first connects.

5. Start the application:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

6. Access the application:
   Open your browser and navigate to `http://localhost:3000`

## Features

- User authentication
- Dashboard for managing players
- Contact form
- Player management system
- Responsive design

## Security Features

- Rate limiting
- Helmet security headers
- Session management
- CORS protection

## Project Structure

```
allstarsfinal/
├── models/         # Database models
├── public/         # Static files
├── routes/         # Route handlers
├── views/          # EJS templates
├── server.js       # Main application file
└── package.json    # Project dependencies
```

## Troubleshooting

1. If MongoDB connection fails:
   - Ensure MongoDB is running
   - Check if the MongoDB URI in .env is correct
   - Verify MongoDB port (default: 27017)

2. If the application doesn't start:
   - Check if all dependencies are installed
   - Verify Node.js version
   - Check if the port is available

## License

ISC