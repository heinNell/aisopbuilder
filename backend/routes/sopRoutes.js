import express from 'express';
import multer from 'multer';
import sopAgent from '../services/sopAgent.js';
import { extractTextFromFile } from '../utils/fileProcessor.js';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt|md/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname || mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, DOC, DOCX, TXT, and MD files are allowed'));
  }
});

// Generate new SOP
router.post('/generate', async (req, res) => {
  try {
    const { topic, department, complexity, additionalContext } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const sop = await sopAgent.generateSOP({
      topic,
      department,
      complexity,
      additionalContext
    });

    res.json({
      success: true,
      sop,
      metadata: {
        topic,
        department,
        complexity,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating SOP:', error);
    res.status(500).json({ error: 'Failed to generate SOP', details: error.message });
  }
});

// Improve existing SOP
router.post('/improve', async (req, res) => {
  try {
    const { text, focus } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'SOP text is required' });
    }

    const improvedSOP = await sopAgent.improveSOP(text, focus);

    res.json({
      success: true,
      improvedSOP,
      originalLength: text.length,
      improvedLength: improvedSOP.length
    });
  } catch (error) {
    console.error('Error improving SOP:', error);
    res.status(500).json({ error: 'Failed to improve SOP', details: error.message });
  }
});

// Analyze SOP
router.post('/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'SOP text is required' });
    }

    const analysis = await sopAgent.analyzeSOP(text);

    res.json({
      success: true,
      analysis,
      analyzedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error analyzing SOP:', error);
    res.status(500).json({ error: 'Failed to analyze SOP', details: error.message });
  }
});

// Generate summary
router.post('/summarize', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'SOP text is required' });
    }

    const summary = await sopAgent.generateSummary(text);

    res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary', details: error.message });
  }
});

// Enhance sentence
router.post('/enhance-sentence', async (req, res) => {
  try {
    const { sentence, context } = req.body;
    
    if (!sentence) {
      return res.status(400).json({ error: 'Sentence is required' });
    }

    const enhanced = await sopAgent.enhanceSentence(sentence, context);

    res.json({
      success: true,
      original: sentence,
      enhanced
    });
  } catch (error) {
    console.error('Error enhancing sentence:', error);
    res.status(500).json({ error: 'Failed to enhance sentence', details: error.message });
  }
});

// Generate template
router.post('/template', async (req, res) => {
  try {
    const { industry, processType } = req.body;
    
    if (!industry || !processType) {
      return res.status(400).json({ error: 'Industry and process type are required' });
    }

    const template = await sopAgent.generateTemplate(industry, processType);

    res.json({
      success: true,
      template,
      metadata: {
        industry,
        processType,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating template:', error);
    res.status(500).json({ error: 'Failed to generate template', details: error.message });
  }
});

// Upload and process file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const extractedText = await extractTextFromFile(req.file.path, req.file.mimetype);
    
    // Optionally analyze the uploaded SOP
    const analysis = await sopAgent.analyzeSOP(extractedText);

    res.json({
      success: true,
      filename: req.file.originalname,
      extractedText,
      analysis,
      fileSize: req.file.size
    });
  } catch (error) {
    console.error('Error processing uploaded file:', error);
    res.status(500).json({ error: 'Failed to process file', details: error.message });
  }
});

export default router;
