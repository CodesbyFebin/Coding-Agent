/**
 * Auth Controller - signup, login, current-user lookup for the
 * workspace/agent-runtime subsystem's own "User" table.
 */
'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const db = require('../config/db');

const BCRYPT_ROUNDS = 12;
const JWT_EXPIRY = '24h';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
  displayName: z.string().min(1).max(120).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function issueToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

function toPublicUser(user) {
  return { id: user.id, email: user.email, displayName: user.display_name, createdAt: user.created_at };
}

const signup = async (req, res) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { email, password, displayName } = parsed.data;

    const existing = await db('User').where('email', email.toLowerCase()).first();
    if (existing) return res.status(409).json({ error: 'An account with this email already exists' });

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const [user] = await db('User')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        display_name: displayName || null,
      })
      .returning(['id', 'email', 'display_name', 'created_at']);

    const token = issueToken(user);
    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sign up' });
  }
};

const login = async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { email, password } = parsed.data;

    const user = await db('User').where('email', email.toLowerCase()).first();
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = issueToken(user);
    res.json({ token, user: toPublicUser(user) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log in' });
  }
};

const me = async (req, res) => {
  try {
    const user = await db('User').where('id', req.userId).first();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(toPublicUser(user));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch current user' });
  }
};

module.exports = { signup, login, me };
