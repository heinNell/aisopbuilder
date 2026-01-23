import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadFile } from '../services/api';

export default function FileUpload({ onFileUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const response = await uploadFile(file);
      setResult(response);
      if (onFileUploaded) {
        onFileUploaded(response.extractedText, response.analysis);
      }
    } catch (err) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gradient">Upload & Process</h2>
            <p className="text-slate-400 mt-1.5 font-light">Upload existing SOPs for analysis and improvement</p>
          </div>
        </div>

        {/* Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-primary-500 hover:bg-white/5 transition-all duration-300 cursor-pointer"
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt,.md"
            className="hidden"
          />
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="inline-block mb-4"
          >
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-2xl">
              <FileText className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
            Click to upload or drag and drop
          </h3>
          <p className="text-slate-400 mb-4 font-light">
            PDF, DOC, DOCX, TXT, or MD files (max 10MB)
          </p>

          {file && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-lg text-primary-300">
              <FileText className="w-4 h-4" />
              <span className="font-semibold">{file.name}</span>
              <span className="text-sm">({formatFileSize(file.size)})</span>
            </div>
          )}
        </div>

        {file && !result && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleUpload}
            disabled={uploading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-button w-full mt-6 py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 loading-spinner" />
                Processing File...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" />
                Upload & Analyze
              </span>
            )}
          </motion.button>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-green-300 font-semibold">File processed successfully!</p>
                <p className="text-green-400 text-sm">
                  Extracted {result.extractedText.length} characters from {result.filename}
                </p>
              </div>
            </div>

            <div className="glass-panel p-6">
              <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Quick Analysis</h3>
              <div className="code-output">
                <pre>
                  {result.analysis}
                </pre>
              </div>
            </div>

            <div className="text-center text-slate-400">
              <p className="font-light">The content has been loaded. Switch to "Improve SOP" to enhance it!</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Supported Formats Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-6 mt-6"
      >
        <h3 className="text-lg font-bold text-white mb-3 tracking-tight">Supported File Formats</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { format: 'PDF', color: 'from-red-500 to-red-600' },
            { format: 'DOC', color: 'from-blue-500 to-blue-600' },
            { format: 'DOCX', color: 'from-blue-500 to-blue-600' },
            { format: 'TXT', color: 'from-gray-500 to-gray-600' },
            { format: 'MD', color: 'from-purple-500 to-purple-600' }
          ].map((item) => (
            <div
              key={item.format}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg"
            >
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color}`} />
              <span className="text-slate-200 font-semibold text-sm">{item.format}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
