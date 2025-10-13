"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github, Package, Star, Play } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                TUEL
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto"
            >
              Modern TypeScript Animation Library for React
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto"
            >
              High-performance components for scroll effects, galleries,
              interactions, and advanced animations
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center space-x-8 mb-12"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white flex items-center justify-center">
                  <Package className="w-6 h-6 mr-2 text-cyan-400" />
                  13
                </div>
                <div className="text-sm text-gray-400">Packages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white flex items-center justify-center">
                  <Github className="w-6 h-6 mr-2 text-cyan-400" />
                  Open Source
                </div>
                <div className="text-sm text-gray-400">MIT License</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white flex items-center justify-center">
                  <Star className="w-6 h-6 mr-2 text-cyan-400" />
                  TypeScript
                </div>
                <div className="text-sm text-gray-400">Full Support</div>
              </div>
            </motion.div>

            {/* Package Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto"
            >
              {[
                "@tuel/scroll",
                "@tuel/gallery",
                "@tuel/text-effects",
                "@tuel/three",
                "@tuel/ui",
                "@tuel/motion",
                "@tuel/state",
                "@tuel/interaction",
                "@tuel/performance",
                "@tuel/tokens",
                "@tuel/config",
                "@tuel/utils",
                "@tuel/gsap",
              ].map((pkg, index) => (
                <motion.div
                  key={pkg}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:border-cyan-400/50 transition-all cursor-pointer"
                  onClick={() =>
                    window.open(
                      `https://www.npmjs.com/package/${pkg}`,
                      "_blank"
                    )
                  }
                >
                  <code className="text-sm text-cyan-300 font-mono">{pkg}</code>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Animation Components
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Scroll Effects */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-4">
                🌊 Scroll Effects
              </h3>
              <p className="text-gray-300 mb-4">
                Smooth parallax scrolling, reveal animations, and
                scroll-triggered effects
              </p>
              <div className="text-sm text-cyan-300 font-mono">
                @tuel/scroll
              </div>
            </div>

            {/* Image Galleries */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-4">
                🖼️ Image Galleries
              </h3>
              <p className="text-gray-300 mb-4">
                Advanced gallery components with smooth transitions and
                responsive layouts
              </p>
              <div className="text-sm text-cyan-300 font-mono">
                @tuel/gallery
              </div>
            </div>

            {/* Text Animations */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-4">
                ✨ Text Effects
              </h3>
              <p className="text-gray-300 mb-4">
                Dynamic text animations, typewriter effects, and character
                reveals
              </p>
              <div className="text-sm text-cyan-300 font-mono">
                @tuel/text-effects
              </div>
            </div>

            {/* 3D Components */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-4">
                🎮 3D Components
              </h3>
              <p className="text-gray-300 mb-4">
                Three.js powered 3D scenes, floating objects, and interactive
                experiences
              </p>
              <div className="text-sm text-cyan-300 font-mono">@tuel/three</div>
            </div>

            {/* UI Components */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-4">
                🎨 UI Components
              </h3>
              <p className="text-gray-300 mb-4">
                Beautiful, accessible UI components with built-in animations
              </p>
              <div className="text-sm text-cyan-300 font-mono">@tuel/ui</div>
            </div>

            {/* Performance */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-4">
                ⚡ Performance
              </h3>
              <p className="text-gray-300 mb-4">
                Optimized performance utilities and monitoring tools
              </p>
              <div className="text-sm text-cyan-300 font-mono">
                @tuel/performance
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white mb-8"
          >
            Get Started
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-300 mb-12"
          >
            Install any TUEL package and start building amazing animations
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-slate-800 rounded-lg p-6 text-left mb-8"
          >
            <div className="text-sm text-gray-400 mb-2"># Install packages</div>
            <div className="flex items-center justify-between">
              <code className="text-green-400 font-mono text-lg">
                npm install @tuel/scroll @tuel/gallery @tuel/ui
              </code>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  navigator.clipboard.writeText(
                    "npm install @tuel/scroll @tuel/gallery @tuel/ui"
                  )
                }
                className="ml-4 px-3 py-2 bg-cyan-500 text-black rounded font-medium hover:bg-cyan-400 transition-colors text-sm"
              >
                Copy
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href="/playground"
              className="inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors gap-2"
            >
              <Play size={20} />
              Interactive Playground
              <ArrowRight size={16} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href="https://github.com/omerakben/tuel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors gap-2"
            >
              <Github size={20} />
              View on GitHub
              <ArrowRight size={16} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href="https://www.npmjs.com/search?q=%40tuel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors gap-2"
            >
              <Package size={20} />
              Browse Packages
              <ArrowRight size={16} />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            Built with ❤️ by{" "}
            <a
              href="https://github.com/omerakben"
              className="text-cyan-400 hover:text-cyan-300"
            >
              Omer Akben
            </a>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            TUEL © 2025 - Modern TypeScript Animation Library
          </p>
        </div>
      </footer>
    </div>
  );
}
