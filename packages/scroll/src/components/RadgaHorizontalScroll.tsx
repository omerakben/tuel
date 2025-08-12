"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useEffect, useRef } from "react";

export interface RadgaHorizontalScrollSlide {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
}

export interface RadgaHorizontalScrollProps {
  slides: RadgaHorizontalScrollSlide[];
  stickyHeight?: number;
  backgroundColor?: string;
  outroTitle?: string;
  outroBackgroundColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function RadgaHorizontalScroll({
  slides,
  stickyHeight = 6,
  backgroundColor = "#b4aea7",
  outroTitle = "Shaping timeless spaces with contemporary vision",
  outroBackgroundColor = "#141414",
  className = "",
  style = {},
}: RadgaHorizontalScrollProps) {
  const stickyRef = useRef<HTMLElement>(null);
  const slidesContainerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentVisibleIndexRef = useRef<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!stickyRef.current || !slidesContainerRef.current || !sliderRef.current)
      return;

    // Register GSAP plugins
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const stickySection = stickyRef.current;
    const slidesContainer = slidesContainerRef.current;
    const slider = sliderRef.current;
    const slideElements = slideRefs.current.filter(Boolean) as HTMLDivElement[];

    const slideWidth = window.innerWidth;
    const totalMove = slideWidth * (slides.length - 1);
    const stickyHeightPx = window.innerHeight * stickyHeight;

    // Set up initial slide positions
    slideElements.forEach((slide, index) => {
      gsap.set(slide, {
        x: index * slideWidth,
      });

      const image = slide.querySelector("img") as HTMLImageElement;
      if (image) {
        gsap.set(image, {
          scale: 1.35,
        });
      }
    });

    // Create IntersectionObserver for slide visibility
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const slideIndex = slideElements.indexOf(
            entry.target as HTMLDivElement
          );
          if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
            if (currentVisibleIndexRef.current !== slideIndex) {
              currentVisibleIndexRef.current = slideIndex;
              // You can add slide change callbacks here if needed
            }
          }
        });
      },
      {
        root: slider,
        threshold: [0, 0.25],
      }
    );

    observerRef.current = observer;
    slideElements.forEach((slide) => observer.observe(slide));

    // Main ScrollTrigger animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: stickySection,
      start: "top top",
      end: `+=${stickyHeightPx}px`,
      scrub: 1,
      pin: true,
      pinSpacing: true,
      onUpdate: (self: any) => {
        const progress = self.progress;
        const mainMove = progress * totalMove;

        gsap.set(slidesContainer, {
          x: -mainMove,
        });

        const currentSlide = Math.floor(mainMove / slideWidth);
        const slideProgress = (mainMove % slideWidth) / slideWidth;

        slideElements.forEach((slide, index) => {
          const image = slide.querySelector("img") as HTMLImageElement;
          if (image) {
            if (index === currentSlide || index === currentSlide + 1) {
              const relativeProgress =
                index === currentSlide ? slideProgress : slideProgress - 1;
              const parallaxAmount = relativeProgress * slideWidth * 0.25;
              gsap.set(image, {
                x: parallaxAmount,
                scale: 1.35,
              });
            } else {
              gsap.set(image, {
                x: 0,
                scale: 1.35,
              });
            }
          }
        });
      },
    });

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      scrollTrigger.kill();
    };
  }, [slides, stickyHeight, backgroundColor]);

  return (
    <div
      className={`radga-horizontal-scroll ${className}`}
      style={{
        position: "relative",
        fontFamily: "Gilroy, Arial, sans-serif",
        ...style,
      }}
    >
      {/* Main sticky section */}
      <section
        ref={stickyRef}
        className="radga-sticky"
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          backgroundColor,
        }}
      >
        <div
          ref={sliderRef}
          className="radga-slider"
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <div
            ref={slidesContainerRef}
            className="radga-slides-container"
            style={{
              position: "relative",
              width: `${slides.length * 100}vw`,
              height: "100%",
              display: "flex",
              willChange: "transform",
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                ref={(el) => {
                  slideRefs.current[index] = el;
                }}
                className="radga-slide"
                style={{
                  position: "relative",
                  width: "100vw",
                  height: "100%",
                  overflow: "hidden",
                  willChange: "transform",
                }}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    willChange: "transform",
                  }}
                />
                <div
                  className="radga-slide-content"
                  style={{
                    position: "absolute",
                    bottom: "1.5em",
                    left: "1.5em",
                    zIndex: 10,
                    color: "#fff",
                    pointerEvents: "none",
                  }}
                >
                  <h1
                    style={{
                      margin: 0,
                      textTransform: "uppercase",
                      fontSize: "60px",
                      fontWeight: 900,
                      letterSpacing: "-2px",
                      lineHeight: "0.9",
                      willChange: "transform",
                      fontFamily: "Gilroy, Arial, sans-serif",
                    }}
                  >
                    {slide.title}
                    {slide.subtitle && (
                      <>
                        <br />
                        {slide.subtitle}
                      </>
                    )}
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outro section */}
      <section
        className="radga-outro"
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          padding: "1.5em",
          overflow: "hidden",
          backgroundColor: outroBackgroundColor,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "#fff",
            textTransform: "uppercase",
            fontSize: "60px",
            fontWeight: 900,
            letterSpacing: "-2px",
            lineHeight: "0.9",
            fontFamily: "Gilroy, Arial, sans-serif",
          }}
        >
          {outroTitle}
        </h1>
      </section>
    </div>
  );
}
