import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp } from 'lucide-react';
import { analyzeSOP, generateSummary } from '../services/api';

export default function SOPAnalyzer() {
  const [sopText, setSopText] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('analysis');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const [analysisResponse, summaryResponse] = await Promise.all([
        analyzeSOP({ text: sopText }),
        generateSummary({ text: sopText })
      ]);
      
      setAnalysis(analysisResponse.analysis);
      setSummary(summaryResponse.summary);
    } catch (error) {
      alert('Error analyzing SOP: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gradient">Analyze SOP</h2>
            <p className="text-slate-400 mt-1.5 font-light">Get comprehensive insights and quality metrics</p>
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-6">
          <div>
            <label className="block text-slate-200 font-semibold mb-2.5 text-sm tracking-wide">
              Paste Your SOP for Analysis *
            </label>
            <textarea
              required
              value={sopText}
              onChange={(e) => setSopText(e.target.value)}
              placeholder="Paste your SOP document here for comprehensive analysis..."
              rows={12}
              className="input-field resize-none"
            />
            <p className="text-slate-500 text-xs mt-2 font-light">
              {sopText.length} characters
            </p>
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
                Analyzing Your SOP...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Analyze SOP
              </span>
            )}
          </motion.button>
        </form>

        {(analysis || summary) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-4"
          >
            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10 pb-2">
              <button
                onClick={() => setActiveTab('analysis')}
                className={`px-4 py-2 rounded-t-lg font-semibold transition-colors ${
                  activeTab === 'analysis'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                Detailed Analysis
              </button>
              <button
                onClick={() => setActiveTab('summary')}
                className={`px-4 py-2 rounded-t-lg font-semibold transition-colors ${
                  activeTab === 'summary'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                Executive Summary
              </button>
            </div>

            {/* Content */}
            <div className="code-output">
              <pre>
                {activeTab === 'analysis' ? analysis : summary}
              </pre>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
