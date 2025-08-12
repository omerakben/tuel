export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                TUEL
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Modern TypeScript Animation Library for React
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
              High-performance components for scroll effects, galleries, interactions, and advanced animations
            </p>

            {/* Package Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
              {[
                '@tuel/scroll', '@tuel/gallery', '@tuel/text-effects',
                '@tuel/three', '@tuel/ui', '@tuel/motion',
                '@tuel/state', '@tuel/interaction', '@tuel/performance',
                '@tuel/tokens', '@tuel/config', '@tuel/utils', '@tuel/gsap'
              ].map((pkg) => (
                <div key={pkg} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <code className="text-sm text-cyan-300 font-mono">{pkg}</code>
                </div>
              ))}
            </div>
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
              <h3 className="text-2xl font-semibold text-white mb-4">🌊 Scroll Effects</h3>
              <p className="text-gray-300 mb-4">
                Smooth parallax scrolling, reveal animations, and scroll-triggered effects
              </p>
              <div className="text-sm text-cyan-300 font-mono">@tuel/scroll</div>
            </div>

            {/* Image Galleries */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-4">🖼️ Image Galleries</h3>
              <p className="text-gray-300 mb-4">
                Advanced gallery components with smooth transitions and responsive layouts
              </p>
              <div className="text-sm text-cyan-300 font-mono">@tuel/gallery</div>
            </div>

            {/* Text Animations */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-4">✨ Text Effects</h3>
              <p className="text-gray-300 mb-4">
                Dynamic text animations, typewriter effects, and character reveals
              </p>
              <div className="text-sm text-cyan-300 font-mono">@tuel/text-effects</div>
            </div>

            {/* 3D Components */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-4">🎮 3D Components</h3>
              <p className="text-gray-300 mb-4">
                Three.js powered 3D scenes, floating objects, and interactive experiences
              </p>
              <div className="text-sm text-cyan-300 font-mono">@tuel/three</div>
            </div>

            {/* UI Components */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-4">🎨 UI Components</h3>
              <p className="text-gray-300 mb-4">
                Beautiful, accessible UI components with built-in animations
              </p>
              <div className="text-sm text-cyan-300 font-mono">@tuel/ui</div>
            </div>

            {/* Performance */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-4">⚡ Performance</h3>
              <p className="text-gray-300 mb-4">
                Optimized performance utilities and monitoring tools
              </p>
              <div className="text-sm text-cyan-300 font-mono">@tuel/performance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Get Started</h2>
          <p className="text-xl text-gray-300 mb-12">
            Install any TUEL package and start building amazing animations
          </p>

          <div className="bg-slate-800 rounded-lg p-6 text-left">
            <div className="text-sm text-gray-400 mb-2"># Install packages</div>
            <code className="text-green-400 font-mono text-lg">
              npm install @tuel/scroll @tuel/gallery @tuel/ui
            </code>
          </div>

          <div className="mt-8 space-x-4">
            <a
              href="https://github.com/omerakben/tuel"
              className="inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View on GitHub
            </a>
            <a
              href="https://www.npmjs.com/search?q=%40tuel"
              className="inline-flex items-center px-6 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Browse Packages
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            Built with ❤️ by{" "}
            <a href="https://github.com/omerakben" className="text-cyan-400 hover:text-cyan-300">
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
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
