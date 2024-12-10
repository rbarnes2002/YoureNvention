const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Middleware
app.use(cors({
    origin: '*', // Your S3 domain
    methods: ['GET', 'POST'], // Allow methods as required
    allowedHeaders: ['Content-Type'], // Allow headers like Content-Type
}));
app.use(bodyParser.json()); // Parse JSON data from requests

// MySQL Database Connection
const connection = mysql.createConnection({
    host: 'envention-db.cxeg4yyo0svv.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'wehateSQL',
    database: 'envention'
});

// Home Route (Test API)
app.get('/', (req, res) => {
    res.send('API is working :3');
});

// Products Route
app.get('/products', (req, res) => {
    connection.query('SELECT * FROM product', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching products');
        } else {
            res.json(results);
        }
    });
});

// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    const query = 'SELECT * FROM user WHERE uname = ? AND pass = ?';
    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Database Error:', err); // Logs the error to the console
            return res.status(500).send('Database Error');
        }

        if (results.length > 0) {
            res.status(200).send('Login successful');
        } else {
            res.status(401).send('Invalid username or password');
        }
    });
});

// Start Server
app.listen(3000, '0.0.0.0', () => console.log('Server running on port 3000'));
