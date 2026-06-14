const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// ========== USERS API ==========
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, email, first_name, last_name, campus, skills, bio, cv_filename FROM users');
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

// Upload CV
app.post('/api/users/:userId/upload-cv', upload.single('cv'), async (req, res) => {
    const { userId } = req.params;
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    try {
        await pool.query('UPDATE users SET cv_filename = $1 WHERE id = $2', [req.file.filename, userId]);
        res.json({ success: true, filename: req.file.filename });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get CV download URL
app.get('/api/users/:userId/cv', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query('SELECT cv_filename FROM users WHERE id = $1', [userId]);
        if (result.rows[0] && result.rows[0].cv_filename) {
            res.json({ cvUrl: `/uploads/${result.rows[0].cv_filename}` });
        } else {
            res.json({ cvUrl: null });
        }
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
    const { title, description, looking_for, campus, author_email, priority } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO projects (title, description, looking_for, campus, author_email, priority) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, looking_for, campus, author_email, priority || 'Normal']
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
