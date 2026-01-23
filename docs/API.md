# API Documentation

## Overview

The AI SOP Builder provides a RESTful API for generating, improving, and analyzing Standard Operating Procedures using AI.

**Base URL:** `http://localhost:3001/api`

**Authentication:** API key required (OpenAI key configured in backend)

## Endpoints

### Health Check

**GET** `/api/health`

Check if the API is running.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-23T10:30:00.000Z"
}
```

---

### Generate SOP

**POST** `/api/sop/generate`

Generate a new SOP from scratch based on provided parameters.

**Request Body:**
```json
{
  "topic": "Customer Complaint Handling",
  "department": "Customer Service",
  "complexity": "Medium",
  "additionalContext": "Focus on email complaints and escalation procedures"
}
```

**Parameters:**
- `topic` (string, required): The subject/title of the SOP
- `department` (string, optional): Department this SOP belongs to
- `complexity` (string, optional): "Simple", "Medium", or "Complex"
- `additionalContext` (string, optional): Additional requirements or details

**Response:**
```json
{
  "success": true,
  "sop": "# STANDARD OPERATING PROCEDURE\n\n**Document ID:** SOP-CS-001...",
  "metadata": {
    "topic": "Customer Complaint Handling",
    "department": "Customer Service",
    "complexity": "Medium",
    "generatedAt": "2026-01-23T10:30:00.000Z"
  }
}
```

**Status Codes:**
- `200`: Success
- `400`: Missing required parameters
- `500`: Server error

---

### Improve SOP

**POST** `/api/sop/improve`

Enhance an existing SOP with AI-powered improvements.

**Request Body:**
```json
{
  "text": "Your existing SOP text content here...",
  "focus": "overall quality, clarity, and completeness"
}
```

**Parameters:**
- `text` (string, required): The existing SOP text to improve
- `focus` (string, optional): What aspect to focus on improving

**Focus Options:**
- "overall quality, clarity, and completeness"
- "formatting and structure"
- "language and professionalism"
- "detail and comprehensiveness"
- "compliance and safety"

**Response:**
```json
{
  "success": true,
  "improvedSOP": "# STANDARD OPERATING PROCEDURE (IMPROVED)...",
  "originalLength": 1500,
  "improvedLength": 2300
}
```

---

### Analyze SOP

**POST** `/api/sop/analyze`

Get comprehensive quality analysis of an SOP.

**Request Body:**
```json
{
  "text": "Your SOP text to analyze..."
}
```

**Parameters:**
- `text` (string, required): The SOP text to analyze

**Response:**
```json
{
  "success": true,
  "analysis": "**Completeness Score**: 85/100\n**Clarity Score**: 90/100...",
  "analyzedAt": "2026-01-23T10:30:00.000Z"
}
```

**Analysis Includes:**
- Completeness Score (0-100)
- Clarity Score (0-100)
- Structure Score (0-100)
- Compliance Score (0-100)
- Strengths list
- Weaknesses list
- Missing sections
- Specific recommendations

---

### Generate Summary

**POST** `/api/sop/summarize`

Create a concise executive summary of an SOP.

**Request Body:**
```json
{
  "text": "Your complete SOP text..."
}
```

**Parameters:**
- `text` (string, required): The SOP text to summarize

**Response:**
```json
{
  "success": true,
  "summary": "**Overview**: This SOP defines the procedure for...\n\n**Key Steps**:\n1. ..."
}
```

---

### Enhance Sentence

**POST** `/api/sop/enhance-sentence`

Improve a single sentence with multiple style options.

**Request Body:**
```json
{
  "sentence": "The employee should do the task properly.",
  "context": "Safety procedure in manufacturing"
}
```

**Parameters:**
- `sentence` (string, required): The sentence to enhance
- `context` (string, optional): Context for better enhancement

**Response:**
```json
{
  "success": true,
  "original": "The employee should do the task properly.",
  "enhanced": "1. Formal: The employee must execute the task according to established protocols...\n2. Concise: Execute the task per protocol.\n3. Technical: The operator shall perform the task in compliance with specification XYZ..."
}
```

---

### Generate Template

**POST** `/api/sop/template`

Generate an industry-specific SOP template.

**Request Body:**
```json
{
  "industry": "Healthcare",
  "processType": "Patient Intake"
}
```

**Parameters:**
- `industry` (string, required): Industry sector
- `processType` (string, required): Type of process/procedure

**Response:**
```json
{
  "success": true,
  "template": "# STANDARD OPERATING PROCEDURE TEMPLATE\n\n[Instructions: Fill in each section...]",
  "metadata": {
    "industry": "Healthcare",
    "processType": "Patient Intake",
    "generatedAt": "2026-01-23T10:30:00.000Z"
  }
}
```

---

### Upload File

**POST** `/api/sop/upload`

Upload and process an existing SOP document.

**Content-Type:** `multipart/form-data`

**Parameters:**
- `file` (file, required): Document file to upload

**Supported Formats:**
- PDF (`.pdf`)
- Word Documents (`.doc`, `.docx`)
- Text Files (`.txt`)
- Markdown (`.md`)

**Max File Size:** 10MB

**Response:**
```json
{
  "success": true,
  "filename": "existing-sop.pdf",
  "extractedText": "Full text content extracted from the file...",
  "analysis": "**Completeness Score**: 75/100...",
  "fileSize": 245678
}
```

---

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "error": "Description of what went wrong",
  "details": "Additional error details (in development mode)"
}
```

**Common Error Codes:**
- `400 Bad Request`: Missing or invalid parameters
- `500 Internal Server Error`: Server-side error (AI service, file processing, etc.)

## Rate Limiting

Currently no rate limiting is implemented. For production use, consider adding rate limiting middleware.

## Example Usage

### Using cURL

**Generate SOP:**
```bash
curl -X POST http://localhost:3001/api/sop/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Safety Equipment Inspection",
    "department": "Safety",
    "complexity": "Medium"
  }'
```

**Upload File:**
```bash
curl -X POST http://localhost:3001/api/sop/upload \
  -F "file=@/path/to/your/sop.pdf"
```

### Using JavaScript Fetch

```javascript
// Generate SOP
const response = await fetch('http://localhost:3001/api/sop/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    topic: 'Safety Equipment Inspection',
    department: 'Safety',
    complexity: 'Medium'
  })
});

const data = await response.json();
console.log(data.sop);
```

```javascript
// Upload File
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:3001/api/sop/upload', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data.extractedText);
```

## Best Practices

1. **Error Handling**: Always handle potential errors in your API calls
2. **File Size**: Keep uploaded files under 10MB
3. **Context**: Provide as much context as possible in `additionalContext` for better results
4. **Retry Logic**: Implement retry logic for failed requests
5. **Timeouts**: Set appropriate timeouts (AI generation can take 10-30 seconds)

## Future Enhancements

Planned API improvements:
- Authentication and API keys
- Rate limiting
- Webhook support for long-running operations
- Batch processing endpoints
- Version history tracking
- Collaboration features

---

For questions or issues, please refer to the main [README.md](../README.md) or open an issue on GitHub.
