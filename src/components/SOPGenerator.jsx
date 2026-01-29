import { motion } from "framer-motion";
import html2pdf from "html2pdf.js";
import {
  Check,
  Code,
  Copy,
  Download,
  Eye,
  FileText,
  Sparkles,
} from "lucide-react";
import { marked } from "marked";
import { useState } from "react";
import { generateSOP } from "../services/api";
import MarkdownRenderer from "./MarkdownRenderer";

export default function SOPGenerator() {
  const [formData, setFormData] = useState({
    topic: "",
    department: "",
    complexity: "Medium",
    additionalContext: "",
  });
  const [generatedSOP, setGeneratedSOP] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState("rendered"); // 'rendered' or 'raw'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await generateSOP(formData);
      setGeneratedSOP(response.sop);
    } catch (error) {
      alert("Error generating SOP: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSOP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedSOP], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SOP-${formData.topic.replace(/\s+/g, "-")}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    // Convert markdown to HTML
    const htmlContent = marked.parse(generatedSOP);

    // Create styled PDF container
    const pdfContainer = document.createElement("div");
    pdfContainer.innerHTML = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.7;
          color: #1e293b;
          background: white;
        }
        .pdf-wrapper {
          padding: 40px 50px;
          max-width: 100%;
        }
        .pdf-header {
          background: linear-gradient(135deg, #0284c7, #0ea5e9, #38bdf8);
          color: white;
          padding: 30px 40px;
          margin: -40px -50px 30px -50px;
          border-radius: 0 0 20px 20px;
        }
        .pdf-header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        .pdf-header p {
          font-size: 12px;
          opacity: 0.9;
        }
        .pdf-content {
          padding: 10px 0;
        }
        h1 {
          font-size: 24px;
          font-weight: 700;
          color: #0c4a6e;
          margin: 30px 0 15px 0;
          padding-bottom: 10px;
          border-bottom: 3px solid #0ea5e9;
        }
        h2 {
          font-size: 20px;
          font-weight: 600;
          color: #075985;
          margin: 25px 0 12px 0;
          padding-bottom: 8px;
          border-bottom: 2px solid #bae6fd;
        }
        h3 {
          font-size: 16px;
          font-weight: 600;
          color: #0284c7;
          margin: 20px 0 10px 0;
        }
        h4 {
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          margin: 15px 0 8px 0;
        }
        p {
          margin: 12px 0;
          color: #334155;
          font-size: 11px;
        }
        ul, ol {
          margin: 12px 0 12px 25px;
          color: #334155;
        }
        li {
          margin: 6px 0;
          font-size: 11px;
        }
        ul li {
          list-style-type: none;
          position: relative;
          padding-left: 18px;
        }
        ul li::before {
          content: "▸";
          position: absolute;
          left: 0;
          color: #0ea5e9;
          font-weight: bold;
        }
        ol {
          counter-reset: item;
          list-style-type: none;
        }
        ol li {
          counter-increment: item;
          position: relative;
          padding-left: 30px;
        }
        ol li::before {
          content: counter(item);
          position: absolute;
          left: 0;
          background: linear-gradient(135deg, #0ea5e9, #38bdf8);
          color: white;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 600;
        }
        blockquote {
          margin: 15px 0;
          padding: 15px 20px;
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          border-left: 4px solid #0ea5e9;
          border-radius: 0 10px 10px 0;
          font-style: italic;
          color: #075985;
        }
        code {
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Consolas', monospace;
          font-size: 10px;
          color: #0284c7;
        }
        pre {
          background: #0f172a;
          color: #e2e8f0;
          padding: 15px 20px;
          border-radius: 10px;
          margin: 15px 0;
          overflow-x: auto;
          font-size: 10px;
        }
        pre code {
          background: transparent;
          color: inherit;
          padding: 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
          font-size: 11px;
        }
        th {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: white;
          padding: 12px 15px;
          text-align: left;
          font-weight: 600;
        }
        td {
          padding: 10px 15px;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
        }
        tr:nth-child(even) {
          background: #f8fafc;
        }
        tr:hover {
          background: #f0f9ff;
        }
        hr {
          margin: 25px 0;
          border: none;
          height: 2px;
          background: linear-gradient(to right, transparent, #0ea5e9, transparent);
        }
        a {
          color: #0284c7;
          text-decoration: none;
        }
        strong {
          color: #0f172a;
          font-weight: 600;
        }
        em {
          color: #0284c7;
        }
        .pdf-footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e2e8f0;
          text-align: center;
          font-size: 10px;
          color: #64748b;
        }
        .pdf-footer .brand {
          color: #0ea5e9;
          font-weight: 600;
        }
      </style>
      <div class="pdf-wrapper">
        <div class="pdf-header">
          <h1>📋 ${formData.topic || "Standard Operating Procedure"}</h1>
          <p>${formData.department ? `Department: ${formData.department} • ` : ""}Generated on ${new Date().toLocaleDateString(
            "en-US",
            {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            },
          )}</p>
        </div>
        <div class="pdf-content">
          ${htmlContent}
        </div>
        <div class="pdf-footer">
          <p>Generated by <span class="brand">AI SOP Builder</span> • Professional SOP Documentation</p>
        </div>
      </div>
    `;

    // PDF options
    const options = {
      margin: 0,
      filename: `SOP-${formData.topic.replace(/\s+/g, "-") || "Document"}-${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    // Generate and download PDF
    html2pdf().set(options).from(pdfContainer).save();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-3 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gradient tracking-tight">
              Generate New SOP
            </h2>
            <p className="text-slate-400 mt-1.5 font-light">
              Create a professional SOP from scratch
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-200 font-semibold mb-2.5 text-sm tracking-wide">
                SOP Topic / Title *
              </label>
              <input
                type="text"
                required
                value={formData.topic}
                onChange={(e) =>
                  setFormData({ ...formData, topic: e.target.value })
                }
                placeholder="e.g., Customer Complaint Handling"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-slate-200 font-semibold mb-2.5 text-sm tracking-wide">
                Department / Area *
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                placeholder="e.g., Customer Service"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-200 font-semibold mb-2.5 text-sm tracking-wide">
              Complexity Level
            </label>
            <select
              value={formData.complexity}
              onChange={(e) =>
                setFormData({ ...formData, complexity: e.target.value })
              }
              className="input-field"
            >
              <option value="Simple">Simple - Basic procedures</option>
              <option value="Medium">Medium - Standard operations</option>
              <option value="Complex">Complex - Advanced procedures</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-200 font-semibold mb-2.5 text-sm tracking-wide">
              Additional Context (Optional)
            </label>
            <textarea
              value={formData.additionalContext}
              onChange={(e) =>
                setFormData({ ...formData, additionalContext: e.target.value })
              }
              placeholder="Provide any specific requirements, industry standards, or additional details..."
              rows={4}
              className="input-field resize-none"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-button w-full py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 loading-spinner" />
                Generating Your SOP...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Generate SOP
              </span>
            )}
          </motion.button>
        </form>

        {generatedSOP && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-4"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Generated SOP
              </h3>
              <div className="flex gap-2">
                {/* View Mode Toggle */}
                <div className="flex rounded-lg bg-white/5 p-1">
                  <button
                    onClick={() => setViewMode("rendered")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                      viewMode === "rendered"
                        ? "bg-primary-500 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </button>
                  <button
                    onClick={() => setViewMode("raw")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                      viewMode === "raw"
                        ? "bg-primary-500 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    Markdown
                  </button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg transition-colors"
                  title="Download as Markdown file"
                >
                  <Download className="w-4 h-4" />
                  Download MD
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 rounded-lg transition-all shadow-lg shadow-emerald-500/20"
                  title="Download as styled PDF"
                >
                  <FileText className="w-4 h-4" />
                  Download PDF
                </motion.button>
              </div>
            </div>

            {/* Output Display */}
            {viewMode === "rendered" ? (
              <div className="sop-output">
                <MarkdownRenderer content={generatedSOP} />
              </div>
            ) : (
              <div className="code-output">
                <pre>{generatedSOP}</pre>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
