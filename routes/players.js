import express from "express";
import mongoose from "mongoose";
import Player from "../models/Player.js";

const router = express.Router();

// Validate ObjectId
router.param("id", (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid player ID" });
  }
  next();
});

// Get all players (sorted by join date)
router.get("/", async (req, res) => {
  try {
    const players = await Player.find().sort({ joined: -1 });
    res.status(200).json(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    res.status(500).json({ error: "Error fetching players" });
  }
});

// Get player by ID
router.get("/:id", async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ error: "Player not found" });
    res.status(200).json(player);
  } catch (error) {
    console.error("Error fetching player:", error);
    res.status(500).json({ error: "Error fetching player" });
  }
});

// Add new player
router.post("/", async (req, res) => {
  const { name, age, position } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Name is required and must be a string" });
  }

  try {
    const player = new Player({ name, age, position });
    await player.save();
    res.status(201).json(player);
  } catch (error) {
    console.error("Error adding player:", error);
    res.status(500).json({ error: "Error adding player" });
  }
});

// Update player
router.put("/:id", async (req, res) => {
  const { name, age, position } = req.body;

  if (name && typeof name !== "string") {
    return res.status(400).json({ error: "Name must be a string" });
  }

  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      { name, age, position },
      { new: true, runValidators: true }
    );
    if (!player) return res.status(404).json({ error: "Player not found" });

    res.status(200).json(player);
  } catch (error) {
    console.error("Error updating player:", error);
    res.status(500).json({ error: "Error updating player" });
  }
});

// Delete player
router.delete("/:id", async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) return res.status(404).json({ error: "Player not found" });

    res.status(200).json({ message: "Player deleted successfully" });
  } catch (error) {
    console.error("Error deleting player:", error);
    res.status(500).json({ error: "Error deleting player" });
  }
});

export default router;