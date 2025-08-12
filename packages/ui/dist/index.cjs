'use strict';

var utils = require('@tuel/utils');
var framerMotion = require('framer-motion');
var react = require('react');

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
function AnimatedMenu({
  items,
  className,
  variant = "slide",
  position = "left",
  triggerElement,
  backgroundColor = "bg-black",
  textColor = "text-white",
  animationDuration = 0.5,
  staggerDelay = 0.1
}) {
  const [isOpen, setIsOpen] = react.useState(false);
  const menuRef = react.useRef(null);
  const itemsRef = react.useRef([]);
  const getMenuVariants = () => {
    switch (variant) {
      case "overlay":
        return {
          hidden: {
            clipPath: "circle(0% at 50% 50%)",
            opacity: 0
          },
          visible: {
            clipPath: "circle(150% at 50% 50%)",
            opacity: 1,
            transition: { duration: animationDuration, ease: "easeInOut" }
          },
          exit: {
            clipPath: "circle(0% at 50% 50%)",
            opacity: 0,
            transition: { duration: animationDuration, ease: "easeInOut" }
          }
        };
      case "push": {
        const pushDirection = {
          left: { x: "-100%" },
          right: { x: "100%" },
          top: { y: "-100%" },
          bottom: { y: "100%" }
        };
        return {
          hidden: pushDirection[position],
          visible: {
            x: 0,
            y: 0,
            transition: { duration: animationDuration, ease: "easeOut" }
          },
          exit: __spreadProps(__spreadValues({}, pushDirection[position]), {
            transition: { duration: animationDuration, ease: "easeIn" }
          })
        };
      }
      case "morph":
        return {
          hidden: {
            scale: 0,
            borderRadius: "50%"
          },
          visible: {
            scale: 1,
            borderRadius: "0%",
            transition: { duration: animationDuration, ease: "easeOut" }
          },
          exit: {
            scale: 0,
            borderRadius: "50%",
            transition: { duration: animationDuration, ease: "easeIn" }
          }
        };
      case "circular":
        return {
          hidden: {
            clipPath: `circle(0% at ${position === "right" ? "100% 0%" : "0% 0%"})`
          },
          visible: {
            clipPath: "circle(150% at 50% 50%)",
            transition: { duration: animationDuration, ease: "easeOut" }
          },
          exit: {
            clipPath: `circle(0% at ${position === "right" ? "100% 0%" : "0% 0%"})`,
            transition: { duration: animationDuration, ease: "easeIn" }
          }
        };
      default: {
        const slideDirection = {
          left: { x: "-100%" },
          right: { x: "100%" },
          top: { y: "-100%" },
          bottom: { y: "100%" }
        };
        return {
          hidden: slideDirection[position],
          visible: {
            x: 0,
            y: 0,
            transition: {
              duration: animationDuration,
              type: "spring",
              damping: 20
            }
          },
          exit: __spreadProps(__spreadValues({}, slideDirection[position]), {
            transition: { duration: animationDuration / 2 }
          })
        };
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      x: position === "left" ? -50 : position === "right" ? 50 : 0,
      y: position === "top" ? -50 : position === "bottom" ? 50 : 0
    },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        delay: i * staggerDelay,
        duration: 0.3,
        ease: "easeOut"
      }
    }),
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
  const getPositionStyles = () => {
    const base = "fixed z-50";
    switch (position) {
      case "right":
        return `${base} top-0 right-0 h-full w-80`;
      case "top":
        return `${base} top-0 left-0 w-full h-80`;
      case "bottom":
        return `${base} bottom-0 left-0 w-full h-80`;
      default:
        return `${base} top-0 left-0 h-full w-80`;
    }
  };
  const menuVariants = getMenuVariants();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setIsOpen(!isOpen),
      className: "relative z-50",
      "aria-label": "Toggle menu"
    },
    triggerElement || /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5 p-2" }, /* @__PURE__ */ React.createElement(
      framerMotion.motion.span,
      {
        animate: { rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 },
        className: "block h-0.5 w-8 bg-current"
      }
    ), /* @__PURE__ */ React.createElement(
      framerMotion.motion.span,
      {
        animate: { opacity: isOpen ? 0 : 1 },
        className: "block h-0.5 w-8 bg-current"
      }
    ), /* @__PURE__ */ React.createElement(
      framerMotion.motion.span,
      {
        animate: { rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 },
        className: "block h-0.5 w-8 bg-current"
      }
    ))
  ), /* @__PURE__ */ React.createElement(framerMotion.AnimatePresence, null, isOpen && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    framerMotion.motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      onClick: () => setIsOpen(false),
      className: "fixed inset-0 bg-black bg-opacity-50 z-40"
    }
  ), /* @__PURE__ */ React.createElement(
    framerMotion.motion.nav,
    {
      ref: menuRef,
      initial: "hidden",
      animate: "visible",
      exit: "exit",
      variants: menuVariants,
      className: utils.cn(
        getPositionStyles(),
        backgroundColor,
        textColor,
        "overflow-hidden",
        className
      )
    },
    /* @__PURE__ */ React.createElement("div", { className: "h-full overflow-y-auto p-8" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, items.map((item, index) => /* @__PURE__ */ React.createElement(
      framerMotion.motion.div,
      {
        key: item.id,
        ref: (el) => {
          if (el) itemsRef.current[index] = el;
        },
        custom: index,
        variants: itemVariants,
        initial: "hidden",
        animate: "visible",
        exit: "exit"
      },
      /* @__PURE__ */ React.createElement(
        "a",
        {
          href: item.href || "#",
          className: "block text-2xl font-bold hover:opacity-70 transition-opacity",
          onClick: () => setIsOpen(false)
        },
        /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-4" }, item.icon, item.label)
      ),
      item.subItems && /* @__PURE__ */ React.createElement("div", { className: "ml-8 mt-2 space-y-2" }, item.subItems.map((subItem) => /* @__PURE__ */ React.createElement(
        "a",
        {
          key: subItem.id,
          href: subItem.href || "#",
          className: "block text-lg opacity-70 hover:opacity-100 transition-opacity",
          onClick: () => setIsOpen(false)
        },
        subItem.label
      )))
    ))))
  ))));
}
function ImageGallery({
  images,
  className,
  layout = "grid",
  columns = 3,
  gap = 16,
  animationType = "fade",
  hoverEffect = "zoom",
  onClick
}) {
  const [selectedImage, setSelectedImage] = react.useState(null);
  const galleryRef = react.useRef(null);
  const getAnimationVariants = () => {
    switch (animationType) {
      case "slide":
        return {
          hidden: { x: -100, opacity: 0 },
          visible: { x: 0, opacity: 1 },
          exit: { x: 100, opacity: 0 }
        };
      case "scale":
        return {
          hidden: { scale: 0.8, opacity: 0 },
          visible: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 }
        };
      case "flip":
        return {
          hidden: { rotateY: 90, opacity: 0 },
          visible: { rotateY: 0, opacity: 1 },
          exit: { rotateY: -90, opacity: 0 }
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 }
        };
    }
  };
  const getLayoutStyles = () => {
    const baseStyles = {
      display: "grid",
      gap: `${gap}px`
    };
    switch (layout) {
      case "masonry":
        return __spreadProps(__spreadValues({}, baseStyles), {
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridAutoRows: "masonry"
        });
      case "carousel":
        return {
          display: "flex",
          gap: `${gap}px`,
          overflowX: "auto",
          scrollSnapType: "x mandatory"
        };
      case "stack":
        return {
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: `${gap}px`
        };
      default:
        return __spreadProps(__spreadValues({}, baseStyles), {
          gridTemplateColumns: `repeat(auto-fill, minmax(250px, 1fr))`
        });
    }
  };
  const getHoverEffectClass = () => {
    switch (hoverEffect) {
      case "zoom":
        return "hover:scale-105 transition-transform duration-300";
      case "tilt":
        return "hover:rotate-1 transition-transform duration-300";
      case "overlay":
        return "relative group";
      default:
        return "";
    }
  };
  const variants = getAnimationVariants();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: galleryRef,
      className: utils.cn("gallery-container", className),
      style: getLayoutStyles()
    },
    images.map((image, index) => /* @__PURE__ */ React.createElement(
      framerMotion.motion.div,
      {
        key: image.id,
        variants,
        initial: "hidden",
        animate: "visible",
        exit: "exit",
        transition: { delay: index * 0.1 },
        className: utils.cn(
          "gallery-item cursor-pointer relative overflow-hidden rounded-lg",
          getHoverEffectClass()
        ),
        onClick: () => {
          setSelectedImage(image);
          onClick == null ? void 0 : onClick(image, index);
        }
      },
      /* @__PURE__ */ React.createElement(
        "img",
        {
          src: image.src,
          alt: image.alt,
          className: "w-full h-full object-cover",
          loading: "lazy"
        }
      ),
      hoverEffect === "overlay" && /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-white text-center p-4" }, image.title && /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-bold mb-2" }, image.title), image.description && /* @__PURE__ */ React.createElement("p", { className: "text-sm" }, image.description)))
    ))
  ), /* @__PURE__ */ React.createElement(framerMotion.AnimatePresence, null, selectedImage && /* @__PURE__ */ React.createElement(
    framerMotion.motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4",
      onClick: () => setSelectedImage(null)
    },
    /* @__PURE__ */ React.createElement(
      framerMotion.motion.div,
      {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.8, opacity: 0 },
        className: "relative max-w-4xl max-h-full",
        onClick: (e) => e.stopPropagation()
      },
      /* @__PURE__ */ React.createElement(
        "img",
        {
          src: selectedImage.src,
          alt: selectedImage.alt,
          className: "max-w-full max-h-full object-contain"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => setSelectedImage(null),
          className: "absolute top-4 right-4 text-white text-2xl hover:opacity-70 transition-opacity",
          "aria-label": "Close"
        },
        "\xD7"
      ),
      (selectedImage.title || selectedImage.description) && /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4" }, selectedImage.title && /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold mb-2" }, selectedImage.title), selectedImage.description && /* @__PURE__ */ React.createElement("p", { className: "text-sm opacity-90" }, selectedImage.description))
    )
  )));
}
function StickyCards({
  cards,
  className,
  cardClassName,
  overlap = 40,
  scaleEffect = true,
  rotateEffect = false,
  fadeEffect = false,
  spacing = 100
}) {
  const containerRef = react.useRef(null);
  const cardsRef = react.useRef([]);
  react.useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target;
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
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: containerRef,
      className: utils.cn("relative", className),
      style: { minHeight: `${cards.length * spacing}vh` }
    },
    cards.map((card, index) => /* @__PURE__ */ React.createElement(
      "div",
      {
        key: card.id,
        ref: (el) => {
          if (el) cardsRef.current[index] = el;
        },
        className: utils.cn(
          "sticky top-0 w-full h-screen flex items-center justify-center",
          "will-change-transform",
          cardClassName
        ),
        style: {
          backgroundColor: card.backgroundColor,
          zIndex: cards.length - index
        }
      },
      card.image && /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "absolute inset-0 bg-cover bg-center",
          style: { backgroundImage: `url(${card.image})` }
        }
      ),
      /* @__PURE__ */ React.createElement("div", { className: "relative z-10 p-8" }, card.title && /* @__PURE__ */ React.createElement("h2", { className: "text-4xl font-bold mb-4" }, card.title), card.description && /* @__PURE__ */ React.createElement("p", { className: "text-lg" }, card.description), card.content)
    ))
  );
}
function Carousel({
  slides,
  className,
  variant = "slide",
  autoPlay = false,
  autoPlayInterval = 5e3,
  loop = true,
  showIndicators = true,
  showArrows = true,
  draggable = true,
  direction = "horizontal",
  onSlideChange
}) {
  var _a, _b, _c, _d;
  const [currentIndex, setCurrentIndex] = react.useState(0);
  const [isDragging, setIsDragging] = react.useState(false);
  const containerRef = react.useRef(null);
  const autoPlayRef = react.useRef(
    void 0
  );
  const goToSlide = react.useCallback(
    (index) => {
      let newIndex = index;
      if (loop) {
        if (index < 0) newIndex = slides.length - 1;
        else if (index >= slides.length) newIndex = 0;
      } else {
        newIndex = Math.max(0, Math.min(slides.length - 1, index));
      }
      setCurrentIndex(newIndex);
      onSlideChange == null ? void 0 : onSlideChange(newIndex);
    },
    [loop, slides.length, onSlideChange]
  );
  react.useEffect(() => {
    if (autoPlay && !isDragging) {
      autoPlayRef.current = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, autoPlayInterval);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, isDragging, currentIndex, goToSlide, autoPlayInterval]);
  const getVariants = () => {
    const isHorizontal = direction === "horizontal";
    switch (variant) {
      case "fade":
        return {
          enter: { opacity: 1 },
          center: { opacity: 1 },
          exit: { opacity: 0 }
        };
      case "scale":
        return {
          enter: { scale: 0.8, opacity: 0 },
          center: { scale: 1, opacity: 1 },
          exit: { scale: 1.2, opacity: 0 }
        };
      case "3d":
        return {
          enter: {
            rotateY: isHorizontal ? 90 : 0,
            rotateX: isHorizontal ? 0 : 90,
            opacity: 0
          },
          center: {
            rotateY: 0,
            rotateX: 0,
            opacity: 1
          },
          exit: {
            rotateY: isHorizontal ? -90 : 0,
            rotateX: isHorizontal ? 0 : -90,
            opacity: 0
          }
        };
      case "stack":
        return {
          enter: { scale: 0.8, y: 50, opacity: 0 },
          center: { scale: 1, y: 0, opacity: 1 },
          exit: { scale: 1.1, y: -50, opacity: 0 }
        };
      default:
        return {
          enter: {
            x: isHorizontal ? 300 : 0,
            y: isHorizontal ? 0 : 300,
            opacity: 0
          },
          center: {
            x: 0,
            y: 0,
            opacity: 1
          },
          exit: {
            x: isHorizontal ? -300 : 0,
            y: isHorizontal ? 0 : -300,
            opacity: 0
          }
        };
    }
  };
  const handleDragEnd = (_, info) => {
    const threshold = 50;
    const isHorizontal = direction === "horizontal";
    const offset = isHorizontal ? info.offset.x : info.offset.y;
    if (Math.abs(offset) > threshold) {
      if (offset > 0) {
        goToSlide(currentIndex - 1);
      } else {
        goToSlide(currentIndex + 1);
      }
    }
    setIsDragging(false);
  };
  const variants = getVariants();
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: containerRef,
      className: utils.cn("relative w-full h-full overflow-hidden", className)
    },
    /* @__PURE__ */ React.createElement("div", { className: "relative w-full h-full" }, /* @__PURE__ */ React.createElement(framerMotion.AnimatePresence, { mode: "wait", initial: false }, /* @__PURE__ */ React.createElement(
      framerMotion.motion.div,
      {
        key: currentIndex,
        variants,
        initial: "enter",
        animate: "center",
        exit: "exit",
        transition: { duration: 0.5, ease: "easeInOut" },
        className: "absolute inset-0 w-full h-full",
        drag: draggable ? direction === "horizontal" ? "x" : "y" : false,
        dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
        dragElastic: 0.2,
        onDragStart: () => setIsDragging(true),
        onDragEnd: handleDragEnd
      },
      ((_a = slides[currentIndex]) == null ? void 0 : _a.image) && /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "absolute inset-0 bg-cover bg-center",
          style: {
            backgroundImage: `url(${slides[currentIndex].image})`
          }
        }
      ),
      /* @__PURE__ */ React.createElement("div", { className: "relative z-10 w-full h-full flex items-center justify-center p-8" }, ((_b = slides[currentIndex]) == null ? void 0 : _b.title) && /* @__PURE__ */ React.createElement("h2", { className: "text-4xl font-bold mb-4 text-center" }, slides[currentIndex].title), ((_c = slides[currentIndex]) == null ? void 0 : _c.description) && /* @__PURE__ */ React.createElement("p", { className: "text-lg text-center mb-6" }, slides[currentIndex].description), (_d = slides[currentIndex]) == null ? void 0 : _d.content)
    ))),
    showArrows && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => goToSlide(currentIndex - 1),
        className: "absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all",
        "aria-label": "Previous slide"
      },
      /* @__PURE__ */ React.createElement(
        "svg",
        {
          className: "w-6 h-6",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24"
        },
        /* @__PURE__ */ React.createElement(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M15 19l-7-7 7-7"
          }
        )
      )
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => goToSlide(currentIndex + 1),
        className: "absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all",
        "aria-label": "Next slide"
      },
      /* @__PURE__ */ React.createElement(
        "svg",
        {
          className: "w-6 h-6",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24"
        },
        /* @__PURE__ */ React.createElement(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M9 5l7 7-7 7"
          }
        )
      )
    )),
    showIndicators && /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2" }, slides.map((_, index) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: index,
        onClick: () => goToSlide(index),
        className: utils.cn(
          "w-3 h-3 rounded-full transition-all",
          index === currentIndex ? "bg-white" : "bg-white bg-opacity-50 hover:bg-opacity-75"
        ),
        "aria-label": `Go to slide ${index + 1}`
      }
    )))
  );
}

exports.AnimatedMenu = AnimatedMenu;
exports.Carousel = Carousel;
exports.ImageGallery = ImageGallery;
exports.StickyCards = StickyCards;
