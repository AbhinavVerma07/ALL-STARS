import express from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const router = express.Router()

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataPath = path.join(__dirname, "..", "data", "players.json")

// Helper function to read players data
const getPlayers = () => {
  const playersData = fs.readFileSync(dataPath, "utf8")
  return JSON.parse(playersData)
}

// Helper function to write players data
const savePlayers = (players) => {
  fs.writeFileSync(dataPath, JSON.stringify(players, null, 2))
}

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next()
  }
  res.status(401).json({
    status: "error",
    message: "Not authenticated",
  })
}

// Get all players
router.get("/", (req, res) => {
  try {
    const players = getPlayers()
    res.status(200).json({
      status: "success",
      results: players.length,
      data: players,
    })
  } catch (error) {
    console.error("Error fetching players:", error)
    res.status(500).json({
      status: "error",
      message: "Server error while fetching players",
    })
  }
})

// Get player by ID
router.get("/:id", (req, res) => {
  try {
    const players = getPlayers()
    const player = players.find((p) => p.id === req.params.id)

    if (!player) {
      return res.status(404).json({
        status: "error",
        message: "Player not found",
      })
    }

    res.status(200).json({
      status: "success",
      data: player,
    })
  } catch (error) {
    console.error("Error fetching player:", error)
    res.status(500).json({
      status: "error",
      message: "Server error while fetching player",
    })
  }
})

// Create a new player (admin only)
router.post("/", isAuthenticated, (req, res) => {
  try {
    // Check if user is admin
    if (req.session.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to add players",
      })
    }

    const { name, position, age, stats } = req.body

    if (!name || !position || !age) {
      return res.status(400).json({
        status: "error",
        message: "Name, position, and age are required",
      })
    }

    const players = getPlayers()

    const newPlayer = {
      id: Date.now().toString(),
      name,
      position,
      age: Number.parseInt(age),
      stats: stats || {},
      createdAt: new Date().toISOString(),
    }

    players.push(newPlayer)
    savePlayers(players)

    res.status(201).json({
      status: "success",
      message: "Player added successfully",
      data: newPlayer,
    })
  } catch (error) {
    console.error("Error adding player:", error)
    res.status(500).json({
      status: "error",
      message: "Server error while adding player",
    })
  }
})

// Update player stats
router.patch("/:id/stats", isAuthenticated, (req, res) => {
  try {
    // Check if user is admin
    if (req.session.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update player stats",
      })
    }

    const { stats } = req.body

    if (!stats) {
      return res.status(400).json({
        status: "error",
        message: "Stats are required",
      })
    }

    const players = getPlayers()
    const playerIndex = players.findIndex((p) => p.id === req.params.id)

    if (playerIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: "Player not found",
      })
    }

    // Update player stats
    players[playerIndex].stats = {
      ...players[playerIndex].stats,
      ...stats,
    }

    savePlayers(players)

    res.status(200).json({
      status: "success",
      message: "Player stats updated successfully",
      data: players[playerIndex],
    })
  } catch (error) {
    console.error("Error updating player stats:", error)
    res.status(500).json({
      status: "error",
      message: "Server error while updating player stats",
    })
  }
})

// Delete a player
router.delete("/:id", isAuthenticated, (req, res) => {
  try {
    // Check if user is admin
    if (req.session.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete players",
      })
    }

    const players = getPlayers()
    const filteredPlayers = players.filter((p) => p.id !== req.params.id)

    if (players.length === filteredPlayers.length) {
      return res.status(404).json({
        status: "error",
        message: "Player not found",
      })
    }

    savePlayers(filteredPlayers)

    res.status(200).json({
      status: "success",
      message: "Player deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting player:", error)
    res.status(500).json({
      status: "error",
      message: "Server error while deleting player",
    })
  }
})

export default router

