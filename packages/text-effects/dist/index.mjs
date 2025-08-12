// src/components/AnimatedText.tsx
import { cn } from "@tuel/utils";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { jsx } from "react/jsx-runtime";
function AnimatedText({
  children,
  className,
  variant = "fade",
  splitType = "chars",
  staggerDelay = 0.03,
  duration = 0.5,
  triggerOnScroll = true,
  delay = 0,
  as: Component = "div"
}) {
  const textRef = useRef(null);
  const splitRef = useRef(null);
  const isInView = useInView(textRef, { once: true, amount: 0.5 });
  const getVariants = () => {
    switch (variant) {
      case "slide":
        return {
          hidden: {
            opacity: 0,
            y: 50
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration,
              delay,
              staggerChildren: staggerDelay
            }
          }
        };
      case "typewriter":
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: 0.05,
              delay,
              staggerChildren: 0.05
            }
          }
        };
      case "wave":
        return {
          hidden: {
            opacity: 0,
            y: 100,
            rotateZ: -10
          },
          visible: {
            opacity: 1,
            y: 0,
            rotateZ: 0,
            transition: {
              duration,
              delay,
              staggerChildren: staggerDelay,
              ease: [0.6, 0.01, -0.05, 0.95]
            }
          }
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration,
              delay,
              staggerChildren: staggerDelay
            }
          }
        };
    }
  };
  useEffect(() => {
    if (typeof window === "undefined" || !textRef.current) return;
    if (variant === "split" || variant === "explode" || variant === "scramble") {
      const text = children;
      const element = textRef.current;
      if (splitType === "chars") {
        element.innerHTML = text.split("").map(
          (char) => `<span class="split-char">${char === " " ? "&nbsp;" : char}</span>`
        ).join("");
      } else if (splitType === "words") {
        element.innerHTML = text.split(/\s+/).map((word) => `<span class="split-word">${word}</span>`).join(" ");
      } else if (splitType === "lines") {
        element.innerHTML = text.split(/\s+/).map((word) => `<span class="split-line">${word}</span>`).join(" ");
      }
      const elements = element.querySelectorAll(`.split-${splitType}`);
      if (variant === "split") {
        gsap.set(elements, { opacity: 0, y: 50, rotateX: -90 });
        const tl = gsap.timeline({
          delay,
          onComplete: () => {
            if (textRef.current) {
              textRef.current.innerHTML = children;
            }
          }
        });
        tl.to(elements, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration,
          stagger: staggerDelay,
          ease: "back.out(1.7)"
        });
        if (triggerOnScroll && !isInView) {
          tl.pause();
        }
      } else if (variant === "explode") {
        gsap.set(elements, { opacity: 0, scale: 0 });
        const tl = gsap.timeline({ delay });
        tl.to(elements, {
          opacity: 1,
          scale: 1,
          duration,
          stagger: {
            amount: 0.5,
            from: "center",
            grid: "auto"
          },
          ease: "elastic.out(1, 0.5)"
        });
        if (triggerOnScroll && !isInView) {
          tl.pause();
        }
      } else if (variant === "scramble") {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
        elements.forEach((el, i) => {
          const element2 = el;
          const originalChar = element2.textContent || "";
          let scrambleCount = 0;
          const maxScrambles = 10;
          const scrambleInterval = setInterval(() => {
            if (scrambleCount < maxScrambles) {
              element2.textContent = chars[Math.floor(Math.random() * chars.length)];
              scrambleCount++;
            } else {
              element2.textContent = originalChar;
              clearInterval(scrambleInterval);
            }
          }, 50);
        });
      }
    }
    return () => {
      if (textRef.current) {
        textRef.current.innerHTML = children;
      }
    };
  }, [
    variant,
    splitType,
    duration,
    staggerDelay,
    delay,
    isInView,
    triggerOnScroll,
    children
  ]);
  useEffect(() => {
    if (triggerOnScroll && isInView && splitRef.current) {
      const tl = gsap.timeline();
      if (variant === "split" || variant === "explode") {
        tl.play();
      }
    }
  }, [isInView, triggerOnScroll, variant]);
  if (variant === "fade" || variant === "slide" || variant === "typewriter" || variant === "wave") {
    const variants = getVariants();
    return /* @__PURE__ */ jsx(
      motion.div,
      {
        ref: textRef,
        initial: "hidden",
        animate: triggerOnScroll ? isInView ? "visible" : "hidden" : "visible",
        variants,
        className: cn("overflow-hidden", className),
        children: variant === "typewriter" ? children.split("").map((char, i) => /* @__PURE__ */ jsx(
          motion.span,
          {
            variants: {
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            },
            children: char === " " ? "\xA0" : char
          },
          i
        )) : /* @__PURE__ */ jsx(Component, { children })
      }
    );
  }
  return /* @__PURE__ */ jsx(
    Component,
    {
      ref: textRef,
      className: cn("overflow-hidden", className),
      children
    }
  );
}

// src/components/NavigateScrollAnimatedText.tsx
import { cn as cn2 } from "@tuel/utils";
import gsap2 from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect as useEffect2, useRef as useRef2 } from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
function NavigateScrollAnimatedText({
  paragraphs,
  keywords = [
    "vibrant",
    "living",
    "clarity",
    "expression",
    "shape",
    "intuitive",
    "storytelling",
    "interactive",
    "vision"
  ],
  className,
  wordHighlightBgColor = "60, 60, 60",
  pinHeight = 4,
  overlapWords = 15,
  reverseOverlapWords = 5,
  onProgress
}) {
  const containerRef = useRef2(null);
  useEffect2(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    gsap2.registerPlugin(ScrollTrigger);
    const container = containerRef.current;
    const paragraphElements = container.querySelectorAll(".anime-text p");
    paragraphElements.forEach((paragraph) => {
      const text = paragraph.textContent || "";
      const words = text.split(/\s+/);
      paragraph.innerHTML = "";
      words.forEach((word) => {
        if (word.trim()) {
          const wordContainer = document.createElement("div");
          wordContainer.className = "word";
          const wordText = document.createElement("span");
          wordText.textContent = word;
          const normalizedWord = word.toLowerCase().replace(/[.,!?;:"]/g, "");
          if (keywords.includes(normalizedWord)) {
            wordContainer.classList.add("keyword-wrapper");
            wordText.classList.add("keyword", normalizedWord);
          }
          wordContainer.appendChild(wordText);
          paragraph.appendChild(wordContainer);
        }
      });
    });
    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      pin: container,
      start: "top top",
      end: `+=${window.innerHeight * pinHeight}`,
      pinSpacing: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const words = Array.from(
          container.querySelectorAll(".anime-text .word")
        );
        const totalWords = words.length;
        onProgress?.(progress);
        words.forEach((word, index) => {
          const wordText = word.querySelector("span");
          if (progress <= 0.7) {
            const progressTarget = 0.7;
            const revealProgress = Math.min(1, progress / progressTarget);
            const totalAnimationLength = 1 + overlapWords / totalWords;
            const wordStart = index / totalWords;
            const wordEnd = wordStart + overlapWords / totalWords;
            const timelineScale = 1 / Math.min(
              totalAnimationLength,
              1 + (totalWords - 1) / totalWords + overlapWords / totalWords
            );
            const adjustedStart = wordStart * timelineScale;
            const adjustedEnd = wordEnd * timelineScale;
            const duration = adjustedEnd - adjustedStart;
            const wordProgress = revealProgress <= adjustedStart ? 0 : revealProgress >= adjustedEnd ? 1 : (revealProgress - adjustedStart) / duration;
            word.style.opacity = wordProgress.toString();
            const backgroundFadeStart = wordProgress >= 0.9 ? (wordProgress - 0.9) / 0.1 : 0;
            const backgroundOpacity = Math.max(0, 1 - backgroundFadeStart);
            word.style.backgroundColor = `rgba(${wordHighlightBgColor}, ${backgroundOpacity})`;
            const textRevealThreshold = 0.9;
            const textRevealProgress = wordProgress >= textRevealThreshold ? (wordProgress - textRevealThreshold) / (1 - textRevealThreshold) : 0;
            wordText.style.opacity = Math.pow(
              textRevealProgress,
              0.5
            ).toString();
          } else {
            const reverseProgress = (progress - 0.7) / 0.3;
            word.style.opacity = "1";
            const targetTextOpacity = 1;
            const reverseWordStart = index / totalWords;
            const reverseWordEnd = reverseWordStart + reverseOverlapWords / totalWords;
            const reverseTimelineScale = 1 / Math.max(
              1,
              (totalWords - 1) / totalWords + reverseOverlapWords / totalWords
            );
            const reverseAdjustedStart = reverseWordStart * reverseTimelineScale;
            const reverseAdjustedEnd = reverseWordEnd * reverseTimelineScale;
            const reverseDuration = reverseAdjustedEnd - reverseAdjustedStart;
            const reverseWordProgress = reverseProgress <= reverseAdjustedStart ? 0 : reverseProgress >= reverseAdjustedEnd ? 1 : (reverseProgress - reverseAdjustedStart) / reverseDuration;
            if (reverseWordProgress > 0) {
              wordText.style.opacity = (targetTextOpacity * (1 - reverseWordProgress)).toString();
              word.style.backgroundColor = `rgba(${wordHighlightBgColor}, ${reverseWordProgress})`;
            } else {
              wordText.style.opacity = targetTextOpacity.toString();
              word.style.backgroundColor = `rgba(${wordHighlightBgColor}, 0)`;
            }
          }
        });
      }
    });
    return () => {
      scrollTrigger.kill();
    };
  }, [
    paragraphs,
    keywords,
    wordHighlightBgColor,
    pinHeight,
    overlapWords,
    reverseOverlapWords,
    onProgress
  ]);
  return /* @__PURE__ */ jsx2("div", { className: cn2("navigate-scroll-animated-text", className), children: /* @__PURE__ */ jsx2("div", { className: "anime-text-container", ref: containerRef, children: /* @__PURE__ */ jsx2("div", { className: "anime-text", children: paragraphs.map((paragraph, index) => /* @__PURE__ */ jsx2("p", { children: paragraph }, index)) }) }) });
}

// src/components/ParticleText.tsx
import { cn as cn3 } from "@tuel/utils";
import { useEffect as useEffect3, useRef as useRef3, useState } from "react";
import { jsx as jsx3 } from "react/jsx-runtime";
function ParticleText({
  text,
  className,
  font = "bold 80px Arial",
  fontSize = 80,
  color = "#ffffff",
  backgroundColor = "transparent",
  particleSize = 2,
  particleGap = 3,
  mouseRadius = 100,
  mouseForce = 2,
  returnSpeed = 0.1,
  friction = 0.95,
  ease = 0.1,
  hover = true,
  explode = false,
  wave = false,
  waveSpeed = 2e-3,
  waveAmplitude = 20,
  interactive = true,
  density = 1
}) {
  const canvasRef = useRef3(null);
  const animationFrameRef = useRef3(void 0);
  const particlesRef = useRef3([]);
  const mouseRef = useRef3({ x: -1e3, y: -1e3 });
  const waveOffsetRef = useRef3(0);
  const [isExploded, setIsExploded] = useState(false);
  useEffect3(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initializeParticles();
    };
    const initializeParticles = () => {
      particlesRef.current = [];
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;
      tempCtx.font = font;
      const textMetrics = tempCtx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight = fontSize * 1.2;
      tempCanvas.width = textWidth;
      tempCanvas.height = textHeight;
      tempCtx.font = font;
      tempCtx.fillStyle = color;
      tempCtx.textBaseline = "middle";
      tempCtx.fillText(text, 0, textHeight / 2);
      const imageData = tempCtx.getImageData(0, 0, textWidth, textHeight);
      const data = imageData.data;
      const centerX = canvas.offsetWidth / 2 - textWidth / 2;
      const centerY = canvas.offsetHeight / 2 - textHeight / 2;
      const gap = Math.max(1, Math.floor(particleGap / density));
      for (let y = 0; y < textHeight; y += gap) {
        for (let x = 0; x < textWidth; x += gap) {
          const index = (y * textWidth + x) * 4;
          const alpha = data[index + 3];
          if (alpha > 128) {
            const particle = {
              x: centerX + x,
              y: centerY + y,
              originX: centerX + x,
              originY: centerY + y,
              vx: 0,
              vy: 0,
              size: particleSize,
              color: `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, ${alpha / 255})`,
              distance: 0
            };
            particlesRef.current.push(particle);
          }
        }
      }
    };
    const updateParticle = (particle) => {
      if (interactive && mouseRef.current.x > 0) {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        particle.distance = distance;
        if (distance < mouseRadius) {
          const angle = Math.atan2(dy, dx);
          const force = (1 - distance / mouseRadius) * mouseForce;
          if (hover) {
            particle.vx -= Math.cos(angle) * force;
            particle.vy -= Math.sin(angle) * force;
          } else {
            particle.vx += Math.cos(angle) * force;
            particle.vy += Math.sin(angle) * force;
          }
        }
      }
      if (explode && isExploded) {
        const angle = Math.random() * Math.PI * 2;
        const force = Math.random() * 10 + 5;
        particle.vx = Math.cos(angle) * force;
        particle.vy = Math.sin(angle) * force;
      }
      if (wave) {
        const waveY = Math.sin(particle.originX * 0.01 + waveOffsetRef.current) * waveAmplitude;
        particle.y = particle.originY + waveY;
      }
      if (!isExploded) {
        const dx = particle.originX - particle.x;
        const dy = particle.originY - particle.y;
        particle.vx += dx * returnSpeed;
        particle.vy += dy * returnSpeed;
      }
      particle.vx *= friction;
      particle.vy *= friction;
      particle.x += particle.vx;
      particle.y += particle.vy;
    };
    const drawParticle = (particle) => {
      ctx.save();
      let alpha = 1;
      if (interactive && particle.distance > 0 && particle.distance < mouseRadius * 2) {
        alpha = 1 - (particle.distance - mouseRadius) / mouseRadius;
        alpha = Math.max(0.3, Math.min(1, alpha));
      }
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    const animate = () => {
      if (backgroundColor === "transparent") {
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      } else {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      }
      if (wave) {
        waveOffsetRef.current += waveSpeed;
      }
      particlesRef.current.forEach((particle) => {
        updateParticle(particle);
        drawParticle(particle);
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1e3, y: -1e3 };
    };
    const handleClick = () => {
      if (explode) {
        setIsExploded(!isExploded);
      }
    };
    resizeCanvas();
    animationFrameRef.current = requestAnimationFrame(animate);
    window.addEventListener("resize", resizeCanvas);
    if (interactive) {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
      if (explode) {
        canvas.addEventListener("click", handleClick);
      }
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("click", handleClick);
    };
  }, [
    text,
    font,
    fontSize,
    color,
    backgroundColor,
    particleSize,
    particleGap,
    mouseRadius,
    mouseForce,
    returnSpeed,
    friction,
    ease,
    hover,
    explode,
    wave,
    waveSpeed,
    waveAmplitude,
    interactive,
    density,
    isExploded
  ]);
  return /* @__PURE__ */ jsx3(
    "canvas",
    {
      ref: canvasRef,
      className: cn3("w-full h-full cursor-pointer", className),
      style: { background: backgroundColor }
    }
  );
}
export {
  AnimatedText,
  NavigateScrollAnimatedText,
  ParticleText
};
