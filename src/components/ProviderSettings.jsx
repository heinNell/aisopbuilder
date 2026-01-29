import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Cpu,
  RefreshCw,
  Settings,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

// Provider configurations with descriptions
const PROVIDER_INFO = {
  groq: {
    name: "Groq",
    description: "Fast inference, free tier available",
    speed: "Very Fast",
    models: [
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",
      "meta-llama/llama-4-scout-17b-16e-instruct",
      "meta-llama/llama-4-maverick-17b-128e-instruct",
      "qwen/qwen3-32b",
      "moonshotai/kimi-k2-instruct",
      "groq/compound",
      "groq/compound-mini",
    ],
    recommended: true,
  },
  openai: {
    name: "OpenAI",
    description: "GPT-4 and GPT-5 models, high quality",
    speed: "Medium",
    models: [
      "gpt-5",
      "gpt-5-mini",
      "gpt-5-nano",
      "gpt-4.1",
      "gpt-4.1-mini",
      "gpt-4.1-nano",
      "gpt-4-turbo",
      "gpt-4",
      "gpt-3.5-turbo",
    ],
  },
  anthropic: {
    name: "Anthropic",
    description: "Claude models - advanced reasoning",
    speed: "Fast",
    models: [
      "claude-opus-4-5-20251101",
      "claude-sonnet-4-5-20250929",
      "claude-haiku-4-5-20251001",
      "claude-opus-4-20250514",
      "claude-sonnet-4-20250514",
      "claude-3-7-sonnet-20250219",
      "claude-3-5-haiku-20241022",
      "claude-3-haiku-20240307",
    ],
  },
  openrouter: {
    name: "OpenRouter",
    description: "Access to Claude, Gemini, and more",
    speed: "Varies",
    models: [
      "google/gemini-2.0-flash-exp:free",
      "meta-llama/llama-3.3-70b-instruct:free",
      "qwen/qwen-2.5-72b-instruct:free",
      "anthropic/claude-3-5-sonnet",
      "openai/gpt-4o",
    ],
  },
  together: {
    name: "Together AI",
    description: "Llama models with fast inference",
    speed: "Fast",
    models: [
      "meta-llama/Meta-Llama-3.3-70B-Instruct-Turbo",
      "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
      "Qwen/Qwen2.5-72B-Instruct-Turbo",
    ],
  },
  cerebras: {
    name: "Cerebras",
    description: "Ultra-fast inference, free tier",
    speed: "Ultra Fast",
    models: ["llama3.1-70b", "llama3.1-8b"],
  },
};

// Get/set preferences from localStorage
export function getProviderSettings() {
  try {
    const saved = localStorage.getItem("aiProviderSettings");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error loading settings:", e);
  }
  return { provider: "groq", model: null, autoFallback: true };
}

export function saveProviderSettings(settings) {
  localStorage.setItem("aiProviderSettings", JSON.stringify(settings));
}

export default function ProviderSettings({ isOpen, onClose }) {
  const [settings, setSettings] = useState(getProviderSettings());
  const [providerStatus, setProviderStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModels, setShowModels] = useState(false);
  const [healthError, setHealthError] = useState(null);

  // Fetch provider health on mount
  useEffect(() => {
    if (isOpen) {
      checkProviderHealth();
    }
  }, [isOpen]);

  // Save settings when changed
  useEffect(() => {
    saveProviderSettings(settings);
  }, [settings]);

  const checkProviderHealth = async () => {
    setLoading(true);
    setHealthError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${API_URL}/api/ai/health`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setProviderStatus(data.providers || {});
    } catch (error) {
      console.error("Failed to check provider health:", error);
      setHealthError(
        "Unable to connect to server. Make sure the backend is running.",
      );
      // Set default status for UI
      setProviderStatus({
        groq: { configured: true, available: false },
        openai: { configured: false, available: false },
        anthropic: { configured: false, available: false },
        openrouter: { configured: false, available: false },
        together: { configured: false, available: false },
        cerebras: { configured: false, available: false },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProviderChange = (provider) => {
    setSettings({
      ...settings,
      provider,
      model: null, // Reset model when provider changes
    });
  };

  const handleModelChange = (model) => {
    setSettings({ ...settings, model });
    setShowModels(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-panel p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-2 rounded-lg">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  AI Provider Settings
                </h2>
                <p className="text-sm text-slate-400">
                  Choose your preferred AI model
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Refresh Status */}
          <button
            onClick={checkProviderHealth}
            disabled={loading}
            className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 mb-4"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Checking..." : "Refresh Status"}
          </button>

          {/* Error Message */}
          {healthError && (
            <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm text-amber-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {healthError}
              </p>
            </div>
          )}

          {/* Provider Selection */}
          <div className="space-y-3 mb-6">
            <label className="block text-sm font-medium text-slate-300">
              Select Provider
            </label>
            {Object.entries(PROVIDER_INFO).map(([id, info]) => {
              const status = providerStatus[id];
              const isSelected = settings.provider === id;
              const isAvailable = status?.available;
              // Allow selection even if status unknown (health check failed)
              const isConfigured = status?.configured !== false;
              const statusUnknown = !status;

              return (
                <motion.button
                  key={id}
                  onClick={() => handleProviderChange(id)}
                  className={`w-full p-4 rounded-xl border transition-all text-left ${
                    isSelected
                      ? "border-primary-500 bg-primary-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  } ${status?.configured === false ? "opacity-50" : ""}`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                          {info.name}
                        </span>
                        {info.recommended && (
                          <span className="badge badge-success text-[10px]">
                            Recommended
                          </span>
                        )}
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-primary-400" />
                        )}
                      </div>
                      <p className="text-sm text-slate-400 mt-1">
                        {info.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Zap className="w-3 h-3" />
                          {info.speed}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {status ? (
                        isAvailable ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-400">
                            <CheckCircle className="w-3 h-3" />
                            Online
                          </span>
                        ) : isConfigured ? (
                          <span className="flex items-center gap-1 text-xs text-amber-400">
                            <AlertCircle className="w-3 h-3" />
                            {status.rateLimited ? "Rate Limited" : "Error"}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            Not Configured
                          </span>
                        )
                      ) : (
                        <span className="text-xs text-slate-500">Unknown</span>
                      )}
                      {status?.responseTime && (
                        <span className="text-xs text-slate-500">
                          {status.responseTime}ms
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Model Selection */}
          {settings.provider && PROVIDER_INFO[settings.provider] && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Select Model (Optional)
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowModels(!showModels)}
                  className="w-full p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-between"
                >
                  <span className="text-slate-200">
                    {settings.model ||
                      `Default (${PROVIDER_INFO[settings.provider].models[0]})`}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${showModels ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {showModels && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl border border-white/10 bg-slate-900 z-10"
                    >
                      <button
                        onClick={() => handleModelChange(null)}
                        className="w-full p-2 text-left rounded-lg hover:bg-white/10 text-slate-300 text-sm"
                      >
                        Default (Auto-select)
                      </button>
                      {PROVIDER_INFO[settings.provider].models.map((model) => (
                        <button
                          key={model}
                          onClick={() => handleModelChange(model)}
                          className={`w-full p-2 text-left rounded-lg hover:bg-white/10 text-sm ${
                            settings.model === model
                              ? "text-primary-400 bg-primary-500/10"
                              : "text-slate-300"
                          }`}
                        >
                          {model}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Auto Fallback Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
            <div>
              <p className="font-medium text-white">Auto Fallback</p>
              <p className="text-sm text-slate-400">
                Automatically try other providers if selected one fails
              </p>
            </div>
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  autoFallback: !settings.autoFallback,
                })
              }
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.autoFallback ? "bg-primary-500" : "bg-slate-600"
              }`}
            >
              <motion.div
                className="absolute top-1 w-4 h-4 bg-white rounded-full"
                animate={{ left: settings.autoFallback ? "1.5rem" : "0.25rem" }}
              />
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
            <p className="text-sm text-primary-200">
              <strong>Note:</strong> API keys are managed securely on the
              server. Contact your administrator to add or update provider API
              keys.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Settings button component for the header
export function ProviderSettingsButton({ onClick }) {
  const settings = getProviderSettings();

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
    >
      <Settings className="w-4 h-4 text-slate-400" />
      <span className="text-sm text-slate-300 hidden sm:inline">
        {PROVIDER_INFO[settings.provider]?.name || "Settings"}
      </span>
    </button>
  );
}
