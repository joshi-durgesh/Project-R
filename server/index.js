const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const insuranceController = require('./controllers/insuranceController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const dbPath = path.resolve(__dirname, 'db', 'vehicle_sos.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Run schema
    const schema = fs.readFileSync(path.resolve(__dirname, 'db', 'schema.sql'), 'utf8');
    db.exec(schema, (err) => {
      if (err) console.error('Error executing schema:', err.message);
      else console.log('Schema initialized.');
    });
  }
});

// Pass DB instance to controllers
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/api/insurance/fetch-by-rc', insuranceController.fetchByRC);
app.post('/api/insurance/parse-document', upload.single('document'), insuranceController.parseDocument);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
