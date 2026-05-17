const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'bridgr',
  password: 'bridgr123',
  host: 'database',
  port: 5432,
  database: 'bridgr',
});

pool.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('✅ Connected to PostgreSQL');
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Bridgr API is running' });
});

// ========== USERS API ==========
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, first_name, last_name, campus, skills, bio FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  const { email, firstName, lastName, campus, skills, bio } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (email, first_name, last_name, campus, skills, bio) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [email, firstName, lastName, campus, skills, bio || '']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== PROJECTS API ==========
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  const { title, description, looking_for, campus, author_email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO projects (title, description, looking_for, campus, author_email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, looking_for, campus, author_email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== EVENTS API ==========
app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY event_date ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/events', async (req, res) => {
  const { title, location, event_date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO events (title, location, event_date) VALUES ($1, $2, $3) RETURNING *',
      [title, location, event_date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== CARPOOLS API ==========
app.get('/api/carpools', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM carpools ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/carpools', async (req, res) => {
  const { from_campus, to_campus, datetime, seats } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO carpools (from_campus, to_campus, datetime, seats) VALUES ($1, $2, $3, $4) RETURNING *',
      [from_campus, to_campus, datetime, seats]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Backend API running on port ${port}`);
});
