const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');

async function signup(req, res) {
  try {
    const { email, password, name } = req.body;
    console.log('Signup attempt:', { email, name });

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed, name } });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    console.log('Signup successful:', user.email);
    return res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Signup failed: ' + error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('Password mismatch for:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    console.log('Login successful:', user.email);
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed: ' + error.message });
  }
}

module.exports = { signup, login };


