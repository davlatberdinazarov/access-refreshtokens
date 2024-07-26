// src/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
};

let refreshTokens = [];

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *       example:
 *         email: user@example.com
 *         password: password123
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *       400:
 *         description: Bad request
 */
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: user@example.com
 *               password: password123
 *     responses:
 *       200:
 *         description: The user was successfully logged in
 *       500:
 *         description: Internal server error
 */
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * @swagger
 * /token:
 *   post:
 *     summary: Refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *             example:
 *               token: your-refresh-token
 *     responses:
 *       200:
 *         description: Access token successfully refreshed
 *       401:
 *         description: Token required
 *       403:
 *         description: Invalid refresh token
 */
router.post('/token', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).send('Token required');
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid refresh token');
    const accessToken = generateAccessToken({ id: user.id });
    res.json({ accessToken });
  });
});

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *             example:
 *               token: your-refresh-token
 *     responses:
 *       204:
 *         description: The user was successfully logged out
 */
router.post('/logout', (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(t => t !== token);
  res.status(204).send();
});

module.exports = router;
