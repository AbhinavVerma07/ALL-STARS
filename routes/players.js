import express from "express";
import mongoose from "mongoose";
import Player from "../models/Player.js";

const router = express.Router();

// ✅ Validate MongoDB Object ID
router.param("id", (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid player ID" });
  }
  next();
});

// ✅ Get all players
router.get("/", async (req, res) => {
  try {
    const players = await Player.find().sort({ createdAt: -1 });
    res.status(200).json(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get player by ID
router.get("/:id", async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ error: "Player not found" });
    res.status(200).json(player);
  } catch (error) {
    console.error("Error fetching player:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Create new player
router.post("/", async (req, res) => {
  console.log("Request Body:", req.body); // ✅ Debug incoming data

  try {
    const player = new Player(req.body);
    await player.save();
    res.status(201).json(player);
  } catch (error) {
    console.error("❌ Error adding player:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update player
router.put("/:id", async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!player) return res.status(404).json({ error: "Player not found" });
    res.status(200).json(player);
  } catch (error) {
    console.error("❌ Error updating player:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete player
router.delete("/:id", async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) return res.status(404).json({ error: "Player not found" });
    res.status(200).json({ message: "Player deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting player:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;