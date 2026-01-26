import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Home, Rocket, Sparkles, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import FeatureCards from "./components/FeatureCards";
import FileUpload from "./components/FileUpload";
import Header from "./components/Header";
import ProviderSettings, {
  getProviderSettings,
} from "./components/ProviderSettings";
import SOPAnalyzer from "./components/SOPAnalyzer";
import SOPGenerator from "./components/SOPGenerator";
import SOPImprover from "./components/SOPImprover";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [uploadedContent, setUploadedContent] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [currentProvider, setCurrentProvider] = useState("groq");

  // Load provider setting on mount and when settings change
  useEffect(() => {
    const settings = getProviderSettings();
    setCurrentProvider(settings.provider);
  }, [showSettings]);

  const tabs = [
    { id: "home", label: "Home", icon: "Home" },
    { id: "generate", label: "Generate SOP", icon: "Sparkles" },
    { id: "improve", label: "Improve SOP", icon: "Rocket" },
    { id: "analyze", label: "Analyze SOP", icon: "BarChart3" },
    { id: "upload", label: "Upload & Process", icon: "Upload" },
  ];

  const handleFileUploaded = (content, analysis) => {
    setUploadedContent({ content, analysis });
    setActiveTab("improve");
  };

  return (
    <div className="min-h-screen cyber-grid relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-400/5 rounded-full blur-3xl animate-pulse-slow delay-500"></div>
      </div>

      <div className="relative z-10">
        <Header
          onSettingsClick={() => setShowSettings(true)}
          currentProvider={currentProvider}
        />

        {/* Provider Settings Modal */}
        <ProviderSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />

        {/* Navigation Tabs */}
        <div className="container mx-auto px-4 mt-8">
          <div className="glass-panel p-2 max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center">
              {tabs.map((tab) => {
                const IconComponent =
                  tab.id === "home"
                    ? Home
                    : tab.id === "generate"
                      ? Sparkles
                      : tab.id === "improve"
                        ? Rocket
                        : tab.id === "analyze"
                          ? BarChart3
                          : Upload;

                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 tracking-tight ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30 scale-105"
                        : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm">{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "home" && <FeatureCards />}
              {activeTab === "generate" && <SOPGenerator />}
              {activeTab === "improve" && (
                <SOPImprover initialContent={uploadedContent?.content} />
              )}
              {activeTab === "analyze" && <SOPAnalyzer />}
              {activeTab === "upload" && (
                <FileUpload onFileUploaded={handleFileUploaded} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 mt-16 text-center text-slate-400">
          <div className="glass-panel p-6 max-w-2xl mx-auto">
            <p className="text-sm font-medium tracking-wide">
              AI SOP Builder — Professional Documentation Made Easy
            </p>
            <p className="text-xs mt-2.5 text-slate-500 font-light tracking-wider">
              Powered by Advanced AI • ISO 9001 Compliant Standards
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
