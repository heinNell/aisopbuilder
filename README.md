# 🚀 AI SOP Builder

A cutting-edge, AI-powered Standard Operating Procedure (SOP) builder that leverages advanced AI technology to create, improve, and analyze professional documentation with unprecedented ease and sophistication.

## ✨ Features

- **🎯 AI-Powered Generation**: Create professional SOPs from scratch using GPT-4
- **🚀 Smart Improvement**: Enhance existing SOPs with AI-driven suggestions
- **📊 Deep Analysis**: Get comprehensive quality metrics and insights
- **📤 File Upload**: Process PDF, DOC, DOCX, TXT, and MD files
- **💎 Modern UI**: Futuristic, glass-morphism design with smooth animations
- **⚡ Real-time Processing**: Lightning-fast document generation and analysis
- **✓ ISO Compliant**: Meet ISO 9001 and industry best practices automatically

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **OpenAI GPT-3.5-Turbo** - AI-powered text generation
- **Multer** - File upload handling
- **PDF-Parse** - PDF text extraction
- **Mammoth** - Word document processing

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/heinNell/aisopbuilder.git
   cd aisopbuilder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   PORT=3001
   VITE_API_URL=http://localhost:3001
   ```

4. **Start the application**

   **Option A: Run both frontend and backend together**
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run dev
   ```

   **Option B: Using separate terminals**
   ```bash
   # Terminal 1 - Start backend
   node backend/server.js
   
   # Terminal 2 - Start frontend
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📖 Usage Guide

### 1. Generate New SOP
- Navigate to "Generate SOP" tab
- Enter the topic/title for your SOP
- Specify department and complexity level
- Add any additional context
- Click "Generate SOP" and watch the magic happen!

### 2. Improve Existing SOP
- Go to "Improve SOP" tab
- Paste your existing SOP text
- Select improvement focus area
- Get an enhanced version with recommendations

### 3. Analyze SOP
- Select "Analyze SOP" tab
- Paste your SOP document
- Receive detailed analysis including:
  - Quality scores (Completeness, Clarity, Structure, Compliance)
  - Strengths and weaknesses
  - Missing sections
  - Specific recommendations
  - Executive summary

### 4. Upload & Process Files
- Click "Upload & Process" tab
- Upload PDF, DOC, DOCX, TXT, or MD files
- Get instant text extraction and analysis
- Seamlessly move to improvement workflow

## 🎨 Features in Detail

### AI SOP Agent Capabilities

The intelligent SOP agent can:
- Generate complete SOPs with all standard sections
- Improve existing documentation for clarity and professionalism
- Analyze documents and provide actionable feedback
- Create executive summaries
- Enhance individual sentences with multiple style options
- Generate industry-specific templates

### Standard SOP Sections Generated

1. **Document Information** - Title, ID, version, dates
2. **Purpose and Objective** - Clear goals and rationale
3. **Scope and Applicability** - Who and when it applies
4. **Definitions** - Key terms and acronyms
5. **Responsibilities** - Role assignments
6. **Materials/Equipment** - Required resources
7. **Detailed Procedures** - Step-by-step instructions
8. **Safety Considerations** - Warnings and precautions
9. **Quality Control** - Verification checkpoints
10. **References** - Related documents
11. **Revision History** - Change tracking

## 🔧 API Endpoints

### POST `/api/sop/generate`
Generate a new SOP from parameters
```json
{
  "topic": "Customer Complaint Handling",
  "department": "Customer Service",
  "complexity": "Medium",
  "additionalContext": "Focus on email complaints"
}
```

### POST `/api/sop/improve`
Improve existing SOP text
```json
{
  "text": "Your existing SOP text...",
  "focus": "overall quality, clarity, and completeness"
}
```

### POST `/api/sop/analyze`
Analyze SOP quality and completeness
```json
{
  "text": "Your SOP text to analyze..."
}
```

### POST `/api/sop/summarize`
Generate executive summary
```json
{
  "text": "Your SOP text..."
}
```

### POST `/api/sop/upload`
Upload and process files (multipart/form-data)

## 🎨 Design Philosophy

The UI embraces a **futuristic cyber aesthetic** with:
- **Glass-morphism** - Translucent panels with backdrop blur
- **Gradient accents** - Vibrant color transitions
- **Smooth animations** - Framer Motion powered interactions
- **Neon effects** - Glowing borders and shadows
- **Dark theme** - Easy on the eyes, professional look
- **Responsive design** - Works beautifully on all devices

## 📁 Project Structure

```
aisopbuilder/
├── backend/
│   ├── routes/
│   │   └── sopRoutes.js          # API routes
│   ├── services/
│   │   └── sopAgent.js            # AI SOP generation logic
│   ├── utils/
│   │   ├── fileProcessor.js       # File parsing utilities
│   │   └── setup.js               # Directory setup
│   └── server.js                  # Express server
├── src/
│   ├── components/
│   │   ├── Header.jsx             # App header
│   │   ├── FeatureCards.jsx       # Home page features
│   │   ├── SOPGenerator.jsx       # SOP generation UI
│   │   ├── SOPImprover.jsx        # SOP improvement UI
│   │   ├── SOPAnalyzer.jsx        # SOP analysis UI
│   │   └── FileUpload.jsx         # File upload UI
│   ├── services/
│   │   └── api.js                 # API client
│   ├── App.jsx                    # Main app component
│   ├── main.jsx                   # App entry point
│   └── index.css                  # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🔒 Security Notes

- Never commit your `.env` file or API keys
- The `.gitignore` file is configured to exclude sensitive files
- API key should be stored securely in environment variables
- File uploads are validated and size-limited (10MB max)
- Uploaded files are automatically cleaned up after processing

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT-3.5-Turbo API
- The React and Vite communities
- All contributors and users of this project

## 📞 Support

If you encounter any issues or have questions:
- Check [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
- Open an issue on GitHub
- Review [Setup Documentation](docs/SETUP.md)
- Check [API Documentation](docs/API.md)

## 🗺️ Roadmap

- [ ] Export to multiple formats (PDF, DOCX, HTML)
- [ ] Custom SOP templates library
- [ ] Multi-language support
- [ ] Collaboration features
- [ ] Version control integration
- [ ] Advanced compliance checking
- [ ] Integration with project management tools

---

**Built with ❤️ using AI and modern web technologies**