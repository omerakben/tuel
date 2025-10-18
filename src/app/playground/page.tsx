"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Copy,
  Download,
  Settings,
  Eye,
  EyeOff,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Palette,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";

// Import TUEL components
import { AnimatedText } from "@tuel/text-effects";
import { MagneticButton } from "@tuel/interaction";
import { Carousel } from "@tuel/ui";
import { HorizontalScroll } from "@tuel/scroll";

// Dynamically import Three.js components to prevent SSR issues
const MorphingShapes = dynamic(() => import("@tuel/three").then(mod => ({ default: mod.MorphingShapes })), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading 3D component...</div>
});

const FloatingObjects = dynamic(() => import("@tuel/three").then(mod => ({ default: mod.FloatingObjects })), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading 3D component...</div>
});


interface CodeExample {
  component: string;
  title: string;
  description: string;
  code: string;
  props: Record<string, unknown>;
  category: string;
}

const codeExamples: CodeExample[] = [
  {
    component: "AnimatedText",
    title: "Animated Text",
    description: "Dynamic text animations with multiple variants",
    category: "Text Effects",
    code: `import { AnimatedText } from "@tuel/text-effects";

export function MyAnimatedText() {
  return (
    <AnimatedText
      variant="fade"
      duration={1000}
      delay={200}
      className="text-4xl font-bold"
    >
      Hello World
    </AnimatedText>
  );
}`,
    props: {
      children: "Hello World",
      variant: "fade",
      duration: 1000,
      delay: 200,
      className: "text-4xl font-bold",
    },
  },
  {
    component: "MagneticButton",
    title: "Magnetic Button",
    description: "Interactive button with magnetic hover effect",
    category: "Interactions",
    code: `import { MagneticButton } from "@tuel/interaction";

export function MyMagneticButton() {
  return (
    <MagneticButton
      onClick={() => console.log("Clicked!")}
      className="px-6 py-3 bg-blue-500 text-white rounded-lg"
    >
      Click Me
    </MagneticButton>
  );
}`,
    props: {
      children: "Click Me",
      className: "px-6 py-3 bg-blue-500 text-white rounded-lg",
    },
  },
  {
    component: "Carousel",
    title: "Image Carousel",
    description: "Responsive carousel with smooth transitions",
    category: "UI Components",
    code: `import { Carousel } from "@tuel/ui";

const slides = [
  { src: "/image1.jpg", alt: "Image 1", title: "First Slide" },
  { src: "/image2.jpg", alt: "Image 2", title: "Second Slide" },
  { src: "/image3.jpg", alt: "Image 3", title: "Third Slide" }
];

export function MyCarousel() {
  return (
    <Carousel
      slides={slides}
      variant="fade"
      autoPlay={true}
      className="w-full h-64"
    />
  );
}`,
    props: {
      slides: [
        { src: "/placeholder1.jpg", alt: "Image 1", title: "First Slide" },
        { src: "/placeholder2.jpg", alt: "Image 2", title: "Second Slide" },
        { src: "/placeholder3.jpg", alt: "Image 3", title: "Third Slide" },
      ],
      variant: "fade",
      autoPlay: true,
      className: "w-full h-64",
    },
  },
  {
    component: "HorizontalScroll",
    title: "Horizontal Scroll",
    description: "Smooth horizontal scrolling effect",
    category: "Scroll Effects",
    code: `import { HorizontalScroll } from "@tuel/scroll";

export function MyHorizontalScroll() {
  return (
    <HorizontalScroll
      className="h-64"
      speed={0.5}
    >
      <div className="flex space-x-4">
        <div className="w-64 h-64 bg-blue-500 rounded-lg"></div>
        <div className="w-64 h-64 bg-green-500 rounded-lg"></div>
        <div className="w-64 h-64 bg-purple-500 rounded-lg"></div>
      </div>
    </HorizontalScroll>
  );
}`,
    props: {
      className: "h-64",
      speed: 0.5,
      children: (
        <div className="flex space-x-4">
          <div className="w-64 h-64 bg-blue-500 rounded-lg"></div>
          <div className="w-64 h-64 bg-green-500 rounded-lg"></div>
          <div className="w-64 h-64 bg-purple-500 rounded-lg"></div>
        </div>
      ),
    },
  },
  {
    component: "MorphingShapes",
    title: "Morphing Shapes",
    description: "3D morphing geometric shapes",
    category: "3D Components",
    code: `import { MorphingShapes } from "@tuel/three";

export function MyMorphingShapes() {
  return (
    <MorphingShapes
      className="w-full h-64"
      morphSpeed={2}
      rotationSpeed={1}
    />
  );
}`,
    props: {
      className: "w-full h-64",
      morphSpeed: 2,
      rotationSpeed: 1,
    },
  },
  {
    component: "FloatingObjects",
    title: "Floating Objects",
    description: "3D floating objects with physics",
    category: "3D Components",
    code: `import { FloatingObjects } from "@tuel/three";

export function MyFloatingObjects() {
  return (
    <FloatingObjects
      className="w-full h-64"
      objectCount={5}
      floatSpeed={1}
    />
  );
}`,
    props: {
      className: "w-full h-64",
      objectCount: 5,
      floatSpeed: 1,
    },
  },
];

export default function Playground() {
  const [selectedComponent, setSelectedComponent] = useState("AnimatedText");
  const [showCode, setShowCode] = useState(true);
  const [showProps, setShowProps] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );
  const [,] = useState<Record<string, unknown>>({});
  const [isPlaying, setIsPlaying] = useState(false);

  const currentExample = codeExamples.find(
    (ex) => ex.component === selectedComponent
  );


  const handleCopyCode = useCallback(() => {
    if (currentExample) {
      navigator.clipboard.writeText(currentExample.code);
    }
  }, [currentExample]);

  const handleDownloadCode = useCallback(() => {
    if (currentExample) {
      const blob = new Blob([currentExample.code], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentExample.component.toLowerCase()}.tsx`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [currentExample]);

  const renderComponent = () => {
    if (!currentExample) return null;

    const props = { ...currentExample.props } as Record<string, unknown>;

    switch (selectedComponent) {
      case "AnimatedText":
        return <AnimatedText {...props}>{props.children as string}</AnimatedText>;
      case "MagneticButton":
        return <MagneticButton {...props}>{props.children as string}</MagneticButton>;
      case "Carousel":
        // @ts-expect-error - props are dynamically loaded from examples
        return <Carousel {...props} />;
      case "HorizontalScroll":
        // @ts-expect-error - props are dynamically loaded from examples
        return <HorizontalScroll {...props} />;
      case "MorphingShapes":
        // @ts-expect-error - props are dynamically loaded from examples
        return <MorphingShapes {...props} />;
      case "FloatingObjects":
        // @ts-expect-error - props are dynamically loaded from examples
        return <FloatingObjects {...props} />;
      default:
        return null;
    }
  };

  const getViewportClass = () => {
    switch (viewMode) {
      case "mobile":
        return "max-w-sm mx-auto";
      case "tablet":
        return "max-w-2xl mx-auto";
      case "desktop":
      default:
        return "max-w-4xl mx-auto";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">TUEL Playground</h1>
              <p className="text-gray-400">Interactive component playground</p>
            </div>

            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("desktop")}
                  className={`p-2 rounded ${
                    viewMode === "desktop" ? "bg-white/20" : ""
                  }`}
                >
                  <Monitor className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => setViewMode("tablet")}
                  className={`p-2 rounded ${
                    viewMode === "tablet" ? "bg-white/20" : ""
                  }`}
                >
                  <Tablet className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => setViewMode("mobile")}
                  className={`p-2 rounded ${
                    viewMode === "mobile" ? "bg-white/20" : ""
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Play/Pause */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                {isPlaying ? (
                  <RefreshCw className="w-4 h-4 text-white" />
                ) : (
                  <Play className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 bg-black/20 backdrop-blur-sm border-r border-white/10 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-white mb-4">
              Components
            </h2>

            {/* Component Categories */}
            {Array.from(new Set(codeExamples.map((ex) => ex.category))).map(
              (category) => (
                <div key={category} className="mb-4">
                  <button
                    onClick={() => setShowProps(!showProps)}
                    className="flex items-center w-full text-left text-gray-300 hover:text-white transition-colors"
                  >
                    {showProps ? (
                      <ChevronDown className="w-4 h-4 mr-2" />
                    ) : (
                      <ChevronRight className="w-4 h-4 mr-2" />
                    )}
                    {category}
                  </button>

                  <AnimatePresence>
                    {showProps && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-6 space-y-2"
                      >
                        {codeExamples
                          .filter((ex) => ex.category === category)
                          .map((example) => (
                            <button
                              key={example.component}
                              onClick={() =>
                                setSelectedComponent(example.component)
                              }
                              className={`block w-full text-left p-2 rounded text-sm transition-colors ${
                                selectedComponent === example.component
                                  ? "bg-blue-500/20 text-blue-300"
                                  : "text-gray-400 hover:text-white hover:bg-white/10"
                              }`}
                            >
                              {example.title}
                            </button>
                          ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Preview Area */}
          <div className="flex-1 p-6">
            <div className={`${getViewportClass()} h-full`}>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 h-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {currentExample?.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowCode(!showCode)}
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      {showCode ? (
                        <EyeOff className="w-4 h-4 text-white" />
                      ) : (
                        <Eye className="w-4 h-4 text-white" />
                      )}
                    </button>
                    <button
                      onClick={handleCopyCode}
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <Copy className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={handleDownloadCode}
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                <div className="h-[calc(100%-60px)] flex items-center justify-center">
                  {renderComponent()}
                </div>
              </div>
            </div>
          </div>

          {/* Code Panel */}
          <AnimatePresence>
            {showCode && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="border-t border-white/10 bg-black/20 backdrop-blur-sm"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Code</h3>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        <Palette className="w-4 h-4 text-white" />
                      </button>
                      <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        <Settings className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300">
                      <code>{currentExample?.code}</code>
                    </pre>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
