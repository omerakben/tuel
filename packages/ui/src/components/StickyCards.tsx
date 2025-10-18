import { cn } from "@tuel/utils";
import { ReactNode, useEffect, useRef } from "react";

export interface StickyCard {
  id: string;
  content: ReactNode;
  backgroundColor?: string;
  image?: string;
  title?: string;
  description?: string;
}

export interface StickyCardsProps {
  cards: StickyCard[];
  className?: string;
  cardClassName?: string;
  overlap?: number;
  scaleEffect?: boolean;
  rotateEffect?: boolean;
  fadeEffect?: boolean;
  spacing?: number;
}

export function StickyCards({
  cards,
  className,
  cardClassName,
  overlap = 40,
  scaleEffect = true,
  rotateEffect = false,
  fadeEffect = false,
  spacing = 100,
}: StickyCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Basic intersection observer for scroll effects
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLDivElement;
          const index = cardsRef.current.indexOf(target);

          if (entry.isIntersecting) {
            const rect = target.getBoundingClientRect();
            const progress = Math.max(
              0,
              Math.min(1, (window.innerHeight - rect.top) / window.innerHeight)
            );

            if (scaleEffect && index < cards.length - 1) {
              const scale = 1 - progress * 0.05;
              target.style.transform = `scale(${scale})`;
            }

            if (rotateEffect && index < cards.length - 1) {
              const rotation = progress * 3;
              target.style.transform = `${target.style.transform} rotate(${rotation}deg)`;
            }

            if (fadeEffect && index < cards.length - 1) {
              const opacity = 1 - progress * 0.3;
              target.style.opacity = opacity.toString();
            }
          }
        });
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [cards.length, scaleEffect, rotateEffect, fadeEffect]);

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{ minHeight: `${cards.length * spacing}vh` }}
    >
      {cards.map((card, index) => (
        <div
          key={card.id}
          ref={(el) => {
            if (el) cardsRef.current[index] = el;
          }}
          className={cn(
            "sticky top-0 w-full h-screen flex items-center justify-center",
            "will-change-transform",
            cardClassName
          )}
          style={{
            backgroundColor: card.backgroundColor,
            zIndex: cards.length - index,
          }}
        >
          {card.image && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${card.image})` }}
            />
          )}
          <div className="relative z-10 p-8">
            {card.title && (
              <h2 className="text-4xl font-bold mb-4">{card.title}</h2>
            )}
            {card.description && <p className="text-lg">{card.description}</p>}
            {card.content}
          </div>
        </div>
      ))}
    </div>
  );
}
