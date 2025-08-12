"use client";

import { cn } from "@tuel/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

export interface TheFirstTheLastScrollProps {
  cards: Array<{
    id: string;
    content: React.ReactNode;
    rotation?: number;
  }>;
  className?: string;
  pinHeight?: number;
  distanceMultiplier?: number;
  exitDistance?: {
    x: number;
    y: number;
  };
}

export function TheFirstTheLastScroll({
  cards,
  className,
  pinHeight = 8,
  distanceMultiplier = 0.15,
  exitDistance = { x: 0.3, y: 0.3 },
}: TheFirstTheLastScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const defaultRotations = [-12, 10, -5, 5, -5, -2];

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const cardElements = cardRefs.current.filter(Boolean);
    const rotations = cards.map((card, index) =>
      card.rotation !== undefined
        ? card.rotation
        : defaultRotations[index % defaultRotations.length]
    );

    // Set initial positions
    cardElements.forEach((card, index) => {
      if (card) {
        gsap.set(card, {
          y: window.innerHeight,
          rotate: rotations[index],
        });
      }
    });

    // Create scroll trigger
    const scrollTrigger = ScrollTrigger.create({
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

          // Handle exit animation for all cards except the last one
          if (cardProgress === 1 && index < totalCards - 1) {
            const remainingProgress =
              (progress - (cardStart + progressPerCard)) /
              (1 - (cardStart + progressPerCard));

            if (remainingProgress > 0) {
              const currentDistanceMultiplier = 1 - index * distanceMultiplier;
              xPos =
                -window.innerWidth *
                exitDistance.x *
                currentDistanceMultiplier *
                remainingProgress;
              yPos =
                -window.innerHeight *
                exitDistance.y *
                currentDistanceMultiplier *
                remainingProgress;
            }
          }

          gsap.to(card, {
            y: yPos,
            x: xPos,
            duration: 0,
            ease: "none",
          });
        });
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [cards, pinHeight, distanceMultiplier, exitDistance]);

  return (
    <div className={cn("the-first-the-last-scroll", className)}>
      <div className="sticky-cards" ref={containerRef}>
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="card"
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {card.content}
          </div>
        ))}
      </div>
    </div>
  );
}
