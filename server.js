import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import expressLayouts from "express-ejs-layouts";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import contactRoutes from "./routes/contact.js";
import indexRoutes from "./routes/index.js";
import playerRoutes from "./routes/players.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Fix for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/allStars', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "allstars_football_academy_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production", maxAge: 86400000 },
  })
);

app.use(morgan("dev"));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());

// Create different rate limiters for different routes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // 50 requests per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many login attempts, please try again later.'
});

const staticLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5000, // 5000 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false
});

// Apply rate limiting to specific routes
app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);
app.use(express.static(path.join(__dirname, "public"), {
    maxAge: '1h', // Cache static files for 1 hour
    etag: true,
    lastModified: true
}));

// Make user available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

const isAuthenticated = (req, res, next) => (req.session.user ? next() : res.redirect("/login"));

// Routes
app.use('/', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/players', playerRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { error: "Something went wrong on the server" });
});

app.use((req, res) => res.status(404).render("404"));

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
