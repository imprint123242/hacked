const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to serve static files from current directory
app.use(express.static(__dirname));

// Vulnerable endpoint (XSS)
app.get('/greet', (req, res) => {
    const name = req.query.name || 'Guest';
    // WARNING: Vulnerable to XSS - Directly embedding user input without sanitization
    const html = `<p>Hello, ${name}! Thanks for visiting!</p>`;
    res.send(html);
});

// Endpoint to serve sensitive data
app.get('/data', (req, res) => {
    const filePath = path.join(__dirname, 'data.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        res.json(JSON.parse(data));
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});