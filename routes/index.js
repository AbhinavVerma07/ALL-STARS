import express from 'express';
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.render('index');
});

// About page
router.get('/about', (req, res) => {
  res.render('about');
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('contact');
});

// Login page
router.get('/login', (req, res) => {
  res.render('login');
});

export default router; 