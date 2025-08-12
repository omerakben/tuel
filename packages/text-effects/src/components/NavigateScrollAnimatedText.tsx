"use client";

import { cn } from "@tuel/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

export interface NavigateScrollAnimatedTextProps {
  paragraphs: string[];
  keywords?: string[];
  className?: string;
  wordHighlightBgColor?: string;
  pinHeight?: number;
  overlapWords?: number;
  reverseOverlapWords?: number;
  onProgress?: (progress: number) => void;
}

export function NavigateScrollAnimatedText({
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
    "vision",
  ],
  className,
  wordHighlightBgColor = "60, 60, 60",
  pinHeight = 4,
  overlapWords = 15,
  reverseOverlapWords = 5,
  onProgress,
}: NavigateScrollAnimatedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;

    // Process paragraphs and create word structure
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

    // Create scroll trigger
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
          const wordText = word.querySelector("span") as HTMLElement;

          if (progress <= 0.7) {
            const progressTarget = 0.7;
            const revealProgress = Math.min(1, progress / progressTarget);

            const totalAnimationLength = 1 + overlapWords / totalWords;

            const wordStart = index / totalWords;
            const wordEnd = wordStart + overlapWords / totalWords;

            const timelineScale =
              1 /
              Math.min(
                totalAnimationLength,
                1 + (totalWords - 1) / totalWords + overlapWords / totalWords
              );

            const adjustedStart = wordStart * timelineScale;
            const adjustedEnd = wordEnd * timelineScale;
            const duration = adjustedEnd - adjustedStart;

            const wordProgress =
              revealProgress <= adjustedStart
                ? 0
                : revealProgress >= adjustedEnd
                ? 1
                : (revealProgress - adjustedStart) / duration;

            (word as HTMLElement).style.opacity = wordProgress.toString();

            const backgroundFadeStart =
              wordProgress >= 0.9 ? (wordProgress - 0.9) / 0.1 : 0;
            const backgroundOpacity = Math.max(0, 1 - backgroundFadeStart);
            (
              word as HTMLElement
            ).style.backgroundColor = `rgba(${wordHighlightBgColor}, ${backgroundOpacity})`;

            const textRevealThreshold = 0.9;
            const textRevealProgress =
              wordProgress >= textRevealThreshold
                ? (wordProgress - textRevealThreshold) /
                  (1 - textRevealThreshold)
                : 0;
            wordText.style.opacity = Math.pow(
              textRevealProgress,
              0.5
            ).toString();
          } else {
            const reverseProgress = (progress - 0.7) / 0.3;
            (word as HTMLElement).style.opacity = "1";
            const targetTextOpacity = 1;

            const reverseWordStart = index / totalWords;
            const reverseWordEnd =
              reverseWordStart + reverseOverlapWords / totalWords;

            const reverseTimelineScale =
              1 /
              Math.max(
                1,
                (totalWords - 1) / totalWords + reverseOverlapWords / totalWords
              );

            const reverseAdjustedStart =
              reverseWordStart * reverseTimelineScale;
            const reverseAdjustedEnd = reverseWordEnd * reverseTimelineScale;
            const reverseDuration = reverseAdjustedEnd - reverseAdjustedStart;

            const reverseWordProgress =
              reverseProgress <= reverseAdjustedStart
                ? 0
                : reverseProgress >= reverseAdjustedEnd
                ? 1
                : (reverseProgress - reverseAdjustedStart) / reverseDuration;

            if (reverseWordProgress > 0) {
              wordText.style.opacity = (
                targetTextOpacity *
                (1 - reverseWordProgress)
              ).toString();
              (
                word as HTMLElement
              ).style.backgroundColor = `rgba(${wordHighlightBgColor}, ${reverseWordProgress})`;
            } else {
              wordText.style.opacity = targetTextOpacity.toString();
              (
                word as HTMLElement
              ).style.backgroundColor = `rgba(${wordHighlightBgColor}, 0)`;
            }
          }
        });
      },
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
    onProgress,
  ]);

  return (
    <div className={cn("navigate-scroll-animated-text", className)}>
      <div className="anime-text-container" ref={containerRef}>
        <div className="anime-text">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
