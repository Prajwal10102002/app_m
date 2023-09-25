const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

// Define routes for user operations
router.post('/auth/signup', UserController.signUp);
router.post('/auth/login', UserController.login);
router.post('/auth/logout/:userId', UserController.logout);
// router.get('/getCouponCode', UserController.getCouponCode); // New route
// router.post('/bookShow/:userId/:showId', UserController.bookShow); // New route

module.exports = router;
