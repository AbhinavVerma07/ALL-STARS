import express from 'express';
import Player from '../models/Player.js';
import Contact from '../models/Contact.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Dashboard home
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const players = await Player.find().sort({ createdAt: -1 });
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    res.render('dashboard', {
      players,
      contacts,
      user: req.session.user
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).render('error', { error: 'Failed to load dashboard data' });
  }
});

// API endpoint to get current user
router.get('/api/auth/me', isAuthenticated, (req, res) => {
  res.json({
    status: 'success',
    data: req.session.user
  });
});

// API endpoint to add a new player
router.post('/api/players', isAuthenticated, async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();
    res.json({ status: 'success', data: player });
  } catch (error) {
    console.error('Add player error:', error);
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// API endpoint to update player status
router.put('/api/players/:id', isAuthenticated, async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ status: 'success', data: player });
  } catch (error) {
    console.error('Update player error:', error);
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// API endpoint to delete a player
router.delete('/api/players/:id', isAuthenticated, async (req, res) => {
  try {
    await Player.findByIdAndDelete(req.params.id);
    res.json({ status: 'success' });
  } catch (error) {
    console.error('Delete player error:', error);
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// API endpoint to update contact status
router.put('/api/contacts/:id', isAuthenticated, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ status: 'success', data: contact });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(400).json({ status: 'error', message: error.message });
  }
});

export default router; 