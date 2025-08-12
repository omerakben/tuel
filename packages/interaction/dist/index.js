"use client";
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
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
  CursorFollower: () => CursorFollower,
  useCursorFollower: () => useCursorFollower,
  useImageTrail: () => useImageTrail,
  useMouseTracking: () => useMouseTracking
});
module.exports = __toCommonJS(index_exports);

// src/useMouseTracking.ts
var import_framer_motion = require("framer-motion");
var import_react = require("react");
function useMouseTracking(options = {}) {
  const {
    smooth = true,
    smoothFactor = 0.1,
    threshold = 1,
    trackVelocity = true
  } = options;
  const mouseX = (0, import_framer_motion.useMotionValue)(0);
  const mouseY = (0, import_framer_motion.useMotionValue)(0);
  const smoothX = (0, import_framer_motion.useSpring)(mouseX, { damping: 30, stiffness: 400 });
  const smoothY = (0, import_framer_motion.useSpring)(mouseY, { damping: 30, stiffness: 400 });
  const positionRef = (0, import_react.useRef)({ x: 0, y: 0 });
  const previousPositionRef = (0, import_react.useRef)({ x: 0, y: 0 });
  const velocityRef = (0, import_react.useRef)({ x: 0, y: 0 });
  const lastTimeRef = (0, import_react.useRef)(0);
  const isMovingRef = (0, import_react.useRef)(false);
  const calculateDistance = (0, import_react.useCallback)(
    (p1, p2) => {
      return Math.hypot(p2.x - p1.x, p2.y - p1.y);
    },
    []
  );
  const updatePosition = (0, import_react.useCallback)(
    (clientX, clientY) => {
      const now = performance.now();
      const deltaTime = now - lastTimeRef.current;
      previousPositionRef.current = __spreadValues({}, positionRef.current);
      positionRef.current = { x: clientX, y: clientY };
      mouseX.set(clientX);
      mouseY.set(clientY);
      if (trackVelocity && deltaTime > 0) {
        const deltaX = clientX - previousPositionRef.current.x;
        const deltaY = clientY - previousPositionRef.current.y;
        velocityRef.current = {
          x: deltaX / deltaTime,
          y: deltaY / deltaTime
        };
      }
      const distance = calculateDistance(
        previousPositionRef.current,
        positionRef.current
      );
      isMovingRef.current = distance > threshold;
      lastTimeRef.current = now;
    },
    [mouseX, mouseY, trackVelocity, threshold, calculateDistance]
  );
  const handleMouseMove = (0, import_react.useCallback)(
    (event) => {
      updatePosition(event.clientX, event.clientY);
    },
    [updatePosition]
  );
  (0, import_react.useEffect)(() => {
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);
  return {
    position: positionRef.current,
    previousPosition: previousPositionRef.current,
    smoothPosition: {
      x: smoothX.get(),
      y: smoothY.get()
    },
    velocity: velocityRef.current,
    distance: calculateDistance(
      previousPositionRef.current,
      positionRef.current
    ),
    isMoving: isMovingRef.current
  };
}

// src/useImageTrail.ts
var import_framer_motion2 = require("framer-motion");
var import_react2 = require("react");
function useImageTrail(options) {
  const {
    images = [],
    imageLifespan = 1e3,
    mouseThreshold = 150,
    inDuration = 750,
    outDuration = 1e3,
    staggerIn = 100,
    staggerOut = 25,
    slideDuration = 1e3,
    easing = "cubic-bezier(0.87, 0, 0.13, 1)",
    maskLayers = 10
  } = options;
  const containerRef = (0, import_react2.useRef)(null);
  const trailRef = (0, import_react2.useRef)([]);
  const currentImageIndexRef = (0, import_react2.useRef)(0);
  const animationFrameRef = (0, import_react2.useRef)(void 0);
  const mouseX = (0, import_framer_motion2.useMotionValue)(0);
  const mouseY = (0, import_framer_motion2.useMotionValue)(0);
  const smoothX = (0, import_framer_motion2.useSpring)(mouseX, { damping: 30, stiffness: 400 });
  const smoothY = (0, import_framer_motion2.useSpring)(mouseY, { damping: 30, stiffness: 400 });
  const previousMouse = (0, import_react2.useRef)({ x: 0, y: 0 });
  const calculateDistance = (0, import_react2.useCallback)(
    (x1, y1, x2, y2) => {
      return Math.hypot(x2 - x1, y2 - y1);
    },
    []
  );
  const isInContainer = (0, import_react2.useCallback)((x, y) => {
    if (!containerRef.current) return false;
    const rect = containerRef.current.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }, []);
  const createTrailImage = (0, import_react2.useCallback)(() => {
    if (!containerRef.current || images.length === 0) return;
    const imgContainer = document.createElement("div");
    imgContainer.classList.add("trail-img");
    imgContainer.style.cssText = `
      position: absolute;
      width: 175px;
      height: 175px;
      pointer-events: none;
      z-index: 10;
    `;
    const imgSrc = images[currentImageIndexRef.current];
    currentImageIndexRef.current = (currentImageIndexRef.current + 1) % images.length;
    const rect = containerRef.current.getBoundingClientRect();
    const startX = smoothX.get() - rect.left - 87.5;
    const startY = smoothY.get() - rect.top - 87.5;
    const targetX = mouseX.get() - rect.left - 87.5;
    const targetY = mouseY.get() - rect.top - 87.5;
    imgContainer.style.left = `${startX}px`;
    imgContainer.style.top = `${startY}px`;
    imgContainer.style.transition = `left ${slideDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), top ${slideDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    const layers = [];
    const imageLayers = [];
    for (let i = 0; i < maskLayers; i++) {
      const layer = document.createElement("div");
      layer.classList.add("mask-layer");
      layer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        transform: translateZ(0);
        backface-visibility: hidden;
      `;
      const imageLayer = document.createElement("div");
      imageLayer.classList.add("image-layer");
      imageLayer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url(${imgSrc});
        background-size: cover;
        background-position: center;
      `;
      const startY2 = i * (100 / maskLayers);
      const endY = (i + 1) * (100 / maskLayers);
      layer.style.clipPath = `polygon(50% ${startY2}%, 50% ${startY2}%, 50% ${endY}%, 50% ${endY}%)`;
      layer.style.transition = `clip-path ${inDuration}ms ${easing}`;
      layer.appendChild(imageLayer);
      imgContainer.appendChild(layer);
      layers.push(layer);
      imageLayers.push(imageLayer);
    }
    containerRef.current.appendChild(imgContainer);
    requestAnimationFrame(() => {
      imgContainer.style.left = `${targetX}px`;
      imgContainer.style.top = `${targetY}px`;
      layers.forEach((layer, i) => {
        const startY2 = i * (100 / maskLayers);
        const endY = (i + 1) * (100 / maskLayers);
        const distanceFromMiddle = Math.abs(i - (maskLayers - 1) / 2);
        const delay = distanceFromMiddle * staggerIn;
        setTimeout(() => {
          layer.style.clipPath = `polygon(0% ${startY2}%, 100% ${startY2}%, 100% ${endY}%, 0% ${endY}%)`;
        }, delay);
      });
    });
    trailRef.current.push({
      element: imgContainer,
      maskLayers: layers,
      imageLayers,
      removeTime: Date.now() + imageLifespan
    });
  }, [
    images,
    smoothX,
    smoothY,
    mouseX,
    mouseY,
    slideDuration,
    maskLayers,
    inDuration,
    easing,
    staggerIn,
    imageLifespan
  ]);
  const removeOldImages = (0, import_react2.useCallback)(() => {
    const now = Date.now();
    while (trailRef.current.length > 0 && now >= trailRef.current[0].removeTime) {
      const imgToRemove = trailRef.current.shift();
      imgToRemove.maskLayers.forEach((layer, i) => {
        const startY = i * (100 / maskLayers);
        const endY = (i + 1) * (100 / maskLayers);
        const distanceFromEdge = (maskLayers - 1) / 2 - Math.abs(i - (maskLayers - 1) / 2);
        const delay = distanceFromEdge * staggerOut;
        layer.style.transition = `clip-path ${outDuration}ms ${easing}`;
        setTimeout(() => {
          layer.style.clipPath = `polygon(50% ${startY}%, 50% ${startY}%, 50% ${endY}%, 50% ${endY}%)`;
        }, delay);
      });
      imgToRemove.imageLayers.forEach((imageLayer) => {
        imageLayer.style.transition = `opacity ${outDuration}ms ${easing}`;
        imageLayer.style.opacity = "0.25";
      });
      setTimeout(() => {
        if (imgToRemove.element.parentNode) {
          imgToRemove.element.parentNode.removeChild(imgToRemove.element);
        }
      }, outDuration + 112);
    }
  }, [maskLayers, staggerOut, outDuration, easing]);
  const animate = (0, import_react2.useCallback)(() => {
    const currentX = mouseX.get();
    const currentY = mouseY.get();
    const distance = calculateDistance(
      currentX,
      currentY,
      previousMouse.current.x,
      previousMouse.current.y
    );
    if (distance > mouseThreshold && isInContainer(currentX, currentY)) {
      createTrailImage();
      previousMouse.current = { x: currentX, y: currentY };
    }
    removeOldImages();
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [
    mouseX,
    mouseY,
    calculateDistance,
    mouseThreshold,
    isInContainer,
    createTrailImage,
    removeOldImages
  ]);
  const handleMouseMove = (0, import_react2.useCallback)(
    (event) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    },
    [mouseX, mouseY]
  );
  const startAnimation = (0, import_react2.useCallback)(() => {
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [handleMouseMove, animate]);
  const stopAnimation = (0, import_react2.useCallback)(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    trailRef.current.forEach((item) => {
      if (item.element.parentNode) {
        item.element.parentNode.removeChild(item.element);
      }
    });
    trailRef.current.length = 0;
  }, [handleMouseMove]);
  return {
    containerRef,
    startAnimation,
    stopAnimation,
    trailCount: trailRef.current.length
  };
}

// src/useCursorFollower.ts
var import_framer_motion3 = require("framer-motion");
var import_react3 = __toESM(require("react"));
function useCursorFollower(options = {}) {
  const {
    damping = 30,
    stiffness = 400,
    mass = 1,
    trackVelocity = true,
    idleSize = 20,
    hoverSize = 40
  } = options;
  const mouseX = (0, import_framer_motion3.useMotionValue)(0);
  const mouseY = (0, import_framer_motion3.useMotionValue)(0);
  const cursorX = (0, import_framer_motion3.useSpring)(mouseX, { damping, stiffness, mass });
  const cursorY = (0, import_framer_motion3.useSpring)(mouseY, { damping, stiffness, mass });
  const scale = (0, import_framer_motion3.useMotionValue)(1);
  const opacity = (0, import_framer_motion3.useMotionValue)(0);
  const isHovering = (0, import_react3.useRef)(false);
  const velocity = (0, import_react3.useRef)({ x: 0, y: 0 });
  const handleMouseMove = (0, import_react3.useCallback)(
    (event) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      opacity.set(1);
    },
    [mouseX, mouseY, opacity]
  );
  (0, import_react3.useEffect)(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);
  return {
    x: cursorX,
    y: cursorY,
    scale,
    opacity,
    isHovering: isHovering.current,
    velocity: velocity.current
  };
}
var CursorFollower = (props) => {
  const _a = props, { children, className = "", style = {} } = _a, options = __objRest(_a, ["children", "className", "style"]);
  const cursor = useCursorFollower(options);
  return import_react3.default.createElement(
    import_framer_motion3.motion.div,
    {
      className: `cursor-follower ${className}`,
      style: __spreadValues({
        position: "fixed",
        pointerEvents: "none",
        x: cursor.x,
        y: cursor.y,
        scale: cursor.scale,
        opacity: cursor.opacity
      }, style)
    },
    children
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CursorFollower,
  useCursorFollower,
  useImageTrail,
  useMouseTracking
});
