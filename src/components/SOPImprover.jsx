import { motion } from "framer-motion";
import { Check, Code, Copy, Download, Eye, Rocket } from "lucide-react";
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
                  Download SOP
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
