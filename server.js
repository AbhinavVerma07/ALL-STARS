import express from "express";
import session from "express-session";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import playerRoutes from "./routes/players.js";
import contactRoutes from "./routes/contact.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Fix for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "allstars_football_academy_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production", maxAge: 86400000 },
  })
);

app.use(morgan("dev"));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });
app.use(limiter);

app.use(express.static(path.join(__dirname, "public")));

const isAuthenticated = (req, res, next) => (req.session.user ? next() : res.redirect("/login.html"));

app.use("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/dashboard", isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, "public", "dashboard.html")));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: "error", message: "Something went wrong on the server" });
});

app.use((req, res) => res.status(404).sendFile(path.join(__dirname, "public", "404.html")));

const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  ["users.json", "players.json", "contacts.json"].forEach((file) => {
    fs.writeFileSync(path.join(dataDir, file), JSON.stringify([], null, 2));
  });
}

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
