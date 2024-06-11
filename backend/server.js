const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: '37.27.71.198', // e.g., 'localhost' or '127.0.0.1' or your remote host
  user: 'mvhinnlf_admin',
  password: 'bUcI=QQt4t~7',
  database: 'mvhinnlf_funlearn_registrations',
  connectTimeout: 10000 // 10 seconds timeout
});

db.connect((err) => {
  if (err) {
    console.error('Failed to connect to MySQL database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

app.post('/registration', (req, res) => {
  const { name, email, phone, interests } = req.body;

  if (!name || !email || !phone || interests.length === 0) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = 'INSERT INTO registrations (name, email, phone, interests) VALUES (?, ?, ?, ?)';
  const values = [name, email, phone, JSON.stringify(interests)];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Failed to insert registration:', err);
      return res.status(500).json({ error: 'Failed to submit registration' });
    }
    res.status(200).json({ message: 'Registration received successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
