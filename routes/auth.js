import express from "express"
import User from "../models/User.js"
import { isAuthenticated } from "../middleware/auth.js"

const router = express.Router()

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      })
    }

    const user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({
        status: "error",
        message: "User already exists with this email",
      })
    }

    const newUser = new User({
      name,
      email,
      password,
      role: "user",
    })

    await newUser.save()

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      status: "error",
      message: "Server error during registration",
    })
  }
})

// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })

    if (!user) {
      return res.render("login", { error: "Invalid username or password" })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.render("login", { error: "Invalid username or password" })
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role
    }

    res.redirect("/dashboard")
  } catch (error) {
    console.error("Login error:", error)
    res.render("login", { error: "An error occurred during login" })
  }
})

// Logout route
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err)
    }
    res.redirect("/login")
  })
})

// Get current user
router.get("/me", isAuthenticated, (req, res) => {
  res.json({
    status: "success",
    data: req.session.user
  })
})

// Create initial admin user if none exists
router.post("/setup", async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: "admin" })
    if (adminExists) {
      return res.status(400).json({ error: "Admin user already exists" })
    }

    const admin = new User({
      username: "admin",
      password: "admin123", // This will be hashed by the pre-save hook
      role: "admin"
    })

    await admin.save()
    res.json({ message: "Admin user created successfully" })
  } catch (error) {
    console.error("Setup error:", error)
    res.status(500).json({ error: "Error creating admin user" })
  }
})

export default router

