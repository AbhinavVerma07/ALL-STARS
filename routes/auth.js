import express from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import bcrypt from "bcryptjs"

const router = express.Router()

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataPath = path.join(__dirname, "..", "data", "users.json")

// Helper function to read users data
const getUsers = () => {
  const usersData = fs.readFileSync(dataPath, "utf8")
  return JSON.parse(usersData)
}

// Helper function to write users data
const saveUsers = (users) => {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2))
}

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

    const users = getUsers()

    // Check if user already exists
    if (users.some((user) => user.email === email)) {
      return res.status(400).json({
        status: "error",
        message: "User already exists with this email",
      })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role: "user",
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    saveUsers(users)

    // Don't send password back
    const { password: _, ...userWithoutPassword } = newUser

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: userWithoutPassword,
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      status: "error",
      message: "Server error during registration",
    })
  }
})

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required",
      })
    }

    const users = getUsers()
    const user = users.find((user) => user.email === email)

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      })
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      })
    }

    // Set user in session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      status: "error",
      message: "Server error during login",
    })
  }
})

// Logout user
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Could not log out",
      })
    }

    res.clearCookie("connect.sid")
    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    })
  })
})

// Get current user
router.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      status: "error",
      message: "Not authenticated",
    })
  }

  res.status(200).json({
    status: "success",
    data: req.session.user,
  })
})

export default router

