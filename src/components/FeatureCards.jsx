import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, BarChart3, Upload, Zap, Shield } from 'lucide-react';

export default function FeatureCards() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Generation',
      description: 'Create professional SOPs from scratch using advanced AI technology',
      color: 'from-primary-500 to-primary-600',
      delay: 0.1
    },
    {
      icon: Target,
      title: 'Smart Improvement',
      description: 'Enhance existing SOPs with AI-driven suggestions and formatting',
      color: 'from-purple-500 to-purple-600',
      delay: 0.2
    },
    {
      icon: BarChart3,
      title: 'Deep Analysis',
      description: 'Get comprehensive insights and quality scores for your documents',
      color: 'from-green-500 to-green-600',
      delay: 0.3
    },
    {
      icon: Upload,
      title: 'File Processing',
      description: 'Upload existing documents in PDF, DOC, or TXT format',
      color: 'from-orange-500 to-orange-600',
      delay: 0.4
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Generate complete, professional SOPs in seconds',
      color: 'from-yellow-500 to-yellow-600',
      delay: 0.5
    },
    {
      icon: Shield,
      title: 'ISO Compliant',
      description: 'Meet industry standards and best practices automatically',
      color: 'from-blue-500 to-blue-600',
      delay: 0.6
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-5xl font-bold text-gradient mb-4 tracking-tight">
          Welcome to the Future of SOP Documentation
        </h2>
        <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed font-light">
          Transform your Standard Operating Procedures with cutting-edge AI technology.
          Create, improve, and analyze professional documents with unprecedented ease.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: feature.delay }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="feature-card group"
          >
            <div className={`bg-gradient-to-r ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
              <feature.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
              {feature.title}
            </h3>
            <p className="text-slate-400 leading-relaxed text-[0.95rem]">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-panel p-8 mt-12 text-center"
      >
        <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
          Ready to Get Started?
        </h3>
        <p className="text-slate-300 mb-6 max-w-2xl mx-auto leading-relaxed font-light">
          Choose a feature from the navigation above to begin creating professional,
          industry-standard SOPs in minutes.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="badge badge-primary flex items-center gap-2 py-3 px-6 text-sm font-semibold"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            ISO 9001 Compliant
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="badge badge-success flex items-center gap-2 py-3 px-6 text-sm font-semibold"
          >
            <Zap className="w-4 h-4" />
            Lightning Fast
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="badge badge-primary flex items-center gap-2 py-3 px-6 text-sm font-semibold"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
