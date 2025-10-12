import { describe, it, expect } from "vitest";
import {
  animationPresets,
  getPreset,
  getPresetsByCategory,
  createCustomPreset,
} from "../animationPresets";

describe("animationPresets", () => {
  describe("Entrance Animations", () => {
    it("should have fadeIn preset", () => {
      expect(animationPresets.fadeIn).toBeDefined();
      expect(animationPresets.fadeIn.name).toBe("fadeIn");
      expect(animationPresets.fadeIn.variants).toHaveProperty("initial");
      expect(animationPresets.fadeIn.variants).toHaveProperty("animate");
    });

    it("should have slideInUp preset", () => {
      expect(animationPresets.slideInUp).toBeDefined();
      expect(animationPresets.slideInUp.name).toBe("slideInUp");
      expect(animationPresets.slideInUp.variants.initial).toHaveProperty("y", 50);
    });

    it("should have slideInDown preset", () => {
      expect(animationPresets.slideInDown).toBeDefined();
      expect(animationPresets.slideInDown.variants.initial).toHaveProperty("y", -50);
    });

    it("should have slideInLeft preset", () => {
      expect(animationPresets.slideInLeft).toBeDefined();
      expect(animationPresets.slideInLeft.variants.initial).toHaveProperty("x", -50);
    });

    it("should have slideInRight preset", () => {
      expect(animationPresets.slideInRight).toBeDefined();
      expect(animationPresets.slideInRight.variants.initial).toHaveProperty("x", 50);
    });

    it("should have scaleIn preset", () => {
      expect(animationPresets.scaleIn).toBeDefined();
      expect(animationPresets.scaleIn.variants.initial).toHaveProperty("scale", 0.8);
    });

    it("should have rotateIn preset", () => {
      expect(animationPresets.rotateIn).toBeDefined();
      expect(animationPresets.rotateIn.variants.initial).toHaveProperty("rotate", -180);
    });

    it("should have bounceIn preset", () => {
      expect(animationPresets.bounceIn).toBeDefined();
      expect(animationPresets.bounceIn.ease).toEqual([0.68, -0.55, 0.265, 1.55]);
    });

    it("should have zoomIn preset", () => {
      expect(animationPresets.zoomIn).toBeDefined();
      expect(animationPresets.zoomIn.name).toBe("zoomIn");
      expect(animationPresets.zoomIn.variants.initial).toHaveProperty("scale", 0);
    });

    it("should have flipIn preset", () => {
      expect(animationPresets.flipIn).toBeDefined();
      expect(animationPresets.flipIn.name).toBe("flipIn");
      expect(animationPresets.flipIn.variants.initial).toHaveProperty("rotateX", -90);
    });
  });

  describe("Exit Animations", () => {
    it("should have fadeOut preset", () => {
      expect(animationPresets.fadeOut).toBeDefined();
      expect(animationPresets.fadeOut.name).toBe("fadeOut");
      expect(animationPresets.fadeOut.variants.animate).toHaveProperty("opacity", 0);
    });

    it("should have slideOutUp preset", () => {
      expect(animationPresets.slideOutUp).toBeDefined();
      expect(animationPresets.slideOutUp.variants.animate).toHaveProperty("y", -50);
    });

    it("should have slideOutDown preset", () => {
      expect(animationPresets.slideOutDown).toBeDefined();
      expect(animationPresets.slideOutDown.variants.animate).toHaveProperty("y", 50);
    });

    it("should have slideOutLeft preset", () => {
      expect(animationPresets.slideOutLeft).toBeDefined();
      expect(animationPresets.slideOutLeft.variants.animate).toHaveProperty("x", -50);
    });

    it("should have slideOutRight preset", () => {
      expect(animationPresets.slideOutRight).toBeDefined();
      expect(animationPresets.slideOutRight.variants.animate).toHaveProperty("x", 50);
    });

    it("should have scaleOut preset", () => {
      expect(animationPresets.scaleOut).toBeDefined();
      expect(animationPresets.scaleOut.variants.animate).toHaveProperty("scale", 0.8);
    });

    it("should have rotateOut preset", () => {
      expect(animationPresets.rotateOut).toBeDefined();
      expect(animationPresets.rotateOut.variants.animate).toHaveProperty("rotate", 180);
    });

    it("should have bounceOut preset", () => {
      expect(animationPresets.bounceOut).toBeDefined();
      expect(animationPresets.bounceOut.variants.animate).toHaveProperty("scale", 0);
    });

    it("should have zoomOut preset", () => {
      expect(animationPresets.zoomOut).toBeDefined();
      expect(animationPresets.zoomOut.name).toBe("zoomOut");
      expect(animationPresets.zoomOut.variants.animate).toHaveProperty("scale", 0);
    });

    it("should have flipOut preset", () => {
      expect(animationPresets.flipOut).toBeDefined();
      expect(animationPresets.flipOut.name).toBe("flipOut");
      expect(animationPresets.flipOut.variants.animate).toHaveProperty("rotateX", 90);
    });
  });

  describe("Attention Animations", () => {
    it("should have pulse preset", () => {
      expect(animationPresets.pulse).toBeDefined();
      expect(animationPresets.pulse.name).toBe("pulse");
      expect(animationPresets.pulse.variants.animate.scale).toEqual([1, 1.05, 1]);
    });

    it("should have shake preset", () => {
      expect(animationPresets.shake).toBeDefined();
      expect(animationPresets.shake.variants.animate.x).toEqual([0, -10, 10, -10, 10, 0]);
    });

    it("should have wobble preset", () => {
      expect(animationPresets.wobble).toBeDefined();
      expect(animationPresets.wobble.variants.animate.rotate).toEqual([0, -5, 5, -5, 5, 0]);
    });

    it("should have flash preset", () => {
      expect(animationPresets.flash).toBeDefined();
      expect(animationPresets.flash.variants.animate.opacity).toEqual([1, 0, 1, 0, 1]);
    });

    it("should have bounce preset", () => {
      expect(animationPresets.bounce).toBeDefined();
      expect(animationPresets.bounce.name).toBe("bounce");
      expect(animationPresets.bounce.variants.animate.y).toEqual([0, -20, 0, -10, 0]);
    });

    it("should have swing preset", () => {
      expect(animationPresets.swing).toBeDefined();
      expect(animationPresets.swing.name).toBe("swing");
      expect(animationPresets.swing.variants.animate.rotate).toEqual([0, 15, -10, 5, -5, 0]);
    });

    it("should have rubberBand preset", () => {
      expect(animationPresets.rubberBand).toBeDefined();
      expect(animationPresets.rubberBand.name).toBe("rubberBand");
      expect(animationPresets.rubberBand.variants.animate).toHaveProperty("scaleX");
      expect(animationPresets.rubberBand.variants.animate).toHaveProperty("scaleY");
    });

    it("should have jello preset", () => {
      expect(animationPresets.jello).toBeDefined();
      expect(animationPresets.jello.name).toBe("jello");
      expect(animationPresets.jello.variants.animate).toHaveProperty("skewX");
      expect(animationPresets.jello.variants.animate).toHaveProperty("skewY");
    });
  });

  describe("Hover Animations", () => {
    it("should have lift preset", () => {
      expect(animationPresets.lift).toBeDefined();
      expect(animationPresets.lift.name).toBe("lift");
      expect(animationPresets.lift.variants.hover).toHaveProperty("y", -5);
    });

    it("should have grow preset", () => {
      expect(animationPresets.grow).toBeDefined();
      expect(animationPresets.grow.variants.hover).toHaveProperty("scale", 1.05);
    });

    it("should have shrink preset", () => {
      expect(animationPresets.shrink).toBeDefined();
      expect(animationPresets.shrink.variants.hover).toHaveProperty("scale", 0.95);
    });

    it("should have tilt preset", () => {
      expect(animationPresets.tilt).toBeDefined();
      expect(animationPresets.tilt.variants.hover).toHaveProperty("rotate", 2);
    });

    it("should have glow preset", () => {
      expect(animationPresets.glow).toBeDefined();
      expect(animationPresets.glow.name).toBe("glow");
      expect(animationPresets.glow.variants.hover).toHaveProperty("boxShadow");
    });

    it("should have float preset", () => {
      expect(animationPresets.float).toBeDefined();
      expect(animationPresets.float.name).toBe("float");
      expect(animationPresets.float.variants.hover.y).toEqual([0, -10, 0]);
    });
  });

  describe("Preset Properties", () => {
    it("all presets should have required properties", () => {
      Object.values(animationPresets).forEach((preset) => {
        expect(preset).toHaveProperty("name");
        expect(preset).toHaveProperty("duration");
        expect(preset).toHaveProperty("ease");
        expect(preset).toHaveProperty("variants");
      });
    });

    it("all entrance presets should have initial, animate, and exit variants", () => {
      const entrancePresets = [
        "fadeIn",
        "slideInUp",
        "slideInDown",
        "slideInLeft",
        "slideInRight",
        "scaleIn",
        "rotateIn",
        "bounceIn",
        "zoomIn",
        "flipIn",
      ];

      entrancePresets.forEach((key) => {
        const preset = animationPresets[key as keyof typeof animationPresets];
        expect(preset.variants).toHaveProperty("initial");
        expect(preset.variants).toHaveProperty("animate");
        expect(preset.variants).toHaveProperty("exit");
      });
    });

    it("all exit presets should have initial and animate variants", () => {
      const exitPresets = [
        "fadeOut",
        "slideOutUp",
        "slideOutDown",
        "slideOutLeft",
        "slideOutRight",
        "scaleOut",
        "rotateOut",
        "bounceOut",
        "zoomOut",
        "flipOut",
      ];

      exitPresets.forEach((key) => {
        const preset = animationPresets[key as keyof typeof animationPresets];
        expect(preset.variants).toHaveProperty("initial");
        expect(preset.variants).toHaveProperty("animate");
      });
    });

    it("all hover presets should have hover variant", () => {
      const hoverPresets = ["lift", "grow", "shrink", "tilt", "glow", "float"];

      hoverPresets.forEach((key) => {
        const preset = animationPresets[key as keyof typeof animationPresets];
        expect(preset.variants).toHaveProperty("hover");
      });
    });

    it("durations should be positive numbers", () => {
      Object.values(animationPresets).forEach((preset) => {
        expect(preset.duration).toBeGreaterThan(0);
        expect(typeof preset.duration).toBe("number");
      });
    });

    it("ease should be string or array", () => {
      Object.values(animationPresets).forEach((preset) => {
        expect(
          typeof preset.ease === "string" || Array.isArray(preset.ease)
        ).toBe(true);
      });
    });
  });
});

describe("getPreset", () => {
  it("should return the correct preset by name", () => {
    const fadeIn = getPreset("fadeIn");
    expect(fadeIn.name).toBe("fadeIn");
    expect(fadeIn).toBe(animationPresets.fadeIn);
  });

  it("should return slideInUp preset", () => {
    const slideInUp = getPreset("slideInUp");
    expect(slideInUp.name).toBe("slideInUp");
  });

  it("should return hover preset", () => {
    const lift = getPreset("lift");
    expect(lift.name).toBe("lift");
  });

  it("should return attention preset", () => {
    const pulse = getPreset("pulse");
    expect(pulse.name).toBe("pulse");
  });

  it("should return new preset", () => {
    const zoomIn = getPreset("zoomIn");
    expect(zoomIn.name).toBe("zoomIn");

    const bounce = getPreset("bounce");
    expect(bounce.name).toBe("bounce");
  });
});

describe("getPresetsByCategory", () => {
  it("should return all entrance animations", () => {
    const entrancePresets = getPresetsByCategory("entrance");

    expect(entrancePresets).toHaveLength(10);
    expect(entrancePresets.map((p) => p.name)).toEqual([
      "fadeIn",
      "slideInUp",
      "slideInDown",
      "slideInLeft",
      "slideInRight",
      "scaleIn",
      "rotateIn",
      "bounceIn",
      "zoomIn",
      "flipIn",
    ]);
  });

  it("should return all exit animations", () => {
    const exitPresets = getPresetsByCategory("exit");

    expect(exitPresets).toHaveLength(10);
    expect(exitPresets.map((p) => p.name)).toEqual([
      "fadeOut",
      "slideOutUp",
      "slideOutDown",
      "slideOutLeft",
      "slideOutRight",
      "scaleOut",
      "rotateOut",
      "bounceOut",
      "zoomOut",
      "flipOut",
    ]);
  });

  it("should return all attention animations", () => {
    const attentionPresets = getPresetsByCategory("attention");

    expect(attentionPresets).toHaveLength(8);
    expect(attentionPresets.map((p) => p.name)).toEqual([
      "pulse",
      "shake",
      "wobble",
      "flash",
      "bounce",
      "swing",
      "rubberBand",
      "jello",
    ]);
  });

  it("should return all hover animations", () => {
    const hoverPresets = getPresetsByCategory("hover");

    expect(hoverPresets).toHaveLength(6);
    expect(hoverPresets.map((p) => p.name)).toEqual([
      "lift",
      "grow",
      "shrink",
      "tilt",
      "glow",
      "float",
    ]);
  });

  it("all returned presets should be valid", () => {
    const categories = ["entrance", "exit", "attention", "hover"] as const;

    categories.forEach((category) => {
      const presets = getPresetsByCategory(category);
      presets.forEach((preset) => {
        expect(preset).toHaveProperty("name");
        expect(preset).toHaveProperty("duration");
        expect(preset).toHaveProperty("ease");
        expect(preset).toHaveProperty("variants");
      });
    });
  });
});

describe("createCustomPreset", () => {
  it("should create custom preset based on fadeIn", () => {
    const custom = createCustomPreset("fadeIn", {
      duration: 800,
      ease: "linear",
    });

    expect(custom.duration).toBe(800);
    expect(custom.ease).toBe("linear");
    expect(custom.name).toBe("fadeIn"); // preserves base name
  });

  it("should override variants while preserving others", () => {
    const custom = createCustomPreset("slideInUp", {
      variants: {
        initial: { y: 100, opacity: 0 },
      },
    });

    expect(custom.variants.initial).toEqual({ y: 100, opacity: 0 });
    expect(custom.variants.animate).toBeDefined(); // preserved from base
    expect(custom.variants.exit).toBeDefined(); // preserved from base
  });

  it("should preserve base properties not overridden", () => {
    const custom = createCustomPreset("bounceIn", {
      duration: 1500,
    });

    expect(custom.duration).toBe(1500); // overridden
    expect(custom.ease).toEqual([0.68, -0.55, 0.265, 1.55]); // preserved
    expect(custom.name).toBe("bounceIn"); // preserved
  });

  it("should work with hover presets", () => {
    const custom = createCustomPreset("lift", {
      duration: 300,
      variants: {
        hover: {
          y: -10,
          transition: { duration: 0.3 },
        },
      },
    });

    expect(custom.duration).toBe(300);
    expect(custom.variants.hover.y).toBe(-10);
  });

  it("should allow complete variant replacement", () => {
    const custom = createCustomPreset("fadeIn", {
      variants: {
        initial: { scale: 0 },
        animate: { scale: 1 },
        exit: { scale: 0 },
      },
    });

    expect(custom.variants.initial).toEqual({ scale: 0 });
    expect(custom.variants.animate).toEqual({ scale: 1 });
    expect(custom.variants.exit).toEqual({ scale: 0 });
  });

  it("should handle new preset variations", () => {
    const custom = createCustomPreset("zoomIn", {
      duration: 700,
      ease: [0.5, 0, 0.5, 1],
    });

    expect(custom.name).toBe("zoomIn");
    expect(custom.duration).toBe(700);
    expect(custom.ease).toEqual([0.5, 0, 0.5, 1]);
  });

  it("should work with attention animations", () => {
    const custom = createCustomPreset("pulse", {
      duration: 1500,
      variants: {
        animate: {
          scale: [1, 1.1, 1],
          transition: {
            duration: 1.5,
            repeat: Infinity,
          },
        },
      },
    });

    expect(custom.duration).toBe(1500);
    expect(custom.variants.animate.scale).toEqual([1, 1.1, 1]);
  });
});
