import express from "express"
import Player from "../models/Player.js"

const router = express.Router()

// Get all players
router.get("/", async (req, res) => {
  try {
    const players = await Player.find()
    res.json(players)
  } catch (error) {
    console.error("Error fetching players:", error)
    res.status(500).json({ error: "Error fetching players" })
  }
})

// Add new player
router.post("/", async (req, res) => {
  try {
    const player = new Player(req.body)
    await player.save()
    res.status(201).json(player)
  } catch (error) {
    console.error("Error adding player:", error)
    res.status(500).json({ error: "Error adding player" })
  }
})

// Update player
router.put("/:id", async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!player) {
      return res.status(404).json({ error: "Player not found" })
    }
    
    res.json(player)
  } catch (error) {
    console.error("Error updating player:", error)
    res.status(500).json({ error: "Error updating player" })
  }
})

// Delete player
router.delete("/:id", async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id)
    
    if (!player) {
      return res.status(404).json({ error: "Player not found" })
    }
    
    res.json({ message: "Player deleted successfully" })
  } catch (error) {
    console.error("Error deleting player:", error)
    res.status(500).json({ error: "Error deleting player" })
  }
})

// Get player by ID
router.get("/:id", async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)
    
    if (!player) {
      return res.status(404).json({ error: "Player not found" })
    }
    
    res.json(player)
  } catch (error) {
    console.error("Error fetching player:", error)
    res.status(500).json({ error: "Error fetching player" })
  }
})

export default router

