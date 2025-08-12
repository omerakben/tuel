"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  HorizontalScroll: () => HorizontalScroll,
  HorizontalScrollItem: () => HorizontalScrollItem,
  OrchestraCubes: () => OrchestraCubes,
  OrkenWorldScroll: () => OrkenWorldScroll,
  ParallaxContainer: () => ParallaxContainer,
  ParallaxLayer: () => ParallaxLayer,
  ParallaxScroll: () => ParallaxScroll,
  RadgaHorizontalScroll: () => RadgaHorizontalScroll,
  ScrollFrameAnimation: () => ScrollFrameAnimation,
  ScrollMinimap: () => ScrollMinimap,
  SofiHealthScroll: () => SofiHealthScroll,
  TheFirstTheLastScroll: () => TheFirstTheLastScroll,
  WodniackWorkScroll: () => WodniackWorkScroll
});
module.exports = __toCommonJS(index_exports);

// src/components/WodniackWorkScroll.tsx
var import_gsap = require("gsap");
var import_ScrollTrigger = require("gsap/ScrollTrigger");
var import_react = require("lenis/react");
var import_react2 = require("react");
var THREE = __toESM(require("three"));
var import_jsx_runtime = require("react/jsx-runtime");
var defaultImages = [
  "/assets/img1.jpg",
  "/assets/img2.jpg",
  "/assets/img3.jpg",
  "/assets/img4.jpg",
  "/assets/img5.jpg",
  "/assets/img6.jpg",
  "/assets/img7.jpg"
];
import_gsap.gsap.registerPlugin(import_ScrollTrigger.ScrollTrigger);
function WodniackWorkScroll({
  letters = ["W", "O", "R", "K"],
  images = defaultImages,
  introText = "( Intro )",
  outroText = "( Outro )",
  primaryColor = "#f40c3f",
  backgroundColor = "#000000",
  dotSize = 0.75,
  gridSpacing = 20,
  letterInstanceCount = 15,
  lineSpeedMultipliers = [0.8, 1, 0.7, 0.9],
  lerpFactor = 0.07,
  enableSmoothScroll = true,
  className,
  lenisOptions = {
    lerp: 0.1,
    smoothWheel: true,
    duration: 1.2
  }
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `wodniack-work-scroll ${className || ""}`, children: enableSmoothScroll ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.ReactLenis, { root: true, options: lenisOptions, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    WodniackWorkScrollContent,
    {
      letters,
      images,
      introText,
      outroText,
      primaryColor,
      backgroundColor,
      dotSize,
      gridSpacing,
      letterInstanceCount,
      lineSpeedMultipliers,
      lerpFactor,
      className
    }
  ) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    WodniackWorkScrollContent,
    {
      letters,
      images,
      introText,
      outroText,
      primaryColor,
      backgroundColor,
      dotSize,
      gridSpacing,
      letterInstanceCount,
      lineSpeedMultipliers,
      lerpFactor,
      className
    }
  ) });
}
function WodniackWorkScrollContent({
  letters,
  images,
  introText,
  outroText,
  primaryColor,
  backgroundColor,
  dotSize,
  gridSpacing,
  letterInstanceCount,
  lineSpeedMultipliers,
  lerpFactor,
  className
}) {
  const containerRef = (0, import_react2.useRef)(null);
  const workRef = (0, import_react2.useRef)(null);
  const textContainerRef = (0, import_react2.useRef)(null);
  const gridCanvasRef = (0, import_react2.useRef)(null);
  const lettersCanvasRef = (0, import_react2.useRef)(null);
  const cardsCanvasRef = (0, import_react2.useRef)(null);
  const lettersSceneRef = (0, import_react2.useRef)(null);
  const cardsSceneRef = (0, import_react2.useRef)(null);
  const lettersCameraRef = (0, import_react2.useRef)(null);
  const cardsCameraRef = (0, import_react2.useRef)(null);
  const lettersRendererRef = (0, import_react2.useRef)(null);
  const cardsRendererRef = (0, import_react2.useRef)(null);
  const pathsRef = (0, import_react2.useRef)([]);
  const cardsTextureRef = (0, import_react2.useRef)(null);
  const textureCanvasRef = (0, import_react2.useRef)(null);
  const lenisRef = (0, import_react2.useRef)(null);
  const letterPositionsRef = (0, import_react2.useRef)(
    /* @__PURE__ */ new Map()
  );
  const animationIdRef = (0, import_react2.useRef)(null);
  const scrollTriggerRef = (0, import_react2.useRef)(null);
  const [isReady, setIsReady] = (0, import_react2.useState)(false);
  const [loadedTextures, setLoadedTextures] = (0, import_react2.useState)([]);
  const lerp = (0, import_react2.useCallback)((start, end, t) => {
    return start + (end - start) * t;
  }, []);
  const initGridCanvas = (0, import_react2.useCallback)(() => {
    const canvas = gridCanvasRef.current;
    if (!canvas || !workRef.current) return;
    const ctx = canvas.getContext("2d");
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);
  const drawGrid = (0, import_react2.useCallback)(
    (scrollProgress = 0) => {
      const canvas = gridCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = primaryColor;
      const rows = Math.ceil(canvas.height / gridSpacing);
      const cols = Math.ceil(canvas.width / gridSpacing) + 15;
      const offset = scrollProgress * gridSpacing * 10 % gridSpacing;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          ctx.beginPath();
          ctx.arc(
            x * gridSpacing - offset,
            y * gridSpacing,
            dotSize,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
    },
    [backgroundColor, primaryColor, gridSpacing, dotSize]
  );
  const createTextAnimationPath = (0, import_react2.useCallback)(
    (yPos, amplitude) => {
      const points = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        points.push(
          new THREE.Vector3(
            -25 + 50 * t,
            yPos + Math.sin(t * Math.PI) * -amplitude,
            (1 - Math.pow(Math.abs(t - 0.5) * 2, 2)) * -5
          )
        );
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(100)),
        new THREE.LineBasicMaterial({ color: 0, linewidth: 1 })
      );
      line.curve = curve;
      line.letterElements = [];
      return line;
    },
    []
  );
  const loadImages = (0, import_react2.useCallback)(async () => {
    const textureLoader = new THREE.TextureLoader();
    const loadPromises = images.map(
      (imageSrc) => new Promise((resolve) => {
        textureLoader.load(imageSrc, (texture) => {
          texture.generateMipmaps = true;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          resolve(texture);
        });
      })
    );
    const textures = await Promise.all(loadPromises);
    setLoadedTextures(textures);
    return textures;
  }, [images]);
  const initThreeJS = (0, import_react2.useCallback)(() => {
    if (!workRef.current) return;
    const lettersScene = new THREE.Scene();
    const cardsScene = new THREE.Scene();
    lettersSceneRef.current = lettersScene;
    cardsSceneRef.current = cardsScene;
    const lettersCamera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1e3
    );
    const cardsCamera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1e3
    );
    lettersCamera.position.setZ(20);
    cardsCamera.position.setZ(20);
    lettersCameraRef.current = lettersCamera;
    cardsCameraRef.current = cardsCamera;
    const lettersRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    lettersRenderer.setSize(window.innerWidth, window.innerHeight);
    lettersRenderer.setClearColor(0, 0);
    lettersRenderer.setPixelRatio(window.devicePixelRatio);
    const cardsRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    cardsRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    cardsRenderer.setSize(window.innerWidth, window.innerHeight);
    cardsRenderer.setClearColor(0, 0);
    lettersRendererRef.current = lettersRenderer;
    cardsRendererRef.current = cardsRenderer;
    const paths = [
      createTextAnimationPath(10, 2),
      createTextAnimationPath(3.5, 1),
      createTextAnimationPath(-3.5, -1),
      createTextAnimationPath(-10, -2)
    ];
    paths.forEach((line) => lettersScene.add(line));
    pathsRef.current = paths;
    if (lettersCanvasRef.current) {
      lettersCanvasRef.current.remove();
    }
    if (cardsCanvasRef.current) {
      cardsCanvasRef.current.remove();
    }
    lettersRenderer.domElement.style.position = "absolute";
    lettersRenderer.domElement.style.top = "0";
    lettersRenderer.domElement.style.left = "0";
    lettersRenderer.domElement.style.pointerEvents = "none";
    cardsRenderer.domElement.style.position = "absolute";
    cardsRenderer.domElement.style.top = "0";
    cardsRenderer.domElement.style.left = "0";
    cardsRenderer.domElement.style.pointerEvents = "none";
    workRef.current.appendChild(lettersRenderer.domElement);
    workRef.current.appendChild(cardsRenderer.domElement);
    lettersCanvasRef.current = lettersRenderer.domElement;
    cardsCanvasRef.current = cardsRenderer.domElement;
    return () => {
      lettersRenderer.dispose();
      cardsRenderer.dispose();
    };
  }, [createTextAnimationPath]);
  const createLetterElements = (0, import_react2.useCallback)(() => {
    if (!textContainerRef.current || !pathsRef.current.length) return;
    textContainerRef.current.innerHTML = "";
    letterPositionsRef.current.clear();
    pathsRef.current.forEach((line, pathIndex) => {
      line.letterElements = Array.from({ length: letterInstanceCount }, () => {
        const element = document.createElement("div");
        element.className = "wodniack-letter";
        element.textContent = letters[pathIndex] || "X";
        element.style.position = "absolute";
        element.style.transform = "translate(-50%, -50%)";
        element.style.color = primaryColor;
        element.style.fontSize = "4rem";
        element.style.fontWeight = "bold";
        element.style.pointerEvents = "none";
        element.style.zIndex = "10";
        textContainerRef.current.appendChild(element);
        letterPositionsRef.current.set(element, {
          current: { x: 0, y: 0 },
          target: { x: 0, y: 0 }
        });
        return element;
      });
    });
  }, [letters, letterInstanceCount, primaryColor]);
  const initCardsTexture = (0, import_react2.useCallback)(async () => {
    if (!loadedTextures.length || !cardsSceneRef.current || !cardsRendererRef.current)
      return;
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 4096;
    textureCanvas.height = 2048;
    textureCanvasRef.current = textureCanvas;
    const cardsTexture = new THREE.CanvasTexture(textureCanvas);
    cardsTexture.generateMipmaps = true;
    cardsTexture.minFilter = THREE.LinearMipmapLinearFilter;
    cardsTexture.magFilter = THREE.LinearFilter;
    cardsTexture.anisotropy = cardsRendererRef.current.capabilities.getMaxAnisotropy();
    cardsTexture.wrapS = THREE.RepeatWrapping;
    cardsTexture.wrapT = THREE.RepeatWrapping;
    cardsTextureRef.current = cardsTexture;
    const cardsPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 15, 50, 1),
      new THREE.MeshBasicMaterial({
        map: cardsTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1,
        depthTest: false,
        depthWrite: false
      })
    );
    const positions = cardsPlane.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      positions.setZ(i, Math.pow(positions.getX(i) / 15, 2) * 5);
    }
    positions.needsUpdate = true;
    cardsSceneRef.current.add(cardsPlane);
  }, [loadedTextures]);
  const drawCardsOnCanvas = (0, import_react2.useCallback)(
    (offset = 0) => {
      const canvas = textureCanvasRef.current;
      if (!canvas || !loadedTextures.length) return;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cardWidth = canvas.width / 3;
      const cardHeight = canvas.height / 2;
      const spacing = canvas.width / 2.5;
      loadedTextures.forEach((texture, i) => {
        if (texture.image) {
          ctx.drawImage(
            texture.image,
            i * spacing + (0.35 - offset) * canvas.width * 5 - cardWidth,
            (canvas.height - cardHeight) / 2,
            cardWidth,
            cardHeight
          );
        }
      });
      if (cardsTextureRef.current) {
        cardsTextureRef.current.needsUpdate = true;
      }
    },
    [loadedTextures]
  );
  const updateTargetPositions = (0, import_react2.useCallback)(
    (scrollProgress = 0) => {
      if (!pathsRef.current.length || !lettersCameraRef.current) return;
      pathsRef.current.forEach((line, lineIndex) => {
        const speedMultiplier = lineSpeedMultipliers[lineIndex] || 1;
        line.letterElements.forEach((element, i) => {
          const point = line.curve.getPoint(
            (i / (letterInstanceCount - 1) + scrollProgress * speedMultiplier) % 1
          );
          const vector = point.clone().project(lettersCameraRef.current);
          const positions = letterPositionsRef.current.get(element);
          if (positions) {
            positions.target = {
              x: (-vector.x * 0.5 + 0.5) * window.innerWidth,
              y: (-vector.y * 0.5 + 0.5) * window.innerHeight
            };
          }
        });
      });
    },
    [letterInstanceCount, lineSpeedMultipliers]
  );
  const updateLetterPositions = (0, import_react2.useCallback)(() => {
    letterPositionsRef.current.forEach((positions, element) => {
      const distX = positions.target.x - positions.current.x;
      if (Math.abs(distX) > window.innerWidth * 0.7) {
        positions.current.x = positions.target.x;
        positions.current.y = positions.target.y;
      } else {
        positions.current.x = lerp(
          positions.current.x,
          positions.target.x,
          lerpFactor
        );
        positions.current.y = lerp(
          positions.current.y,
          positions.target.y,
          lerpFactor
        );
      }
      element.style.transform = `translate(-50%, -50%) translate3d(${positions.current.x}px, ${positions.current.y}px, 0px)`;
    });
  }, [lerp, lerpFactor]);
  const animate = (0, import_react2.useCallback)(() => {
    updateLetterPositions();
    if (lettersSceneRef.current && lettersCameraRef.current && lettersRendererRef.current) {
      lettersRendererRef.current.render(
        lettersSceneRef.current,
        lettersCameraRef.current
      );
    }
    if (cardsSceneRef.current && cardsCameraRef.current && cardsRendererRef.current) {
      cardsRendererRef.current.render(
        cardsSceneRef.current,
        cardsCameraRef.current
      );
    }
    animationIdRef.current = requestAnimationFrame(animate);
  }, [updateLetterPositions]);
  const initScrollTrigger = (0, import_react2.useCallback)(() => {
    if (!workRef.current) return;
    const scrollTrigger = import_ScrollTrigger.ScrollTrigger.create({
      trigger: workRef.current,
      start: "top top",
      end: "+=700%",
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        updateTargetPositions(self.progress);
        drawCardsOnCanvas(self.progress);
        drawGrid(self.progress);
      }
    });
    scrollTriggerRef.current = scrollTrigger;
  }, [updateTargetPositions, drawCardsOnCanvas, drawGrid]);
  const handleResize = (0, import_react2.useCallback)(() => {
    if (!lettersCameraRef.current || !cardsCameraRef.current || !lettersRendererRef.current || !cardsRendererRef.current)
      return;
    lettersCameraRef.current.aspect = window.innerWidth / window.innerHeight;
    lettersCameraRef.current.updateProjectionMatrix();
    cardsCameraRef.current.aspect = window.innerWidth / window.innerHeight;
    cardsCameraRef.current.updateProjectionMatrix();
    lettersRendererRef.current.setSize(window.innerWidth, window.innerHeight);
    cardsRendererRef.current.setSize(window.innerWidth, window.innerHeight);
    cardsRendererRef.current.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );
    const canvas = gridCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    }
    const progress = scrollTriggerRef.current?.progress || 0;
    drawGrid(progress);
    updateTargetPositions(progress);
  }, [drawGrid, updateTargetPositions]);
  (0, import_react2.useEffect)(() => {
    const init = async () => {
      try {
        initGridCanvas();
        await loadImages();
        initThreeJS();
        createLetterElements();
        await initCardsTexture();
        drawGrid(0);
        updateTargetPositions(0);
        animate();
        initScrollTrigger();
        window.addEventListener("resize", handleResize);
        setIsReady(true);
      } catch (error) {
        console.error("Failed to initialize WodniackWorkScroll:", error);
      }
    };
    init();
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      window.removeEventListener("resize", handleResize);
      if (lettersRendererRef.current) {
        lettersRendererRef.current.dispose();
      }
      if (cardsRendererRef.current) {
        cardsRendererRef.current.dispose();
      }
    };
  }, [
    initGridCanvas,
    loadImages,
    initThreeJS,
    createLetterElements,
    initCardsTexture,
    drawGrid,
    updateTargetPositions,
    animate,
    initScrollTrigger,
    handleResize
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: `wodniack-work-scroll-content ${className || ""}`,
      ref: containerRef,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { className: "wodniack-intro", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: introText }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "wodniack-work", ref: workRef, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", { ref: gridCanvasRef, className: "wodniack-grid-canvas" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: textContainerRef, className: "wodniack-text-container" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { className: "wodniack-outro", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: outroText }) }),
        !isReady && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "wodniack-loading", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading..." }) })
      ]
    }
  );
}

// src/components/HorizontalScroll.tsx
var import_utils = require("@tuel/utils");
var import_gsap2 = require("gsap");
var import_ScrollTrigger2 = require("gsap/ScrollTrigger");
var import_react3 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
import_gsap2.gsap.registerPlugin(import_ScrollTrigger2.ScrollTrigger);
function HorizontalScroll({
  children,
  className,
  containerClassName,
  speed = 1,
  scrub = 1,
  pin = true,
  snap = false,
  direction = "left",
  triggerElement,
  start = "top top",
  end = "bottom top",
  onUpdate,
  onComplete
}) {
  const containerRef = (0, import_react3.useRef)(null);
  const scrollRef = (0, import_react3.useRef)(null);
  (0, import_react3.useEffect)(() => {
    const container = containerRef.current;
    const scrollElement = scrollRef.current;
    if (!container || !scrollElement) return;
    const scrollWidth = scrollElement.scrollWidth;
    const containerWidth = container.offsetWidth;
    const scrollDistance = scrollWidth - containerWidth;
    const scrollDirection = direction === "left" ? -scrollDistance : scrollDistance;
    const animation = import_gsap2.gsap.to(scrollElement, {
      x: scrollDirection * speed,
      ease: "none",
      scrollTrigger: {
        trigger: triggerElement || container,
        start,
        end: end === "auto" ? `+=${scrollDistance}` : end,
        scrub,
        pin: pin ? container : false,
        snap: typeof snap === "boolean" ? void 0 : snap,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (onUpdate) {
            onUpdate(self.progress);
          }
        }
      }
    });
    return () => {
      animation.kill();
    };
  }, [
    speed,
    scrub,
    pin,
    snap,
    direction,
    triggerElement,
    start,
    end,
    onUpdate,
    onComplete
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "div",
    {
      ref: containerRef,
      className: (0, import_utils.cn)("overflow-hidden", containerClassName),
      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { ref: scrollRef, className: (0, import_utils.cn)("flex w-fit", className), children })
    }
  );
}
function HorizontalScrollItem({
  children,
  className,
  width = "auto"
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: (0, import_utils.cn)("flex-shrink-0", className), "data-width": width, children });
}

// src/components/OrchestraCubes.tsx
var import_gsap3 = require("gsap");
var import_ScrollTrigger3 = require("gsap/ScrollTrigger");
var import_react4 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
if (typeof window !== "undefined") {
  import_gsap3.gsap.registerPlugin(import_ScrollTrigger3.ScrollTrigger);
}
var cubesData = {
  "cube-1": {
    initial: {
      top: -55,
      left: 37.5,
      rotateX: 360,
      rotateY: -360,
      rotateZ: -48,
      z: -3e4
    },
    final: {
      top: 50,
      left: 15,
      rotateX: 0,
      rotateY: 3,
      rotateZ: 0,
      z: 0
    }
  },
  "cube-2": {
    initial: {
      top: -35,
      left: 12.5,
      rotateX: -360,
      rotateY: 360,
      rotateZ: 135,
      z: -3e4
    },
    final: {
      top: 25,
      left: 25,
      rotateX: 1,
      rotateY: 2,
      rotateZ: 0,
      z: 0
    }
  },
  "cube-3": {
    initial: {
      top: -75,
      left: 87.5,
      rotateX: -360,
      rotateY: -360,
      rotateZ: 180,
      z: -3e4
    },
    final: {
      top: 75,
      left: 15,
      rotateX: 0,
      rotateY: -1,
      rotateZ: 0,
      z: 0
    }
  },
  "cube-4": {
    initial: {
      top: -75,
      left: 12.5,
      rotateX: 360,
      rotateY: 360,
      rotateZ: 90,
      z: -3e4
    },
    final: {
      top: 75,
      left: 55,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      z: 0
    }
  },
  "cube-5": {
    initial: {
      top: -55,
      left: 62.5,
      rotateX: 360,
      rotateY: 360,
      rotateZ: -135,
      z: -3e4
    },
    final: {
      top: 25,
      left: 75,
      rotateX: -1,
      rotateY: -2,
      rotateZ: 0,
      z: 0
    }
  },
  "cube-6": {
    initial: {
      top: -35,
      left: 67.5,
      rotateX: -180,
      rotateY: -360,
      rotateZ: -180,
      z: -3e4
    },
    final: {
      top: 50,
      left: 85,
      rotateX: 0,
      rotateY: -3,
      rotateZ: 0,
      z: 0
    }
  }
};
function Cube({ cubeKey, images, className = "" }) {
  const data = cubesData[cubeKey];
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "div",
    {
      className: `cube absolute z-10 w-20 h-20 md:w-24 md:h-24 preserve-3d ${className}`,
      style: {
        transformStyle: "preserve-3d",
        perspective: "1000px",
        top: `${data.initial.top}%`,
        left: `${data.initial.left}%`,
        transform: `
          translate3d(-50%, -50%, ${data.initial.z}px)
          rotateX(${data.initial.rotateX}deg)
          rotateY(${data.initial.rotateY}deg)
          rotateZ(${data.initial.rotateZ}deg)
        `
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "div",
          {
            className: "cube-face absolute w-full h-full",
            style: { transform: "rotateY(0deg) translateZ(50px)" },
            children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "img",
              {
                src: images[0] || "/api/placeholder/300/300",
                alt: "cube-face",
                className: "w-full h-full object-cover"
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "div",
          {
            className: "cube-face absolute w-full h-full",
            style: { transform: "rotateY(180deg) translateZ(50px)" },
            children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "img",
              {
                src: images[1] || "/api/placeholder/300/300",
                alt: "cube-face",
                className: "w-full h-full object-cover"
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "div",
          {
            className: "cube-face absolute w-full h-full",
            style: { transform: "rotateY(90deg) translateZ(50px)" },
            children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "img",
              {
                src: images[2] || "/api/placeholder/300/300",
                alt: "cube-face",
                className: "w-full h-full object-cover"
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "div",
          {
            className: "cube-face absolute w-full h-full",
            style: { transform: "rotateY(-90deg) translateZ(50px)" },
            children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "img",
              {
                src: images[3] || "/api/placeholder/300/300",
                alt: "cube-face",
                className: "w-full h-full object-cover"
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "div",
          {
            className: "cube-face absolute w-full h-full",
            style: { transform: "rotateX(90deg) translateZ(50px)" },
            children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "img",
              {
                src: images[4] || "/api/placeholder/300/300",
                alt: "cube-face",
                className: "w-full h-full object-cover"
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "div",
          {
            className: "cube-face absolute w-full h-full",
            style: { transform: "rotateX(-90deg) translateZ(50px)" },
            children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "img",
              {
                src: images[5] || "/api/placeholder/300/300",
                alt: "cube-face",
                className: "w-full h-full object-cover"
              }
            )
          }
        )
      ]
    }
  );
}
function OrchestraCubes({
  className = "",
  header1 = "The first media company crafted for the digital first generation.",
  header2 = "Where innovation meets precision.",
  subtitle = "Symphonia unites visionary thinkers, creative architects, and analytical experts, collaborating seamlessly to transform challenges into opportunities. Together, we deliver tailored solutions that drive impact and inspire growth.",
  images = Array.from(
    { length: 36 },
    (_, i) => `/api/placeholder/300/300?seed=${i + 1}`
  ),
  stickyHeight = 4,
  backgroundColor = "#331707",
  textColor = "#ffe9d9"
}) {
  const stickyRef = (0, import_react4.useRef)(null);
  const logoRef = (0, import_react4.useRef)(null);
  const cubesRef = (0, import_react4.useRef)(null);
  const header1Ref = (0, import_react4.useRef)(null);
  const header2Ref = (0, import_react4.useRef)(null);
  const [cubeRefs] = (0, import_react4.useState)(() => {
    const refs = {};
    Object.keys(cubesData).forEach((key) => {
      refs[key] = { current: null };
    });
    return refs;
  });
  const interpolate = (start, end, progress) => {
    return start + (end - start) * progress;
  };
  (0, import_react4.useEffect)(() => {
    if (!stickyRef.current) return;
    Object.entries(cubesData).forEach(([cubeKey, data]) => {
      const cubeRef = cubeRefs[cubeKey];
      if (!cubeRef.current) return;
      cubeRef.current.style.top = `${data.initial.top}%`;
      cubeRef.current.style.left = `${data.initial.left}%`;
      cubeRef.current.style.transform = `
        translate3d(-50%, -50%, ${data.initial.z}px)
        rotateX(${data.initial.rotateX}deg)
        rotateY(${data.initial.rotateY}deg)
        rotateZ(${data.initial.rotateZ}deg)
      `;
    });
    const scrollTrigger = import_ScrollTrigger3.ScrollTrigger.create({
      trigger: stickyRef.current,
      start: "top top",
      end: `+=${stickyHeight * 100}vh`,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        if (!logoRef.current || !cubesRef.current || !header1Ref.current || !header2Ref.current) {
          return;
        }
        const logo = logoRef.current;
        const cubes = cubesRef.current;
        const header12 = header1Ref.current;
        const header22 = header2Ref.current;
        if (self.progress <= 0.2) {
          const logoProgress = self.progress * 5;
          const logoScale = interpolate(1, 0, logoProgress);
          const logoOpacity = interpolate(1, 0, logoProgress);
          logo.style.transform = `translate(-50%, -50%) scale(${logoScale})`;
          logo.style.opacity = String(logoOpacity);
          cubes.style.opacity = String(logoProgress);
        } else {
          logo.style.opacity = "0";
          cubes.style.opacity = "1";
        }
        if (self.progress >= 0.2 && self.progress <= 0.4) {
          const header1StartProgress = (self.progress - 0.2) * 5;
          const header1Progress = Math.max(
            0,
            Math.min(header1StartProgress, 1)
          );
          const header1Scale = interpolate(0.75, 1, header1Progress);
          const header1Blur = interpolate(10, 0, header1Progress);
          header12.style.transform = `translate(-50%, -50%) scale(${header1Scale})`;
          header12.style.filter = `blur(${header1Blur}px)`;
          header12.style.opacity = String(header1Progress);
        } else if (self.progress > 0.4) {
          header12.style.opacity = "0";
        }
        if (self.progress >= 0.4 && self.progress <= 0.6) {
          const header2StartProgress = (self.progress - 0.4) * 10;
          const header2Progress = Math.max(
            0,
            Math.min(header2StartProgress, 1)
          );
          const header2Scale = interpolate(0.75, 1, header2Progress);
          const header2Blur = interpolate(10, 0, header2Progress);
          header22.style.transform = `translate(-50%, -50%) scale(${header2Scale})`;
          header22.style.filter = `blur(${header2Blur}px)`;
          header22.style.opacity = String(header2Progress);
        }
        const firstPhaseProgress = Math.min(self.progress * 2, 1);
        const secondPhaseProgress = self.progress >= 0.5 ? (self.progress - 0.5) * 2 : 0;
        Object.entries(cubesData).forEach(([cubeKey, data]) => {
          const cubeRef = cubeRefs[cubeKey];
          if (!cubeRef.current) return;
          const { initial, final } = data;
          const currentTop = interpolate(
            initial.top,
            final.top,
            firstPhaseProgress
          );
          const currentLeft = interpolate(
            initial.left,
            final.left,
            firstPhaseProgress
          );
          const currentRotateX = interpolate(
            initial.rotateX,
            final.rotateX,
            firstPhaseProgress
          );
          const currentRotateY = interpolate(
            initial.rotateY,
            final.rotateY,
            firstPhaseProgress
          );
          const currentRotateZ = interpolate(
            initial.rotateZ,
            final.rotateZ,
            firstPhaseProgress
          );
          const currentZ = interpolate(initial.z, final.z, firstPhaseProgress);
          let additionalRotation = 0;
          if (cubeKey === "cube-2") {
            additionalRotation = interpolate(0, 180, secondPhaseProgress);
          } else if (cubeKey === "cube-4") {
            additionalRotation = interpolate(0, -180, secondPhaseProgress);
          }
          cubeRef.current.style.top = `${currentTop}%`;
          cubeRef.current.style.left = `${currentLeft}%`;
          cubeRef.current.style.transform = `
            translate3d(-50%, -50%, ${currentZ}px)
            rotateX(${currentRotateX}deg)
            rotateY(${currentRotateY + additionalRotation}deg)
            rotateZ(${currentRotateZ}deg)
          `;
        });
      }
    });
    return () => {
      scrollTrigger.kill();
    };
  }, [stickyHeight, cubeRefs]);
  const cubeImages = Object.keys(cubesData).map(
    (_, index) => images.slice(index * 6, (index + 1) * 6)
  );
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      "div",
      {
        ref: stickyRef,
        className: `orchestra-cubes relative w-full h-screen overflow-hidden ${className}`,
        "data-bg": backgroundColor,
        "data-color": textColor,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
            "div",
            {
              ref: logoRef,
              className: "absolute top-[25%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-6 z-20",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex flex-col gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "w-4 h-4 bg-[#ffe9d9]" }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "w-4 h-4 bg-[#ffe9d9]" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex flex-col gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "w-4 h-4 bg-[#ffe9d9]" }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "w-4 h-4 bg-[#ffe9d9]" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex flex-col gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "w-4 h-4 bg-[#ffe9d9]" }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "w-4 h-4 bg-[#ffe9d9]" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { ref: cubesRef, className: "cubes-container opacity-0", children: Object.keys(cubesData).map((cubeKey, index) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { ref: cubeRefs[cubeKey], children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Cube, { cubeKey, images: cubeImages[index] }) }, cubeKey)) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "div",
            {
              ref: header1Ref,
              className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 max-w-4xl px-8",
              children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h1", { className: "text-4xl md:text-6xl font-bold leading-tight text-[#ffe9d9]", children: header1 })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
            "div",
            {
              ref: header2Ref,
              className: "header-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 max-w-2xl px-8 opacity-0",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { className: "text-3xl md:text-5xl font-bold mb-6 text-[#ffe9d9]", children: header2 }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "text-lg md:text-xl leading-relaxed text-[#ffe9d9]", children: subtitle })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("section", { className: "relative w-full h-screen flex justify-center items-center text-center bg-[#cdb9ab] text-[#331707]", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { className: "text-3xl md:text-5xl font-bold", children: "Your next section goes here" }) })
  ] });
}

// src/components/OrkenWorldScroll.tsx
var import_gsap4 = require("gsap");
var import_ScrollTrigger4 = require("gsap/ScrollTrigger");
var import_react5 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
if (typeof window !== "undefined") {
  import_gsap4.gsap.registerPlugin(import_ScrollTrigger4.ScrollTrigger);
}
var defaultCards = [
  {
    id: 1,
    title: "Silent Veil",
    productCode: "PROD8372",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2NjY2NjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMzMzMzMzMiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+"
  },
  {
    id: 2,
    title: "Crimson Echoes",
    productCode: "PROD4921",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNkYzI2MjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM5OTE5MTkiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+"
  },
  {
    id: 3,
    title: "Zenith Arc",
    productCode: "PROD7586",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMyNTYzZWIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxZTQwYWYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+"
  },
  {
    id: 4,
    title: "Moonspire Dream",
    productCode: "PROD3410",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MzY2ZjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM0MzM4Y2EiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+"
  },
  {
    id: 5,
    title: "Ember Flux",
    productCode: "PROD9053",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmOTc4MTYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlYTU4MDYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+"
  }
];
function OrkenWorldScroll({ className = "" }) {
  const stickyRef = (0, import_react5.useRef)(null);
  const outlineCanvasRef = (0, import_react5.useRef)(null);
  const fillCanvasRef = (0, import_react5.useRef)(null);
  const cardsRef = (0, import_react5.useRef)(null);
  const triangleStatesRef = (0, import_react5.useRef)(/* @__PURE__ */ new Map());
  const animationFrameIdRef = (0, import_react5.useRef)(null);
  const canvasXPositionRef = (0, import_react5.useRef)(0);
  const TRIANGLE_SIZE = 15;
  const TRIANGLE_ROWS = 100;
  const TRIANGLE_COLS = 200;
  const SCALE_THRESHOLD = 0.1;
  const setCanvasSize = (canvas, ctx) => {
    const rect = canvas.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = rect.width * pixelRatio;
    canvas.height = rect.height * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
  };
  const drawTriangle = (ctx, x, y, size, flipped, outlineScale, fillScale, lineWidth) => {
    const halfSize = size * 0.5;
    if (outlineScale >= SCALE_THRESHOLD) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(outlineScale, outlineScale);
      ctx.translate(-x, -y);
      ctx.beginPath();
      if (!flipped) {
        ctx.moveTo(x, y - halfSize);
        ctx.lineTo(x + halfSize, y + halfSize);
        ctx.lineTo(x - halfSize, y + halfSize);
      } else {
        ctx.moveTo(x, y + halfSize);
        ctx.lineTo(x + halfSize, y - halfSize);
        ctx.lineTo(x - halfSize, y - halfSize);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.075)";
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
    if (fillScale >= SCALE_THRESHOLD) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(fillScale, fillScale);
      ctx.translate(-x, -y);
      ctx.beginPath();
      if (!flipped) {
        ctx.moveTo(x, y - halfSize);
        ctx.lineTo(x + halfSize, y + halfSize);
        ctx.lineTo(x - halfSize, y + halfSize);
      } else {
        ctx.moveTo(x, y + halfSize);
        ctx.lineTo(x + halfSize, y - halfSize);
        ctx.lineTo(x - halfSize, y - halfSize);
      }
      ctx.closePath();
      ctx.fillStyle = "#ff6b00";
      ctx.strokeStyle = "#ff6b00";
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    }
  };
  const drawGrid = (scrollProgress = 0) => {
    const outlineCanvas = outlineCanvasRef.current;
    const fillCanvas = fillCanvasRef.current;
    if (!outlineCanvas || !fillCanvas) return;
    const outlineCtx = outlineCanvas.getContext("2d");
    const fillCtx = fillCanvas.getContext("2d");
    if (!outlineCtx || !fillCtx) return;
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    outlineCtx.clearRect(0, 0, outlineCanvas.width, outlineCanvas.height);
    fillCtx.clearRect(0, 0, fillCanvas.width, fillCanvas.height);
    const animationProgress = scrollProgress <= 0.65 ? 0 : (scrollProgress - 0.65) / 0.35;
    let needsUpdate = false;
    const canvasWidth = outlineCanvas.style.width ? parseInt(outlineCanvas.style.width.replace("px", "")) : outlineCanvas.width;
    const canvasHeight = outlineCanvas.style.height ? parseInt(outlineCanvas.style.height.replace("px", "")) : outlineCanvas.height;
    for (let row = 0; row < TRIANGLE_ROWS; row++) {
      for (let col = 0; col < TRIANGLE_COLS; col++) {
        const isFlipped = (row + col) % 2 === 1;
        const key = `${row}-${col}`;
        const triangle = triangleStatesRef.current.get(key);
        if (!triangle) continue;
        const targetScale = triangle.order <= animationProgress ? 1 : 0;
        const scaleSpeed = 0.08;
        if (triangle.scale !== targetScale) {
          triangle.scale += (targetScale - triangle.scale) * scaleSpeed;
          needsUpdate = true;
        }
        const x = col * (TRIANGLE_SIZE * 0.75) + canvasXPositionRef.current;
        const y = row * (TRIANGLE_SIZE * 0.85) + (isFlipped ? TRIANGLE_SIZE * 0.3 : 0);
        if (x + TRIANGLE_SIZE < 0 || x - TRIANGLE_SIZE > canvasWidth) continue;
        const outlineScale = Math.min(triangle.scale + 0.3, 1);
        const fillScale = Math.max(triangle.scale - 0.2, 0);
        drawTriangle(
          outlineCtx,
          x,
          y,
          TRIANGLE_SIZE,
          isFlipped,
          outlineScale,
          0,
          1
        );
        drawTriangle(fillCtx, x, y, TRIANGLE_SIZE, isFlipped, 0, fillScale, 1);
      }
    }
    if (needsUpdate) {
      animationFrameIdRef.current = requestAnimationFrame(
        () => drawGrid(scrollProgress)
      );
    }
  };
  const initializeTriangles = () => {
    const positions = [];
    for (let row = 0; row < TRIANGLE_ROWS; row++) {
      for (let col = 0; col < TRIANGLE_COLS; col++) {
        positions.push({ key: `${row}-${col}`, row, col });
      }
    }
    const totalTriangles = positions.length;
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    triangleStatesRef.current.clear();
    positions.forEach((pos, index) => {
      triangleStatesRef.current.set(pos.key, {
        order: index / totalTriangles,
        scale: 0,
        row: pos.row,
        col: pos.col
      });
    });
  };
  (0, import_react5.useEffect)(() => {
    const outlineCanvas = outlineCanvasRef.current;
    const fillCanvas = fillCanvasRef.current;
    const stickySection = stickyRef.current;
    const cards = cardsRef.current;
    if (!outlineCanvas || !fillCanvas || !stickySection || !cards) return;
    const outlineCtx = outlineCanvas.getContext("2d");
    const fillCtx = fillCanvas.getContext("2d");
    if (!outlineCtx || !fillCtx) return;
    setCanvasSize(outlineCanvas, outlineCtx);
    setCanvasSize(fillCanvas, fillCtx);
    initializeTriangles();
    drawGrid();
    const stickyHeight = window.innerHeight * 5;
    const scrollTrigger = import_ScrollTrigger4.ScrollTrigger.create({
      trigger: stickySection,
      start: "top top",
      end: `+=${stickyHeight}px`,
      pin: true,
      onUpdate: (self) => {
        canvasXPositionRef.current = -self.progress * 200;
        drawGrid(self.progress);
        const progress = Math.min(self.progress / 0.654, 1);
        const translateX = -progress * 200;
        cards.style.transform = `translateX(${translateX}%)`;
      }
    });
    const handleResize = () => {
      if (outlineCtx && fillCtx) {
        setCanvasSize(outlineCanvas, outlineCtx);
        setCanvasSize(fillCanvas, fillCtx);
        drawGrid();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      scrollTrigger.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    "div",
    {
      className: `min-h-screen ${className}`,
      style: { height: "800vh", fontFamily: '"PP Neue Montreal", sans-serif' },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("section", { className: "relative w-screen h-screen overflow-hidden flex justify-center items-center bg-black text-white", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("h1", { className: "text-center text-4xl md:text-6xl lg:text-[80px] uppercase font-light leading-none", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "text-orange-500", children: "Enter a Universe" }),
          " Powered by Imagination"
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
          "section",
          {
            ref: stickyRef,
            className: "relative w-screen h-screen overflow-hidden",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                "canvas",
                {
                  ref: outlineCanvasRef,
                  className: "absolute top-0 left-0 z-[1]",
                  style: { width: "150%", height: "150%" }
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                "div",
                {
                  ref: cardsRef,
                  className: "absolute top-0 left-0 w-[300%] h-screen flex justify-around items-center z-[2]",
                  style: { willChange: "transform" },
                  children: defaultCards.map((card) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
                    "div",
                    {
                      className: "relative w-[10%] h-[75%] bg-black rounded-xl overflow-hidden flex flex-col",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "flex-1 w-full", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                          "img",
                          {
                            src: card.image,
                            alt: card.title,
                            className: "w-full h-full object-cover"
                          }
                        ) }),
                        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "absolute bottom-5 left-5 text-white", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { className: "text-2xl mb-1 font-light uppercase", children: card.title }),
                          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "text-sm opacity-70 font-medium", children: card.productCode })
                        ] })
                      ]
                    },
                    card.id
                  ))
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                "canvas",
                {
                  ref: fillCanvasRef,
                  className: "absolute top-0 left-0 z-[3]",
                  style: { width: "150%", height: "150%" }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("section", { className: "relative w-screen h-screen overflow-hidden flex justify-center items-center bg-black text-white", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("h1", { className: "text-center text-4xl md:text-6xl lg:text-[80px] uppercase font-light leading-none", children: [
          "Chase the ",
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "text-orange-500", children: "shadows" }),
          " to embrace the light"
        ] }) })
      ]
    }
  );
}

// src/components/ParallaxScroll.tsx
var import_utils2 = require("@tuel/utils");
var import_react6 = require("motion/react");
var import_react7 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
function ParallaxScroll({
  children,
  className,
  speed = 0.5,
  offset = ["start end", "end start"],
  direction = "vertical",
  fadeIn = false,
  scaleOnScroll = false,
  rotateOnScroll = false
}) {
  const ref = (0, import_react7.useRef)(null);
  const { scrollYProgress } = (0, import_react6.useScroll)({
    target: ref,
    offset
  });
  const distance = 100 * speed;
  const y = (0, import_react6.useTransform)(scrollYProgress, [0, 1], [-distance, distance]);
  const x = (0, import_react6.useTransform)(scrollYProgress, [0, 1], [-distance, distance]);
  const opacity = (0, import_react6.useTransform)(
    scrollYProgress,
    [0, 0.5, 1],
    fadeIn ? [0, 1, 0] : [1, 1, 1]
  );
  const scale = (0, import_react6.useTransform)(
    scrollYProgress,
    [0, 0.5, 1],
    scaleOnScroll ? [0.8, 1, 0.8] : [1, 1, 1]
  );
  const rotate = (0, import_react6.useTransform)(
    scrollYProgress,
    [0, 1],
    rotateOnScroll ? [-5, 5] : [0, 0]
  );
  const transforms = {
    opacity,
    scale,
    rotate
  };
  if (direction === "vertical") {
    transforms.y = y;
  } else {
    transforms.x = x;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    import_react6.motion.div,
    {
      ref,
      style: transforms,
      className: (0, import_utils2.cn)("will-change-transform", className),
      children
    }
  );
}
function ParallaxLayer({
  children,
  speed,
  className,
  offset,
  direction,
  fadeIn,
  scaleOnScroll,
  rotateOnScroll
}) {
  const scrollOffset = typeof offset === "number" ? [`${offset * 100}% end`, `${(offset + 1) * 100}% start`] : offset || ["start end", "end start"];
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    ParallaxScroll,
    {
      speed,
      className,
      offset: scrollOffset,
      direction,
      fadeIn,
      scaleOnScroll,
      rotateOnScroll,
      children
    }
  );
}
function ParallaxContainer({
  children,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: (0, import_utils2.cn)("relative overflow-hidden", className), children });
}

// src/components/RadgaHorizontalScroll.tsx
var import_gsap5 = require("gsap");
var import_ScrollTrigger5 = require("gsap/ScrollTrigger");
var import_react8 = require("react");
var import_jsx_runtime6 = require("react/jsx-runtime");
function RadgaHorizontalScroll({
  slides,
  stickyHeight = 6,
  backgroundColor = "#b4aea7",
  outroTitle = "Shaping timeless spaces with contemporary vision",
  outroBackgroundColor = "#141414",
  className = "",
  style = {}
}) {
  const stickyRef = (0, import_react8.useRef)(null);
  const slidesContainerRef = (0, import_react8.useRef)(null);
  const sliderRef = (0, import_react8.useRef)(null);
  const slideRefs = (0, import_react8.useRef)([]);
  const currentVisibleIndexRef = (0, import_react8.useRef)(null);
  const observerRef = (0, import_react8.useRef)(null);
  (0, import_react8.useEffect)(() => {
    if (!stickyRef.current || !slidesContainerRef.current || !sliderRef.current)
      return;
    if (typeof window !== "undefined") {
      import_gsap5.gsap.registerPlugin(import_ScrollTrigger5.ScrollTrigger);
    }
    const stickySection = stickyRef.current;
    const slidesContainer = slidesContainerRef.current;
    const slider = sliderRef.current;
    const slideElements = slideRefs.current.filter(Boolean);
    const slideWidth = window.innerWidth;
    const totalMove = slideWidth * (slides.length - 1);
    const stickyHeightPx = window.innerHeight * stickyHeight;
    slideElements.forEach((slide, index) => {
      import_gsap5.gsap.set(slide, {
        x: index * slideWidth
      });
      const image = slide.querySelector("img");
      if (image) {
        import_gsap5.gsap.set(image, {
          scale: 1.35
        });
      }
    });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const slideIndex = slideElements.indexOf(
            entry.target
          );
          if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
            if (currentVisibleIndexRef.current !== slideIndex) {
              currentVisibleIndexRef.current = slideIndex;
            }
          }
        });
      },
      {
        root: slider,
        threshold: [0, 0.25]
      }
    );
    observerRef.current = observer;
    slideElements.forEach((slide) => observer.observe(slide));
    const scrollTrigger = import_ScrollTrigger5.ScrollTrigger.create({
      trigger: stickySection,
      start: "top top",
      end: `+=${stickyHeightPx}px`,
      scrub: 1,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const mainMove = progress * totalMove;
        import_gsap5.gsap.set(slidesContainer, {
          x: -mainMove
        });
        const currentSlide = Math.floor(mainMove / slideWidth);
        const slideProgress = mainMove % slideWidth / slideWidth;
        slideElements.forEach((slide, index) => {
          const image = slide.querySelector("img");
          if (image) {
            if (index === currentSlide || index === currentSlide + 1) {
              const relativeProgress = index === currentSlide ? slideProgress : slideProgress - 1;
              const parallaxAmount = relativeProgress * slideWidth * 0.25;
              import_gsap5.gsap.set(image, {
                x: parallaxAmount,
                scale: 1.35
              });
            } else {
              import_gsap5.gsap.set(image, {
                x: 0,
                scale: 1.35
              });
            }
          }
        });
      }
    });
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      scrollTrigger.kill();
    };
  }, [slides, stickyHeight, backgroundColor]);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    "div",
    {
      className: `radga-horizontal-scroll ${className}`,
      style: {
        position: "relative",
        fontFamily: "Gilroy, Arial, sans-serif",
        ...style
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "section",
          {
            ref: stickyRef,
            className: "radga-sticky",
            style: {
              position: "relative",
              width: "100vw",
              height: "100vh",
              overflow: "hidden",
              backgroundColor
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
              "div",
              {
                ref: sliderRef,
                className: "radga-slider",
                style: {
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  overflow: "hidden"
                },
                children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                  "div",
                  {
                    ref: slidesContainerRef,
                    className: "radga-slides-container",
                    style: {
                      position: "relative",
                      width: `${slides.length * 100}vw`,
                      height: "100%",
                      display: "flex",
                      willChange: "transform"
                    },
                    children: slides.map((slide, index) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
                      "div",
                      {
                        ref: (el) => {
                          slideRefs.current[index] = el;
                        },
                        className: "radga-slide",
                        style: {
                          position: "relative",
                          width: "100vw",
                          height: "100%",
                          overflow: "hidden",
                          willChange: "transform"
                        },
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                            "img",
                            {
                              src: slide.image,
                              alt: slide.title,
                              style: {
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                willChange: "transform"
                              }
                            }
                          ),
                          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                            "div",
                            {
                              className: "radga-slide-content",
                              style: {
                                position: "absolute",
                                bottom: "1.5em",
                                left: "1.5em",
                                zIndex: 10,
                                color: "#fff",
                                pointerEvents: "none"
                              },
                              children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
                                "h1",
                                {
                                  style: {
                                    margin: 0,
                                    textTransform: "uppercase",
                                    fontSize: "60px",
                                    fontWeight: 900,
                                    letterSpacing: "-2px",
                                    lineHeight: "0.9",
                                    willChange: "transform",
                                    fontFamily: "Gilroy, Arial, sans-serif"
                                  },
                                  children: [
                                    slide.title,
                                    slide.subtitle && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
                                      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("br", {}),
                                      slide.subtitle
                                    ] })
                                  ]
                                }
                              )
                            }
                          )
                        ]
                      },
                      slide.id
                    ))
                  }
                )
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "section",
          {
            className: "radga-outro",
            style: {
              position: "relative",
              width: "100vw",
              height: "100vh",
              padding: "1.5em",
              overflow: "hidden",
              backgroundColor: outroBackgroundColor,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center"
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
              "h1",
              {
                style: {
                  color: "#fff",
                  textTransform: "uppercase",
                  fontSize: "60px",
                  fontWeight: 900,
                  letterSpacing: "-2px",
                  lineHeight: "0.9",
                  fontFamily: "Gilroy, Arial, sans-serif"
                },
                children: outroTitle
              }
            )
          }
        )
      ]
    }
  );
}

// src/components/ScrollFrameAnimation.tsx
var import_utils3 = require("@tuel/utils");
var import_gsap6 = require("gsap");
var import_ScrollTrigger6 = require("gsap/ScrollTrigger");
var import_react9 = require("react");
var import_jsx_runtime7 = require("react/jsx-runtime");
if (import_utils3.isClient) {
  import_gsap6.gsap.registerPlugin(import_ScrollTrigger6.ScrollTrigger);
}
function ScrollFrameAnimation({
  frameCount,
  framePath,
  className,
  scrollSpeed = 1,
  pinContainer = true,
  startTrigger = "top top",
  endTrigger = "bottom top",
  onProgress,
  children,
  fallback,
  preloadFrames = true
}) {
  const containerRef = (0, import_react9.useRef)(null);
  const canvasRef = (0, import_react9.useRef)(null);
  const contextRef = (0, import_react9.useRef)(null);
  const imagesRef = (0, import_react9.useRef)([]);
  const frameRef = (0, import_react9.useRef)({ current: 0 });
  const isLoadedRef = (0, import_react9.useRef)(false);
  (0, import_react9.useEffect)(() => {
    if (!canvasRef.current || !import_utils3.isClient) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;
    contextRef.current = context;
    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      context.scale(dpr, dpr);
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);
    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);
  (0, import_react9.useEffect)(() => {
    if (!preloadFrames || !import_utils3.isClient) return;
    let loadedCount = 0;
    const images = [];
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          isLoadedRef.current = true;
          renderFrame(0);
        }
      };
      img.src = framePath(i);
      images.push(img);
    }
    imagesRef.current = images;
  }, [frameCount, framePath, preloadFrames]);
  const renderFrame = (frameIndex) => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    const images = imagesRef.current;
    if (!context || !canvas || images.length === 0) return;
    const img = images[Math.floor(frameIndex)];
    if (!img || !img.complete) return;
    const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = canvas.height / (window.devicePixelRatio || 1);
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    const imageAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = canvasWidth / canvasHeight;
    let drawWidth, drawHeight, drawX, drawY;
    if (imageAspect > canvasAspect) {
      drawHeight = canvasHeight;
      drawWidth = drawHeight * imageAspect;
      drawX = (canvasWidth - drawWidth) / 2;
      drawY = 0;
    } else {
      drawWidth = canvasWidth;
      drawHeight = drawWidth / imageAspect;
      drawX = 0;
      drawY = (canvasHeight - drawHeight) / 2;
    }
    context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  };
  (0, import_react9.useEffect)(() => {
    if (!isLoadedRef.current || !import_utils3.isClient || !containerRef.current) return;
    const tl = import_gsap6.gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: startTrigger,
        end: endTrigger,
        scrub: scrollSpeed,
        pin: pinContainer,
        onUpdate: (self) => {
          const frame = Math.floor(self.progress * (frameCount - 1));
          frameRef.current.current = frame;
          renderFrame(frame);
          onProgress?.(self.progress);
        }
      }
    });
    return () => {
      tl.kill();
    };
  }, [
    frameCount,
    scrollSpeed,
    pinContainer,
    startTrigger,
    endTrigger,
    onProgress
  ]);
  if (!import_utils3.isClient) {
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className, children: fallback });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { ref: containerRef, className: (0, import_utils3.cn)("relative", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "canvas",
      {
        ref: canvasRef,
        className: "fixed top-0 left-0 w-full h-full",
        style: { zIndex: -1 }
      }
    ),
    children
  ] });
}

// src/components/ScrollMinimap.tsx
var import_utils4 = require("@tuel/utils");
var import_react10 = require("react");
var import_jsx_runtime8 = require("react/jsx-runtime");
function ScrollMinimap({
  images,
  activeOpacity = 0.3,
  lerpFactor = 0.075,
  clickLerpFactor = 0.05,
  breakpoint = 900,
  className,
  onImageChange
}) {
  const containerRef = (0, import_react10.useRef)(null);
  const itemsRef = (0, import_react10.useRef)(null);
  const indicatorRef = (0, import_react10.useRef)(null);
  const previewImageRef = (0, import_react10.useRef)(null);
  const itemRefs = (0, import_react10.useRef)([]);
  const animationFrameRef = (0, import_react10.useRef)(null);
  const translateRef = (0, import_react10.useRef)({
    current: 0,
    target: 0,
    max: 0
  });
  const [isHorizontal, setIsHorizontal] = (0, import_react10.useState)(false);
  const [currentImageIndex, setCurrentImageIndex] = (0, import_react10.useState)(0);
  const dimensionsRef = (0, import_react10.useRef)({
    itemSize: 0,
    containerSize: 0,
    indicatorSize: 0
  });
  const isClickMoveRef = (0, import_react10.useRef)(false);
  const lerp = (start, end, factor) => {
    return start + (end - start) * factor;
  };
  const updateDimensions = () => {
    const newIsHorizontal = window.innerWidth <= breakpoint;
    const firstItem = itemRefs.current[0];
    if (!firstItem) return;
    const newDimensions = {
      itemSize: newIsHorizontal ? firstItem.getBoundingClientRect().width : firstItem.getBoundingClientRect().height,
      containerSize: newIsHorizontal ? itemsRef.current?.scrollWidth || 0 : itemsRef.current?.getBoundingClientRect().height || 0,
      indicatorSize: newIsHorizontal ? indicatorRef.current?.getBoundingClientRect().width || 0 : indicatorRef.current?.getBoundingClientRect().height || 0
    };
    dimensionsRef.current = newDimensions;
    translateRef.current.max = newDimensions.containerSize - newDimensions.indicatorSize;
    if (isHorizontal !== newIsHorizontal) {
      setIsHorizontal(newIsHorizontal);
    }
  };
  const getItemInIndicator = () => {
    itemRefs.current.forEach((item) => {
      const img = item?.querySelector("img");
      if (img) {
        img.style.opacity = "1";
      }
    });
    const indicatorStart = -translateRef.current.current;
    const indicatorEnd = indicatorStart + dimensionsRef.current.indicatorSize;
    let maxOverlap = 0;
    let selectedIndex = 0;
    itemRefs.current.forEach((item, index) => {
      const itemStart = index * dimensionsRef.current.itemSize;
      const itemEnd = itemStart + dimensionsRef.current.itemSize;
      const overlapStart = Math.max(indicatorStart, itemStart);
      const overlapEnd = Math.min(indicatorEnd, itemEnd);
      const overlap = Math.max(0, overlapEnd - overlapStart);
      if (overlap > maxOverlap) {
        maxOverlap = overlap;
        selectedIndex = index;
      }
    });
    const selectedImg = itemRefs.current[selectedIndex]?.querySelector(
      "img"
    );
    if (selectedImg) {
      selectedImg.style.opacity = activeOpacity.toString();
    }
    return selectedIndex;
  };
  const updatePreviewImage = (index) => {
    if (currentImageIndex !== index) {
      setCurrentImageIndex(index);
      if (previewImageRef.current) {
        previewImageRef.current.src = images[index];
      }
      onImageChange?.(index);
    }
  };
  const animate = () => {
    const currentLerpFactor = isClickMoveRef.current ? clickLerpFactor : lerpFactor;
    translateRef.current.current = lerp(
      translateRef.current.current,
      translateRef.current.target,
      currentLerpFactor
    );
    if (Math.abs(translateRef.current.current - translateRef.current.target) > 0.01) {
      const transform = isHorizontal ? `translateX(${translateRef.current.current}px)` : `translateY(${translateRef.current.current}px)`;
      if (itemsRef.current) {
        itemsRef.current.style.transform = transform;
      }
      const activeIndex = getItemInIndicator();
      updatePreviewImage(activeIndex);
    } else {
      isClickMoveRef.current = false;
    }
    animationFrameRef.current = requestAnimationFrame(animate);
  };
  (0, import_react10.useEffect)(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      isClickMoveRef.current = false;
      const delta = e.deltaY;
      const scrollVelocity = Math.min(Math.max(delta * 0.5, -20), 20);
      translateRef.current.target = Math.min(
        Math.max(
          translateRef.current.target - scrollVelocity,
          -translateRef.current.max
        ),
        0
      );
    };
    let touchStartY = 0;
    const handleTouchStart = (e) => {
      if (isHorizontal) {
        touchStartY = e.touches[0].clientY;
      }
    };
    const handleTouchMove = (e) => {
      if (isHorizontal) {
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        const scrollVelocity = Math.min(Math.max(deltaY * 0.5, -20), 20);
        translateRef.current.target = Math.min(
          Math.max(
            translateRef.current.target - scrollVelocity,
            -translateRef.current.max
          ),
          0
        );
        touchStartY = touchY;
        e.preventDefault();
      }
    };
    const handleResize = () => {
      updateDimensions();
      translateRef.current.target = Math.min(
        Math.max(translateRef.current.target, -translateRef.current.max),
        0
      );
      translateRef.current.current = translateRef.current.target;
      const transform = isHorizontal ? `translateX(${translateRef.current.current}px)` : `translateY(${translateRef.current.current}px)`;
      if (itemsRef.current) {
        itemsRef.current.style.transform = transform;
      }
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchmove", handleTouchMove, {
        passive: false
      });
    }
    window.addEventListener("resize", handleResize);
    updateDimensions();
    const firstImg = itemRefs.current[0]?.querySelector(
      "img"
    );
    if (firstImg) {
      firstImg.style.opacity = activeOpacity.toString();
    }
    updatePreviewImage(0);
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
      }
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    isHorizontal,
    activeOpacity,
    lerpFactor,
    clickLerpFactor,
    breakpoint,
    onImageChange
  ]);
  const handleItemClick = (index) => {
    isClickMoveRef.current = true;
    const newTranslate = -index * dimensionsRef.current.itemSize + (dimensionsRef.current.indicatorSize - dimensionsRef.current.itemSize) / 2;
    translateRef.current.target = Math.max(
      Math.min(newTranslate, 0),
      -translateRef.current.max
    );
  };
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
    "div",
    {
      className: (0, import_utils4.cn)("scroll-minimap-container", className),
      ref: containerRef,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "minimap", style: { position: "relative" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            "div",
            {
              className: "indicator",
              ref: indicatorRef,
              style: {
                position: "absolute",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                pointerEvents: "none",
                zIndex: 10
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            "div",
            {
              className: "items",
              ref: itemsRef,
              style: {
                display: "flex",
                flexDirection: isHorizontal ? "row" : "column"
              },
              children: images.map((src, index) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                "div",
                {
                  className: "item",
                  ref: (el) => {
                    itemRefs.current[index] = el;
                  },
                  onClick: () => handleItemClick(index),
                  style: {
                    cursor: "pointer",
                    flexShrink: 0
                  },
                  children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                    "img",
                    {
                      src,
                      alt: `Minimap item ${index + 1}`,
                      style: {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "opacity 0.3s ease"
                      }
                    }
                  )
                },
                src
              ))
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "img-preview", style: { position: "fixed" }, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          "img",
          {
            ref: previewImageRef,
            src: images[0],
            alt: "Preview",
            style: {
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }
          }
        ) })
      ]
    }
  );
}

// src/components/SofiHealthScroll.tsx
var import_utils5 = require("@tuel/utils");
var import_gsap7 = __toESM(require("gsap"));
var import_ScrollTrigger7 = require("gsap/ScrollTrigger");
var import_SplitText = require("gsap/SplitText");
var import_react11 = require("react");
var THREE2 = __toESM(require("three"));
var import_GLTFLoader = require("three/examples/jsm/loaders/GLTFLoader.js");
var import_jsx_runtime9 = require("react/jsx-runtime");
function SofiHealthScroll({
  modelUrl,
  className,
  headerTexts = {
    header1: "Product Overview",
    header2: "Key Features"
  },
  tooltips = [
    {
      icon: "checkmark-circle",
      title: "High Quality",
      description: "Premium materials and construction",
      trigger: 0.65
    },
    {
      icon: "star",
      title: "User Friendly",
      description: "Intuitive design for everyday use",
      trigger: 0.85
    }
  ],
  animationDuration = 1,
  staggerDelay = 0.025,
  pinHeight = 10,
  modelSettings = {
    metalness: 0.05,
    roughness: 0.9,
    cameraDistance: { mobile: 2, desktop: 1.25 },
    rotation: { desktop: -25 },
    position: { mobile: [1, 0.085, 0], desktop: [-0.4, 0.085, 0] }
  }
}) {
  const containerRef = (0, import_react11.useRef)(null);
  const modelContainerRef = (0, import_react11.useRef)(null);
  const sceneRef = (0, import_react11.useRef)(null);
  const rendererRef = (0, import_react11.useRef)(null);
  const cameraRef = (0, import_react11.useRef)(null);
  const modelRef = (0, import_react11.useRef)(null);
  const currentRotationRef = (0, import_react11.useRef)(0);
  const modelSizeRef = (0, import_react11.useRef)(null);
  (0, import_react11.useEffect)(() => {
    if (typeof window === "undefined" || !modelContainerRef.current) return;
    import_gsap7.default.registerPlugin(import_ScrollTrigger7.ScrollTrigger, import_SplitText.SplitText);
    const scene = new THREE2.Scene();
    const camera = new THREE2.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1e3
    );
    const renderer = new THREE2.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE2.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE2.LinearSRGBColorSpace;
    renderer.toneMapping = THREE2.NoToneMapping;
    renderer.toneMappingExposure = 1;
    modelContainerRef.current.appendChild(renderer.domElement);
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    scene.add(new THREE2.AmbientLight(16777215, 0.7));
    const mainLight = new THREE2.DirectionalLight(16777215, 1);
    mainLight.position.set(1, 2, 3);
    mainLight.castShadow = true;
    mainLight.shadow.bias = -1e-3;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);
    const fillLight = new THREE2.DirectionalLight(16777215, 0.5);
    fillLight.position.set(-2, 0, -2);
    scene.add(fillLight);
    const setupModel = () => {
      const model = modelRef.current;
      const modelSize = modelSizeRef.current;
      if (!model || !modelSize) return;
      const isMobile = window.innerWidth < 1e3;
      const box = new THREE2.Box3().setFromObject(model);
      const center = box.getCenter(new THREE2.Vector3());
      const [mobileX, mobileY, mobileZ] = modelSettings.position?.mobile || [
        1,
        0.085,
        0
      ];
      const [desktopX, desktopY, desktopZ] = modelSettings.position?.desktop || [-0.4, 0.085, 0];
      model.position.set(
        isMobile ? center.x + modelSize.x * mobileX : -center.x - modelSize.x * desktopX,
        -center.y + modelSize.y * (isMobile ? mobileY : desktopY),
        -center.z + (isMobile ? mobileZ : desktopZ)
      );
      model.rotation.z = isMobile ? 0 : THREE2.MathUtils.degToRad(modelSettings.rotation?.desktop || -25);
      const cameraDistance = isMobile ? modelSettings.cameraDistance?.mobile || 2 : modelSettings.cameraDistance?.desktop || 1.25;
      camera.position.set(
        0,
        0,
        Math.max(modelSize.x, modelSize.y, modelSize.z) * cameraDistance
      );
      camera.lookAt(0, 0, 0);
    };
    new import_GLTFLoader.GLTFLoader().load(modelUrl, (gltf) => {
      const model = gltf.scene;
      modelRef.current = model;
      model.traverse((node) => {
        if (node.isMesh && node.material) {
          Object.assign(node.material, {
            metalness: modelSettings.metalness || 0.05,
            roughness: modelSettings.roughness || 0.9
          });
        }
      });
      const box = new THREE2.Box3().setFromObject(model);
      const size = box.getSize(new THREE2.Vector3());
      modelSizeRef.current = size;
      scene.add(model);
      setupModel();
    });
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
    const header1Split = new import_SplitText.SplitText(".sofi-header-1 h1", {
      type: "chars",
      charsClass: "char"
    });
    const titleSplits = new import_SplitText.SplitText(".sofi-tooltip .title h2", {
      type: "lines",
      linesClass: "line"
    });
    const descriptionSplits = new import_SplitText.SplitText(".sofi-tooltip .description p", {
      type: "lines",
      linesClass: "line"
    });
    header1Split.chars.forEach(
      (char) => char.innerHTML = `<span>${char.innerHTML}</span>`
    );
    [...titleSplits.lines, ...descriptionSplits.lines].forEach(
      (line) => line.innerHTML = `<span>${line.innerHTML}</span>`
    );
    const animOptions = {
      duration: animationDuration,
      ease: "power3.out",
      stagger: staggerDelay
    };
    import_ScrollTrigger7.ScrollTrigger.create({
      trigger: ".sofi-product-overview",
      start: "75% bottom",
      onEnter: () => import_gsap7.default.to(".sofi-header-1 h1 .char > span", {
        y: "0%",
        ...animOptions
      }),
      onLeaveBack: () => import_gsap7.default.to(".sofi-header-1 h1 .char > span", {
        y: "100%",
        ...animOptions
      })
    });
    import_ScrollTrigger7.ScrollTrigger.create({
      trigger: ".sofi-product-overview",
      start: "top top",
      end: `+=${window.innerHeight * pinHeight}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: ({ progress }) => {
        const headerProgress = Math.max(
          0,
          Math.min(1, (progress - 0.05) / 0.3)
        );
        import_gsap7.default.to(".sofi-header-1", {
          xPercent: progress < 0.05 ? 0 : progress > 0.35 ? -100 : -100 * headerProgress
        });
        const maskSize = progress < 0.2 ? 0 : progress > 0.3 ? 100 : 100 * ((progress - 0.2) / 0.1);
        import_gsap7.default.to(".sofi-circular-mask", {
          clipPath: `circle(${maskSize}% at 50% 50%)`
        });
        const header2Progress = (progress - 0.15) / 0.35;
        const header2XPercent = progress < 0.15 ? 100 : progress > 0.5 ? -200 : 100 - 300 * header2Progress;
        import_gsap7.default.to(".sofi-header-2", { xPercent: header2XPercent });
        const scaleX = progress < 0.45 ? 0 : progress > 0.65 ? 100 : 100 * ((progress - 0.45) / 0.2);
        import_gsap7.default.to(".sofi-tooltip .divider", {
          scaleX: `${scaleX}%`,
          ...animOptions
        });
        tooltips.forEach((tooltip, index) => {
          const elements = [
            `.sofi-tooltip:nth-child(${index + 1}) .icon i`,
            `.sofi-tooltip:nth-child(${index + 1}) .title .line > span`,
            `.sofi-tooltip:nth-child(${index + 1}) .description .line > span`
          ];
          import_gsap7.default.to(elements, {
            y: progress >= tooltip.trigger ? "0%" : "125%",
            ...animOptions
          });
        });
        const model = modelRef.current;
        if (model && progress >= 0.05) {
          const rotationProgress = (progress - 0.05) / 0.95;
          const targetRotation = Math.PI * 3 * 4 * rotationProgress;
          const rotationDiff = targetRotation - currentRotationRef.current;
          if (Math.abs(rotationDiff) > 1e-3) {
            model.rotateOnAxis(new THREE2.Vector3(0, 1, 0), rotationDiff);
            currentRotationRef.current = targetRotation;
          }
        }
      }
    });
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      setupModel();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      import_ScrollTrigger7.ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      if (modelContainerRef.current && renderer.domElement) {
        modelContainerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [
    modelUrl,
    animationDuration,
    staggerDelay,
    pinHeight,
    modelSettings,
    tooltips
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: (0, import_utils5.cn)("sofi-health-scroll", className), ref: containerRef, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "sofi-product-overview", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "sofi-model-container", ref: modelContainerRef }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "sofi-header-1", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h1", { children: headerTexts.header1 }) }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "sofi-circular-mask", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "sofi-header-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h1", { children: headerTexts.header2 }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "sofi-tooltips", children: tooltips.map((tooltip, index) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "sofi-tooltip", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "icon", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("i", { className: `icon-${tooltip.icon}` }) }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "divider" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "content", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "title", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h2", { children: tooltip.title }) }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "description", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { children: tooltip.description }) })
        ] })
      ] }, index)) })
    ] }) })
  ] }) });
}

// src/components/TheFirstTheLastScroll.tsx
var import_utils6 = require("@tuel/utils");
var import_gsap8 = __toESM(require("gsap"));
var import_ScrollTrigger8 = require("gsap/ScrollTrigger");
var import_react12 = require("react");
var import_jsx_runtime10 = require("react/jsx-runtime");
function TheFirstTheLastScroll({
  cards,
  className,
  pinHeight = 8,
  distanceMultiplier = 0.15,
  exitDistance = { x: 0.3, y: 0.3 }
}) {
  const containerRef = (0, import_react12.useRef)(null);
  const cardRefs = (0, import_react12.useRef)([]);
  const defaultRotations = [-12, 10, -5, 5, -5, -2];
  (0, import_react12.useEffect)(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    import_gsap8.default.registerPlugin(import_ScrollTrigger8.ScrollTrigger);
    const cardElements = cardRefs.current.filter(Boolean);
    const rotations = cards.map(
      (card, index) => card.rotation !== void 0 ? card.rotation : defaultRotations[index % defaultRotations.length]
    );
    cardElements.forEach((card, index) => {
      if (card) {
        import_gsap8.default.set(card, {
          y: window.innerHeight,
          rotate: rotations[index]
        });
      }
    });
    const scrollTrigger = import_ScrollTrigger8.ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: `+=${window.innerHeight * pinHeight}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const totalCards = cardElements.length;
        const progressPerCard = 1 / totalCards;
        cardElements.forEach((card, index) => {
          if (!card) return;
          const cardStart = index * progressPerCard;
          let cardProgress = (progress - cardStart) / progressPerCard;
          cardProgress = Math.min(Math.max(cardProgress, 0), 1);
          let yPos = window.innerHeight * (1 - cardProgress);
          let xPos = 0;
          if (cardProgress === 1 && index < totalCards - 1) {
            const remainingProgress = (progress - (cardStart + progressPerCard)) / (1 - (cardStart + progressPerCard));
            if (remainingProgress > 0) {
              const currentDistanceMultiplier = 1 - index * distanceMultiplier;
              xPos = -window.innerWidth * exitDistance.x * currentDistanceMultiplier * remainingProgress;
              yPos = -window.innerHeight * exitDistance.y * currentDistanceMultiplier * remainingProgress;
            }
          }
          import_gsap8.default.to(card, {
            y: yPos,
            x: xPos,
            duration: 0,
            ease: "none"
          });
        });
      }
    });
    return () => {
      scrollTrigger.kill();
    };
  }, [cards, pinHeight, distanceMultiplier, exitDistance]);
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: (0, import_utils6.cn)("the-first-the-last-scroll", className), children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "sticky-cards", ref: containerRef, children: cards.map((card, index) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
    "div",
    {
      className: "card",
      ref: (el) => {
        cardRefs.current[index] = el;
      },
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      },
      children: card.content
    },
    card.id
  )) }) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HorizontalScroll,
  HorizontalScrollItem,
  OrchestraCubes,
  OrkenWorldScroll,
  ParallaxContainer,
  ParallaxLayer,
  ParallaxScroll,
  RadgaHorizontalScroll,
  ScrollFrameAnimation,
  ScrollMinimap,
  SofiHealthScroll,
  TheFirstTheLastScroll,
  WodniackWorkScroll
});
