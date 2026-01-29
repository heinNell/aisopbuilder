import { motion } from "framer-motion";
import html2pdf from "html2pdf.js";
import {
  Check,
  Code,
  Copy,
  Download,
  Eye,
  FileText,
  Rocket,
} from "lucide-react";
import { marked } from "marked";
import { useEffect, useState } from "react";
import { improveSOP } from "../services/api";
import MarkdownRenderer from "./MarkdownRenderer";

export default function SOPImprover({ initialContent }) {
  const [sopText, setSopText] = useState("");
  const [focus, setFocus] = useState(
    "overall quality, clarity, and completeness",
  );
  const [improvedSOP, setImprovedSOP] = useState("");
  const [improvementFeedback, setImprovementFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedSOP, setCopiedSOP] = useState(false);
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const [viewMode, setViewMode] = useState("rendered"); // 'rendered' or 'raw'
  const [feedbackViewMode, setFeedbackViewMode] = useState("rendered");

  useEffect(() => {
    if (initialContent) {
      setSopText(initialContent);
    }
  }, [initialContent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await improveSOP({ text: sopText, focus });
      setImprovedSOP(response.improvedSOP);
      setImprovementFeedback(response.improvementFeedback || "");
    } catch (error) {
      alert("Error improving SOP: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopySOP = () => {
    navigator.clipboard.writeText(improvedSOP);
    setCopiedSOP(true);
    setTimeout(() => setCopiedSOP(false), 2000);
  };

  const handleCopyFeedback = () => {
    navigator.clipboard.writeText(improvementFeedback);
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2000);
  };

  const handleDownloadSOP = () => {
    const blob = new Blob([improvedSOP], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Improved-SOP-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadFull = () => {
    const fullContent = improvementFeedback
      ? `${improvedSOP}\n\n---\n\n${improvementFeedback}`
      : improvedSOP;
    const blob = new Blob([fullContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Improved-SOP-Full-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const handleDownloadPDF = () => {
    // Convert markdown to HTML
    const htmlContent = marked.parse(improvedSOP);

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
          <h1>📋 Standard Operating Procedure</h1>
          <p>Generated on ${new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</p>
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
      filename: `Improved-SOP-${new Date().toISOString().split("T")[0]}.pdf`,
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
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gradient">
              Improve Existing SOP
            </h2>
            <p className="text-slate-400 mt-1.5 font-light">
              Enhance your SOP with AI-powered improvements
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-200 font-semibold mb-2.5 text-sm tracking-wide">
              Paste Your Existing SOP *
            </label>
            <textarea
              required
              value={sopText}
              onChange={(e) => setSopText(e.target.value)}
              placeholder="Paste your existing SOP document here..."
              rows={12}
              className="input-field resize-none"
            />
            <p className="text-slate-500 text-xs mt-2 font-light">
              {sopText.length} characters
            </p>
          </div>

          <div>
            <label className="block text-slate-200 font-semibold mb-2.5 text-sm tracking-wide">
              Improvement Focus
            </label>
            <select
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              className="input-field"
            >
              <option value="overall quality, clarity, and completeness">
                Overall Quality
              </option>
              <option value="formatting and structure">
                Formatting & Structure
              </option>
              <option value="language and professionalism">
                Language & Professionalism
              </option>
              <option value="detail and comprehensiveness">
                Detail & Completeness
              </option>
              <option value="compliance and safety">Compliance & Safety</option>
            </select>
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
                Improving Your SOP...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Rocket className="w-5 h-5" />
                Improve SOP
              </span>
            )}
          </motion.button>
        </form>

        {improvedSOP && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-4"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Improved SOP
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
                  onClick={handleCopySOP}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  title="Copy only the improved SOP (without feedback)"
                >
                  {copiedSOP ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copiedSOP ? "Copied!" : "Copy SOP"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadSOP}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg transition-colors"
                  title="Download only the improved SOP"
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
                <MarkdownRenderer content={improvedSOP} />
              </div>
            ) : (
              <div className="code-output">
                <pre>{improvedSOP}</pre>
              </div>
            )}
          </motion.div>
        )}

        {/* Improvement Feedback Section */}
        {improvementFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-4"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="text-xl font-bold text-white tracking-tight">
                📊 Improvement Summary & Feedback
              </h3>
              <div className="flex gap-2">
                {/* View Mode Toggle for Feedback */}
                <div className="flex rounded-lg bg-white/5 p-1">
                  <button
                    onClick={() => setFeedbackViewMode("rendered")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                      feedbackViewMode === "rendered"
                        ? "bg-purple-500 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </button>
                  <button
                    onClick={() => setFeedbackViewMode("raw")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                      feedbackViewMode === "raw"
                        ? "bg-purple-500 text-white"
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
                  onClick={handleCopyFeedback}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  title="Copy improvement feedback"
                >
                  {copiedFeedback ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copiedFeedback ? "Copied!" : "Copy"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadFull}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
                  title="Download SOP with feedback"
                >
                  <Download className="w-4 h-4" />
                  Download Full
                </motion.button>
              </div>
            </div>

            {/* Feedback Display */}
            {feedbackViewMode === "rendered" ? (
              <div className="sop-output border-purple-500/30">
                <MarkdownRenderer content={improvementFeedback} />
              </div>
            ) : (
              <div className="code-output">
                <pre>{improvementFeedback}</pre>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
