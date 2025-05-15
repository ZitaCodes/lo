// server.js
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const JOURNAL_PATH = './journal.json';

// Get all journal entries
app.get('/journal', (req, res) => {
  fs.readFile(JOURNAL_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading journal.');
    res.send(JSON.parse(data));
  });
});

// Add a new journal entry
app.post('/journal', (req, res) => {
  const newEntry = {
    timestamp: new Date().toISOString(),
    entry: req.body.entry,
  };

  fs.readFile(JOURNAL_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading journal.');
    const journal = JSON.parse(data);
    journal.push(newEntry);

    fs.writeFile(JOURNAL_PATH, JSON.stringify(journal, null, 2), err => {
      if (err) return res.status(500).send('Error writing to journal.');
      res.status(201).send('Entry saved.');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Lighthouse journal backend running on port ${PORT}`);
});
