import React, { useState, useEffect } from "react";
import { Globe, Shield, Instagram, Music } from "lucide-react";

// Language translations
const translations = {
  id: {
    title: "Desain & Customisasi",
    subtitle: "Code QR Dinamis",
    badge: "Gratis Tanpa Batasan!",
    description: "Hasilkan code QR unik dengan gaya modern dan fitur lengkap.",
    tips: "Tips: Masukkan teks/link ATAU pilih file gambar (auto-generate)",
    textLabel: "Link atau Teks",
    textPlaceholder: "Masukkan link atau teks yang ingin di-QR...",
    or: "ATAU",
    uploadLabel: "Upload Gambar (Auto-Generate QR)",
    fileSelected: "File terpilih:",
    frameLabel: "Pilih Style Frame",
    generateBtn: "✨ Generate QR Magic",
    generating: "Generating...",
    autoGenerating: "Auto-generating QR dari gambar...",
    successTitle: "🎉 QR Code Berhasil Dibuat!",
    downloadBtn: "📥 Download QR Code",
    downloadTip: "Tips: Tahan gambar untuk menyimpan di HP kamu",
    placeholder: "QR Code akan muncul di sini",
    placeholderDesc: "Masukkan teks atau pilih gambar untuk membuat QR code",
    language: "Bahasa",
    safeMode: "Mode Aman",
    safeModeDesc: "Perlindungan dari link berbahaya",
    urlUnsafe:
      "⚠️ URL yang dimasukkan terdeteksi tidak aman dan mungkin berbahaya. Silakan gunakan URL yang aman.",
    checkingUrl: "Memeriksa keamanan URL...",
    copyright: "Dibuat dengan ❤️ oleh",
    followUs: "Ikuti kami:",
  },
  en: {
    title: "Design & Customize",
    subtitle: "Dynamic QR Codes",
    badge: "Free Without Limits!",
    description:
      "Generate unique QR codes with modern style and complete features.",
    tips: "Tips: Enter text/link OR select image file (auto-generate)",
    textLabel: "Link or Text",
    textPlaceholder: "Enter link or text you want to QR...",
    or: "OR",
    uploadLabel: "Upload Image (Auto-Generate QR)",
    fileSelected: "File selected:",
    frameLabel: "Choose Frame Style",
    generateBtn: "✨ Generate QR Magic",
    generating: "Generating...",
    autoGenerating: "Auto-generating QR from image...",
    successTitle: "🎉 QR Code Successfully Created!",
    downloadBtn: "📥 Download QR Code",
    downloadTip: "Tips: Hold image to save on your phone",
    placeholder: "QR Code will appear here",
    placeholderDesc: "Enter text or select image to create QR code",
    language: "Language",
    safeMode: "Safe Mode",
    safeModeDesc: "Protection from harmful links",
    urlUnsafe:
      "⚠️ The entered URL is detected as unsafe and potentially harmful. Please use a safe URL.",
    checkingUrl: "Checking URL safety...",
    copyright: "Made with ❤️ by",
    followUs: "Follow us:",
  },
};

function App() {
  const [textInput, setTextInput] = useState("");
  const [imageInput, setImageInput] = useState(null);
  const [qrUrl, setQrUrl] = useState("");
  const [filename, setFilename] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState("none");
  const [language, setLanguage] = useState("id");
  const [safeMode, setSafeMode] = useState(true);
  const [urlSafetyStatus, setUrlSafetyStatus] = useState(null);
  const [isCheckingUrl, setIsCheckingUrl] = useState(false);

  const t = translations[language];

  // Auto-generate QR when file is selected
  useEffect(() => {
    if (imageInput) {
      handleGenerate();
    }
  }, [imageInput]);

  // Check URL safety when text input changes (with debounce)
  useEffect(() => {
    if (!textInput.trim() || !safeMode) {
      setUrlSafetyStatus(null);
      return;
    }

    // Simple URL pattern check
    const urlPattern = /^(https?:\/\/)/i;
    if (!urlPattern.test(textInput.trim())) {
      setUrlSafetyStatus(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      checkUrlSafety(textInput.trim());
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [textInput, safeMode]);

  // Simple URL safety checker (mock implementation)
  const checkUrlSafety = async (url) => {
    setIsCheckingUrl(true);

    try {
      // Mock safety check - in real implementation, use Google Safe Browsing API
      // or similar service
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simple blacklist check (add more domains as needed)
      const dangerousDomains = [
        "phishing-site.com",
        "malware-domain.org",
        "suspicious-link.net",
        "fake-bank.com",
      ];

      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();

      const isUnsafe = dangerousDomains.some((dangerous) =>
        domain.includes(dangerous)
      );

      setUrlSafetyStatus(isUnsafe ? "unsafe" : "safe");
    } catch (error) {
      console.error("Error checking URL safety:", error);
      setUrlSafetyStatus("safe"); // Default to safe if check fails
    } finally {
      setIsCheckingUrl(false);
    }
  };

  const handleGenerate = async () => {
    // Check if we have either text input or image input
    if (!textInput.trim() && !imageInput) {
      return;
    }

    // Check URL safety before generating
    if (safeMode && urlSafetyStatus === "unsafe") {
      return;
    }

    setIsGenerating(true);
    const formData = new FormData();

    if (textInput.trim()) {
      formData.append("data", textInput);
    }

    if (imageInput) {
      formData.append("image", imageInput);
    }

    formData.append("frame", selectedFrame);

    try {
      const res = await fetch("http://localhost:5000/generate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setQrUrl(data.qr_url);
        setFilename(data.filename);
      } else {
        console.error("Server error:", data.error);
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Manual download function
  const handleDownload = async () => {
    if (!qrUrl) return;

    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      link.href = url;
      link.download = `qrcode_${timestamp}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageInput(file);
    // Clear text input when file is selected since it will auto-generate
    if (file) {
      setTextInput("");
      setUrlSafetyStatus(null);
    }
  };

  const frameOptions = [
    {
      value: "none",
      label: language === "id" ? "Tanpa Frame" : "No Frame",
      preview: "⬜",
    },
    { value: "gradient_purple", label: "Purple Gradient", preview: "🟣" },
    { value: "gradient_rainbow", label: "Rainbow Gradient", preview: "🌈" },
    { value: "neon_glow", label: "Neon Glow", preview: "⚡" },
    { value: "elegant_border", label: "Elegant Border", preview: "🖼️" },
    { value: "modern_shadow", label: "Modern Shadow", preview: "🌑" },
  ];

  const canGenerate =
    textInput.trim() &&
    (!safeMode || urlSafetyStatus !== "unsafe") &&
    !isCheckingUrl;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements - Responsive */}
      <div className="absolute inset-0">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 sm:top-40 right-5 sm:right-10 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-4 sm:-bottom-8 left-10 sm:left-20 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating shapes - Responsive */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 sm:w-2 h-1 sm:h-2 bg-white rounded-full opacity-60 animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-yellow-400 rounded-full opacity-80 animate-ping animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 sm:w-3 h-2 sm:h-3 bg-pink-400 rounded-full opacity-40 animate-ping animation-delay-2000"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Controls */}
        <div className="flex justify-between items-center p-4 sm:p-6">
          {/* Language Selector */}
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-white/60" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white/10 border border-white/30 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
            >
              <option value="id" className="bg-gray-800 text-white">
                🇮🇩 Indonesia
              </option>
              <option value="en" className="bg-gray-800 text-white">
                🇬🇧 English
              </option>
            </select>
          </div>

          {/* Safe Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Shield
              className={`w-4 h-4 ${
                safeMode ? "text-green-400" : "text-white/60"
              }`}
            />
            <button
              onClick={() => setSafeMode(!safeMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                safeMode ? "bg-green-600" : "bg-white/20"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  safeMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-white/80 text-sm hidden sm:inline">
              {t.safeMode}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
          {/* Header - Responsive Typography */}
          <div className="text-center mb-8 sm:mb-12 max-w-6xl px-2">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
              {t.title}
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text">
              {t.subtitle}
            </h2>
            <span className="inline-block text-lg sm:text-xl md:text-2xl lg:text-3xl font-black bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent px-3 sm:px-4 py-1 sm:py-2 border-2 border-green-400 rounded-full animate-pulse">
              {t.badge}
            </span>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg mt-4 sm:mt-6 max-w-2xl mx-auto px-4">
              {t.description}
            </p>
          </div>

          {/* Main Container - Responsive Grid */}
          <div className="w-full max-w-7xl mx-auto mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
              {/* Left Column - Form */}
              <div className="w-full max-w-lg mx-auto lg:mx-0">
                <div className="backdrop-blur-lg bg-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                  {/* Instructions */}
                  <div className="mb-6 p-3 sm:p-4 bg-blue-500/20 rounded-xl border border-blue-400/30">
                    <p className="text-blue-200 text-xs sm:text-sm font-medium">
                      💡 <strong>{t.tips.split(":")[0]}:</strong>{" "}
                      {t.tips.split(":")[1]}
                    </p>
                  </div>

                  {/* Safe Mode Info */}
                  {safeMode && (
                    <div className="mb-4 p-3 bg-green-500/20 rounded-xl border border-green-400/30">
                      <p className="text-green-200 text-xs sm:text-sm font-medium">
                        🛡️ {t.safeModeDesc}
                      </p>
                    </div>
                  )}

                  {/* Text input */}
                  <div className="mb-4 sm:mb-6">
                    <label className="block text-white font-semibold mb-2 text-xs sm:text-sm uppercase tracking-wide">
                      {t.textLabel}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder={t.textPlaceholder}
                        className="w-full p-3 sm:p-4 bg-white/10 border border-white/30 rounded-xl sm:rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/20 text-sm sm:text-base"
                        disabled={imageInput}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4">
                        {isCheckingUrl ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-400"></div>
                        ) : urlSafetyStatus === "safe" ? (
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        ) : urlSafetyStatus === "unsafe" ? (
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>

                    {/* URL Safety Status */}
                    {isCheckingUrl && (
                      <p className="text-yellow-400 text-xs mt-2">
                        🔍 {t.checkingUrl}
                      </p>
                    )}
                    {urlSafetyStatus === "unsafe" && (
                      <p className="text-red-400 text-xs mt-2 p-2 bg-red-500/20 rounded-lg border border-red-400/30">
                        {t.urlUnsafe}
                      </p>
                    )}
                  </div>

                  {/* OR Divider */}
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="flex-1 h-px bg-white/20"></div>
                    <span className="px-3 text-white/60 text-xs sm:text-sm font-medium">
                      {t.or}
                    </span>
                    <div className="flex-1 h-px bg-white/20"></div>
                  </div>

                  {/* File input */}
                  <div className="mb-4 sm:mb-6">
                    <label className="block text-white font-semibold mb-2 text-xs sm:text-sm uppercase tracking-wide">
                      {t.uploadLabel}
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-3 sm:p-4 bg-white/10 border border-white/30 rounded-xl sm:rounded-2xl text-white file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 file:cursor-pointer cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:bg-white/20 text-sm sm:text-base"
                      />
                    </div>
                    {imageInput && (
                      <p className="text-green-400 text-xs sm:text-sm mt-2 font-medium">
                        ✅ {t.fileSelected} {imageInput.name}
                      </p>
                    )}
                  </div>

                  {/* Frame Selection */}
                  <div className="mb-6 sm:mb-8">
                    <label className="block text-white font-semibold mb-2 text-xs sm:text-sm uppercase tracking-wide">
                      {t.frameLabel}
                    </label>
                    <select
                      value={selectedFrame}
                      onChange={(e) => setSelectedFrame(e.target.value)}
                      className="w-full p-3 sm:p-4 bg-white/10 border border-white/30 rounded-xl sm:rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/20 text-sm sm:text-base"
                    >
                      {frameOptions.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                          className="bg-gray-800 text-white"
                        >
                          {opt.preview} {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Generate button - Only show for text input */}
                  {!imageInput && (
                    <button
                      onClick={handleGenerate}
                      disabled={!canGenerate || isGenerating}
                      className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group text-sm sm:text-base"
                    >
                      <div className="absolute cursor-pointer inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10 flex items-center justify-center">
                        {isGenerating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 sm:h-5 w-4 sm:w-5 border-b-2 border-white mr-2"></div>
                            {t.generating}
                          </>
                        ) : (
                          <>{t.generateBtn}</>
                        )}
                      </div>
                    </button>
                  )}

                  {/* Loading state for file upload */}
                  {imageInput && isGenerating && (
                    <div className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl text-center text-sm sm:text-base">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 sm:h-5 w-4 sm:w-5 border-b-2 border-white mr-2"></div>
                        {t.autoGenerating}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - QR Result */}
              <div className="w-full max-w-lg mx-auto lg:mx-0">
                {qrUrl ? (
                  <div className="animate-fade-in">
                    <div className="backdrop-blur-lg bg-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/20">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent text-center">
                        {t.successTitle}
                      </h3>

                      <div className="relative group mb-4 sm:mb-6 cursor-pointer">
                        <img
                          src={qrUrl}
                          alt="QR Code"
                          className="mx-auto w-full max-w-xs sm:max-w-sm rounded-xl sm:rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105 border-4 border-white/20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        <button
                          onClick={handleDownload}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white cursor-pointer font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                        >
                          {t.downloadBtn}
                        </button>

                        <p className="text-gray-300 text-xs sm:text-sm bg-black/20 rounded-xl p-3 sm:p-4 backdrop-blur-sm text-center">
                          💡 <strong>{t.downloadTip.split(":")[0]}:</strong>{" "}
                          {t.downloadTip.split(":")[1]}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="backdrop-blur-lg bg-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 text-center">
                    <div className="text-6xl sm:text-8xl mb-4 opacity-20">
                      📱
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white/60 mb-2">
                      {t.placeholder}
                    </h3>
                    <p className="text-white/40 text-xs sm:text-sm">
                      {t.placeholderDesc}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Copyright */}
        <footer className="bg-black/20 backdrop-blur-lg border-t border-white/10 p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              {/* Copyright */}
              <div className="flex items-center space-x-2 text-white/80">
                <span className="text-sm">{t.copyright}</span>
                <span className="font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                  Rasena
                </span>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                <span className="text-white/60 text-sm hidden sm:inline">
                  {t.followUs}
                </span>
                <div className="flex space-x-3">
                  <a
                    href="https://www.tiktok.com/@hyrasena"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  >
                    <Music className="w-5 h-5 text-white group-hover:animate-pulse" />
                  </a>
                  <a
                    href="https://www.instagram.com/rrssnaaa/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  >
                    <Instagram className="w-5 h-5 text-white group-hover:animate-pulse" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Custom CSS for animations and responsive design */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Smooth scrolling for mobile */
        html {
          scroll-behavior: smooth;
        }

        /* Better mobile touch targets */
        @media (max-width: 640px) {
          button,
          input,
          select,
          textarea {
            min-height: 44px;
          }
        }

        /* High DPI display optimization */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          img {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }
        }

        /* Custom select styling */
        select option {
          background-color: #1f2937;
          color: white;
        }
      `}</style>
    </div>
  );
}

export default App;
