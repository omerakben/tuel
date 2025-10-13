"use client";

import { cn } from "@tuel/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export interface SofiHealthScrollProps {
  modelUrl: string;
  className?: string;
  headerTexts?: {
    header1: string;
    header2: string;
  };
  tooltips?: Array<{
    icon: string;
    title: string;
    description: string;
    trigger: number;
  }>;
  animationDuration?: number;
  staggerDelay?: number;
  pinHeight?: number;
  modelSettings?: {
    metalness?: number;
    roughness?: number;
    cameraDistance?: { mobile: number; desktop: number };
    rotation?: { desktop: number };
    position?: {
      mobile: [number, number, number];
      desktop: [number, number, number];
    };
  };
}

export function SofiHealthScroll({
  modelUrl,
  className,
  headerTexts = {
    header1: "Product Overview",
    header2: "Key Features",
  },
  tooltips = [
    {
      icon: "checkmark-circle",
      title: "High Quality",
      description: "Premium materials and construction",
      trigger: 0.65,
    },
    {
      icon: "star",
      title: "User Friendly",
      description: "Intuitive design for everyday use",
      trigger: 0.85,
    },
  ],
  animationDuration = 1,
  staggerDelay = 0.025,
  pinHeight = 10,
  modelSettings = {
    metalness: 0.05,
    roughness: 0.9,
    cameraDistance: { mobile: 2, desktop: 1.25 },
    rotation: { desktop: -25 },
    position: { mobile: [1, 0.085, 0], desktop: [-0.4, 0.085, 0] },
  },
}: SofiHealthScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelContainerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const currentRotationRef = useRef(0);
  const modelSizeRef = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !modelContainerRef.current) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.toneMappingExposure = 1.0;

    modelContainerRef.current.appendChild(renderer.domElement);

    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Add lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
    mainLight.position.set(1, 2, 3);
    mainLight.castShadow = true;
    mainLight.shadow.bias = -0.001;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-2, 0, -2);
    scene.add(fillLight);

    const setupModel = () => {
      const model = modelRef.current;
      const modelSize = modelSizeRef.current;
      if (!model || !modelSize) return;

      const isMobile = window.innerWidth < 1000;
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());

      const [mobileX, mobileY, mobileZ] = modelSettings.position?.mobile || [
        1, 0.085, 0,
      ];
      const [desktopX, desktopY, desktopZ] = modelSettings.position
        ?.desktop || [-0.4, 0.085, 0];

      model.position.set(
        isMobile
          ? center.x + modelSize.x * mobileX
          : -center.x - modelSize.x * desktopX,
        -center.y + modelSize.y * (isMobile ? mobileY : desktopY),
        -center.z + (isMobile ? mobileZ : desktopZ)
      );

      model.rotation.z = isMobile
        ? 0
        : THREE.MathUtils.degToRad(modelSettings.rotation?.desktop || -25);

      const cameraDistance = isMobile
        ? modelSettings.cameraDistance?.mobile || 2
        : modelSettings.cameraDistance?.desktop || 1.25;

      camera.position.set(
        0,
        0,
        Math.max(modelSize.x, modelSize.y, modelSize.z) * cameraDistance
      );
      camera.lookAt(0, 0, 0);
    };

    // Load model
    new GLTFLoader().load(modelUrl, (gltf) => {
      const model = gltf.scene;
      modelRef.current = model;

      model.traverse((node) => {
        if ((node as any).isMesh && (node as any).material) {
          Object.assign((node as any).material, {
            metalness: modelSettings.metalness || 0.05,
            roughness: modelSettings.roughness || 0.9,
          });
        }
      });

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      modelSizeRef.current = size;

      scene.add(model);
      setupModel();
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Split text animations
    const header1Split = new SplitText(".sofi-header-1 h1", {
      type: "chars",
      charsClass: "char",
    });
    const titleSplits = new SplitText(".sofi-tooltip .title h2", {
      type: "lines",
      linesClass: "line",
    });
    const descriptionSplits = new SplitText(".sofi-tooltip .description p", {
      type: "lines",
      linesClass: "line",
    });

    header1Split.chars.forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char.textContent || "";
      char.textContent = "";
      char.appendChild(span);
    });
    [...titleSplits.lines, ...descriptionSplits.lines].forEach((line) => {
      const span = document.createElement("span");
      span.textContent = line.textContent || "";
      line.textContent = "";
      line.appendChild(span);
    });

    const animOptions = {
      duration: animationDuration,
      ease: "power3.out",
      stagger: staggerDelay,
    };

    // Header 1 animation
    ScrollTrigger.create({
      trigger: ".sofi-product-overview",
      start: "75% bottom",
      onEnter: () =>
        gsap.to(".sofi-header-1 h1 .char > span", {
          y: "0%",
          ...animOptions,
        }),
      onLeaveBack: () =>
        gsap.to(".sofi-header-1 h1 .char > span", {
          y: "100%",
          ...animOptions,
        }),
    });

    // Main scroll animation
    ScrollTrigger.create({
      trigger: ".sofi-product-overview",
      start: "top top",
      end: `+=${window.innerHeight * pinHeight}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: ({ progress }) => {
        // Header 1 slide out
        const headerProgress = Math.max(
          0,
          Math.min(1, (progress - 0.05) / 0.3)
        );
        gsap.to(".sofi-header-1", {
          xPercent:
            progress < 0.05
              ? 0
              : progress > 0.35
              ? -100
              : -100 * headerProgress,
        });

        // Circular mask reveal
        const maskSize =
          progress < 0.2
            ? 0
            : progress > 0.3
            ? 100
            : 100 * ((progress - 0.2) / 0.1);
        gsap.to(".sofi-circular-mask", {
          clipPath: `circle(${maskSize}% at 50% 50%)`,
        });

        // Header 2 animation
        const header2Progress = (progress - 0.15) / 0.35;
        const header2XPercent =
          progress < 0.15
            ? 100
            : progress > 0.5
            ? -200
            : 100 - 300 * header2Progress;
        gsap.to(".sofi-header-2", { xPercent: header2XPercent });

        // Tooltip divider scale
        const scaleX =
          progress < 0.45
            ? 0
            : progress > 0.65
            ? 100
            : 100 * ((progress - 0.45) / 0.2);
        gsap.to(".sofi-tooltip .divider", {
          scaleX: `${scaleX}%`,
          ...animOptions,
        });

        // Tooltip animations
        tooltips.forEach((tooltip, index) => {
          const elements = [
            `.sofi-tooltip:nth-child(${index + 1}) .icon i`,
            `.sofi-tooltip:nth-child(${index + 1}) .title .line > span`,
            `.sofi-tooltip:nth-child(${index + 1}) .description .line > span`,
          ];

          gsap.to(elements, {
            y: progress >= tooltip.trigger ? "0%" : "125%",
            ...animOptions,
          });
        });

        // Model rotation
        const model = modelRef.current;
        if (model && progress >= 0.05) {
          const rotationProgress = (progress - 0.05) / 0.95;
          const targetRotation = Math.PI * 3 * 4 * rotationProgress;
          const rotationDiff = targetRotation - currentRotationRef.current;
          if (Math.abs(rotationDiff) > 0.001) {
            model.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotationDiff);
            currentRotationRef.current = targetRotation;
          }
        }
      },
    });

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      setupModel();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      // Cleanup Three.js resources comprehensively
      if (modelContainerRef.current && renderer.domElement) {
        modelContainerRef.current.removeChild(renderer.domElement);
      }

      // Cleanup scene and all objects
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach((material) => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
        sceneRef.current.clear();
      }

      // Cleanup renderer
      renderer.dispose();

      // Cleanup model reference
      if (modelRef.current) {
        modelRef.current = null;
      }

      // Cleanup size reference
      if (modelSizeRef.current) {
        modelSizeRef.current = null;
      }
    };
  }, [
    modelUrl,
    animationDuration,
    staggerDelay,
    pinHeight,
    modelSettings,
    tooltips,
  ]);

  return (
    <div className={cn("sofi-health-scroll", className)} ref={containerRef}>
      <div className="sofi-product-overview">
        <div className="sofi-model-container" ref={modelContainerRef} />

        <div className="sofi-header-1">
          <h1>{headerTexts.header1}</h1>
        </div>

        <div className="sofi-circular-mask">
          <div className="sofi-header-2">
            <h1>{headerTexts.header2}</h1>

            <div className="sofi-tooltips">
              {tooltips.map((tooltip, index) => (
                <div key={index} className="sofi-tooltip">
                  <div className="icon">
                    <i className={`icon-${tooltip.icon}`} />
                  </div>
                  <div className="divider"></div>
                  <div className="content">
                    <div className="title">
                      <h2>{tooltip.title}</h2>
                    </div>
                    <div className="description">
                      <p>{tooltip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
