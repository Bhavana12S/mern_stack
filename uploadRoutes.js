const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const Agent = require('../models/Agent');
const Task = require('../models/Task');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Helper function to read CSV
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

// POST /api/upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const ext = path.extname(file.originalname).toLowerCase();
    let records = [];

    if (ext === '.csv') {
      records = await readCSV(file.path);
    } else if (ext === '.xlsx' || ext === '.xls') {
      const workbook = XLSX.readFile(file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      records = XLSX.utils.sheet_to_json(sheet);
    } else {
      return res.status(400).json({ message: 'Invalid file format. Only csv, xlsx, xls allowed.' });
    }

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: 'File is empty or invalid format.' });
    }

    // Validate fields
    const requiredFields = ['FirstName', 'Phone', 'Notes'];
    const isValid = records.every(record =>
      requiredFields.every(field => field in record)
    );
    if (!isValid) {
      return res.status(400).json({ message: 'Missing required fields in some rows.' });
    }

    // Fetch agents
    const agents = await Agent.find();
    if (agents.length === 0) {
      return res.status(400).json({ message: 'No agents found to assign tasks.' });
    }

    // Distribute records among agents
    const distributedTasks = records.map((record, index) => {
      const agent = agents[index % agents.length];
      return {
        firstName: record.FirstName,
        phone: record.Phone,
        notes: record.Notes,
        agent: agent._id,
      };
    });

    // Save tasks to DB
    await Task.insertMany(distributedTasks);

    // Clean up file
    fs.unlinkSync(file.path);

    res.status(200).json({ message: 'File processed and tasks assigned successfully.' });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error while processing file.' });
  }
});

module.exports = router;
