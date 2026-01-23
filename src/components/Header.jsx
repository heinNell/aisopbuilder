import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="glass-panel mx-4 mt-4 p-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <motion.div
              className="bg-gradient-to-br from-primary-500 to-primary-600 p-3 rounded-2xl shadow-lg"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <FileText className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gradient flex items-center gap-3 tracking-tight">
                AI SOP Builder
                <Sparkles className="w-6 h-6 text-primary-400 animate-pulse" />
              </h1>
              <p className="text-slate-400 text-sm mt-1.5 tracking-wide font-light">
                Professional Standard Operating Procedures, Powered by AI
              </p>
            </div>
          </div>
          
          <motion.div
            className="hidden md:flex items-center space-x-3 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="badge badge-primary flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              AI-Powered
            </span>
            <span className="badge badge-success flex items-center gap-2">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              ISO Compliant
            </span>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
}
