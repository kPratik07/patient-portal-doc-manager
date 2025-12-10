const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const Document = require('../models/Document');

const router = express.Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const calculateFileHash = (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', (error) => reject(error));
  });
};

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const filehash = await calculateFileHash(req.file.path);
    const existingDocument = await Document.findOne({ filehash });
    if (existingDocument) {
      fs.unlinkSync(req.file.path);
      return res.status(409).json({
        error: 'This file has already been uploaded',
        existingDocument: {
          id: existingDocument._id,
          filename: existingDocument.filename,
          created_at: existingDocument.created_at,
        },
      });
    }

    const document = new Document({
      filename: req.file.originalname,
      filepath: req.file.path,
      filesize: req.file.size,
      filehash: filehash,
    });

    await document.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      document: {
        id: document._id,
        filename: document.filename,
        filesize: document.filesize,
        created_at: document.created_at,
      },
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    if (error.code === 11000) {
      return res.status(409).json({ error: 'This file has already been uploaded' });
    }
    
    res.status(500).json({ error: 'Failed to upload file', details: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const documents = await Document.find().sort({ created_at: -1 });

    res.status(200).json({
      message: 'Documents retrieved successfully',
      documents: documents.map((doc) => ({
        id: doc._id,
        filename: doc.filename,
        filesize: doc.filesize,
        created_at: doc.created_at,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve documents', details: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (!fs.existsSync(document.filepath)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    res.download(document.filepath, document.filename);
  } catch (error) {
    res.status(500).json({ error: 'Failed to download file', details: error.message });
  }
});

router.get('/:id/view', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (!fs.existsSync(document.filepath)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + document.filename + '"');
    res.sendFile(document.filepath);
  } catch (error) {
    res.status(500).json({ error: 'Failed to view file', details: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (fs.existsSync(document.filepath)) {
      fs.unlinkSync(document.filepath);
    }
    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete document', details: error.message });
  }
});

module.exports = router;
