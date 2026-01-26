import { motion } from "framer-motion";
import { Check, Code, Copy, Download, Eye, Sparkles } from "lucide-react";
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
                >
                  <Download className="w-4 h-4" />
                  Download
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
