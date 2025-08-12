'use strict';

var fiber = require('@react-three/fiber');
var react = require('react');
var drei = require('@react-three/drei');
var utils = require('@tuel/utils');
var THREE = require('three');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var THREE__namespace = /*#__PURE__*/_interopNamespace(THREE);

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
function ClientOnly({ children, fallback = null }) {
  if (typeof window === "undefined") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, fallback);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children);
}
function R3FCanvas(_a) {
  var _b = _a, {
    children,
    fallback = /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center h-full bg-gray-100" }, /* @__PURE__ */ React.createElement("div", { className: "text-gray-500" }, "Loading 3D Scene..."))
  } = _b, canvasProps = __objRest(_b, [
    "children",
    "fallback"
  ]);
  return /* @__PURE__ */ React.createElement(ClientOnly, { fallback }, /* @__PURE__ */ React.createElement(fiber.Canvas, __spreadValues({}, canvasProps), /* @__PURE__ */ React.createElement(react.Suspense, { fallback: null }, children)));
}
function FloatingObject({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = "#8b5cf6",
  shape = "sphere",
  wireframe = false,
  metalness = 0.1,
  roughness = 0.1,
  distort = 0.3,
  speed = 2,
  floatIntensity = 1,
  rotationSpeed = 1
}) {
  const meshRef = react.useRef(null);
  const geometry = react.useMemo(() => {
    switch (shape) {
      case "box":
        return /* @__PURE__ */ React.createElement("boxGeometry", { args: [1, 1, 1] });
      case "torus":
        return /* @__PURE__ */ React.createElement("torusGeometry", { args: [0.6, 0.3, 16, 32] });
      case "cone":
        return /* @__PURE__ */ React.createElement("coneGeometry", { args: [0.6, 1, 32] });
      case "dodecahedron":
        return /* @__PURE__ */ React.createElement("dodecahedronGeometry", { args: [0.8] });
      case "octahedron":
        return /* @__PURE__ */ React.createElement("octahedronGeometry", { args: [0.8] });
      default:
        return /* @__PURE__ */ React.createElement("sphereGeometry", { args: [0.8, 32, 32] });
    }
  }, [shape]);
  fiber.useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 1e-3 * rotationSpeed;
    meshRef.current.rotation.y += 2e-3 * rotationSpeed;
  });
  return /* @__PURE__ */ React.createElement(
    drei.Float,
    {
      speed,
      rotationIntensity: rotationSpeed,
      floatIntensity
    },
    /* @__PURE__ */ React.createElement(
      "mesh",
      {
        ref: meshRef,
        position,
        rotation,
        scale,
        castShadow: true
      },
      geometry,
      distort > 0 ? /* @__PURE__ */ React.createElement(
        drei.MeshDistortMaterial,
        {
          color,
          wireframe,
          metalness,
          roughness,
          distort,
          speed
        }
      ) : /* @__PURE__ */ React.createElement(
        "meshStandardMaterial",
        {
          color,
          wireframe,
          metalness,
          roughness
        }
      )
    )
  );
}
function FloatingObjects({
  className,
  objects = [
    { position: [-2, 0, 0], color: "#8b5cf6", shape: "sphere" },
    { position: [0, 0, 0], color: "#3b82f6", shape: "box" },
    { position: [2, 0, 0], color: "#ec4899", shape: "torus" }
  ],
  backgroundColor = "#1a1a2e",
  fog = true,
  fogColor = "#1a1a2e",
  fogNear = 5,
  fogFar = 15,
  shadows = true,
  environment = "sunset",
  ambientIntensity = 0.5,
  cameraPosition = [0, 0, 5],
  autoRotate = true,
  autoRotateSpeed = 0.5,
  floatSpeed = 2
}) {
  return /* @__PURE__ */ React.createElement("div", { className: utils.cn("w-full h-full", className) }, /* @__PURE__ */ React.createElement(
    fiber.Canvas,
    {
      shadows,
      camera: { position: cameraPosition, fov: 75 },
      style: { background: backgroundColor }
    },
    fog && /* @__PURE__ */ React.createElement("fog", { attach: "fog", args: [fogColor, fogNear, fogFar] }),
    /* @__PURE__ */ React.createElement("ambientLight", { intensity: ambientIntensity }),
    /* @__PURE__ */ React.createElement("pointLight", { position: [10, 10, 10], intensity: 1, castShadow: true }),
    /* @__PURE__ */ React.createElement("pointLight", { position: [-10, -10, -10], intensity: 0.5 }),
    environment && /* @__PURE__ */ React.createElement(drei.Environment, { preset: environment }),
    objects.map((obj, index) => /* @__PURE__ */ React.createElement(
      FloatingObject,
      __spreadProps(__spreadValues({
        key: index
      }, obj), {
        speed: obj.speed || floatSpeed
      })
    )),
    shadows && /* @__PURE__ */ React.createElement(
      drei.ContactShadows,
      {
        position: [0, -2, 0],
        opacity: 0.4,
        scale: 10,
        blur: 2,
        far: 4
      }
    )
  ));
}
function OrbitSceneContent({
  children,
  cameraPosition = [0, 0, 5],
  cameraFov = 50,
  enableZoom = true,
  enablePan = true,
  enableRotate = true,
  autoRotate = false,
  autoRotateSpeed = 1,
  environment = "studio",
  onLoad,
  shadows = false
}) {
  const groupRef = react.useRef(null);
  return /* @__PURE__ */ React.createElement(R3FCanvas, { shadows, onCreated: onLoad }, /* @__PURE__ */ React.createElement(
    drei.PerspectiveCamera,
    {
      makeDefault: true,
      position: cameraPosition,
      fov: cameraFov
    }
  ), /* @__PURE__ */ React.createElement(
    drei.OrbitControls,
    {
      enableZoom,
      enablePan,
      enableRotate,
      autoRotate,
      autoRotateSpeed,
      makeDefault: true
    }
  ), /* @__PURE__ */ React.createElement(drei.Environment, { preset: environment }), /* @__PURE__ */ React.createElement("ambientLight", { intensity: 0.5 }), /* @__PURE__ */ React.createElement(
    "directionalLight",
    {
      position: [10, 10, 5],
      intensity: 1,
      castShadow: shadows,
      "shadow-mapSize-width": 2048,
      "shadow-mapSize-height": 2048
    }
  ), /* @__PURE__ */ React.createElement(react.Suspense, { fallback: null }, /* @__PURE__ */ React.createElement("group", { ref: groupRef }, children)), /* @__PURE__ */ React.createElement(drei.Preload, { all: true }));
}
function ThreeOrbitScene(_a) {
  var _b = _a, {
    className,
    fallback = /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center h-full bg-gray-100" }, /* @__PURE__ */ React.createElement("div", { className: "text-gray-500" }, "Loading 3D Scene..."))
  } = _b, props = __objRest(_b, [
    "className",
    "fallback"
  ]);
  return /* @__PURE__ */ React.createElement("div", { className: utils.cn("relative w-full h-full", className) }, /* @__PURE__ */ React.createElement(ClientOnly, { fallback }, /* @__PURE__ */ React.createElement(OrbitSceneContent, __spreadValues({}, props))));
}
function ExampleOrbitBox() {
  return /* @__PURE__ */ React.createElement("mesh", { rotation: [0, Math.PI / 4, 0] }, /* @__PURE__ */ React.createElement("boxGeometry", { args: [1, 1, 1] }), /* @__PURE__ */ React.createElement("meshStandardMaterial", { color: "#6366f1", metalness: 0.5, roughness: 0.2 }));
}
function MorphingMesh({
  position = [0, 0, 0],
  color = "#8b5cf6",
  morphTargets = ["sphere", "box", "torus", "cone"],
  morphSpeed = 0.5,
  wobbleSpeed = 1,
  wobbleFactor = 0.3,
  scale = 1,
  metalness = 0.3,
  roughness = 0.4,
  wireframe = false
}) {
  const meshRef = react.useRef(null);
  const [currentTarget, setCurrentTarget] = react.useState(0);
  const morphProgress = react.useRef(0);
  const geometries = react.useMemo(() => {
    const geos = [];
    morphTargets.forEach((target) => {
      let geo;
      switch (target) {
        case "box":
          geo = new THREE__namespace.BoxGeometry(1.5, 1.5, 1.5, 32, 32, 32);
          break;
        case "torus":
          geo = new THREE__namespace.TorusGeometry(1, 0.4, 32, 64);
          break;
        case "cone":
          geo = new THREE__namespace.ConeGeometry(1, 2, 32, 32);
          break;
        case "dodecahedron":
          geo = new THREE__namespace.DodecahedronGeometry(1.2, 2);
          break;
        case "octahedron":
          geo = new THREE__namespace.OctahedronGeometry(1.2, 2);
          break;
        case "tetrahedron":
          geo = new THREE__namespace.TetrahedronGeometry(1.5, 2);
          break;
        case "icosahedron":
          geo = new THREE__namespace.IcosahedronGeometry(1.2, 2);
          break;
        default:
          geo = new THREE__namespace.SphereGeometry(1, 64, 64);
      }
      geos.push(geo);
    });
    return geos;
  }, [morphTargets]);
  const geometry = react.useMemo(() => {
    if (geometries.length === 0) return null;
    const baseGeo = geometries[0].clone();
    const positionAttribute = baseGeo.getAttribute("position");
    const vertexCount = positionAttribute.count;
    const morphPositions = [];
    for (let i = 1; i < geometries.length; i++) {
      const targetGeo = geometries[i];
      const targetPos = targetGeo.getAttribute("position");
      if (targetPos.count !== vertexCount) {
        console.warn("Morph target vertex count mismatch");
        continue;
      }
      morphPositions.push(targetPos.clone());
    }
    baseGeo.morphAttributes.position = morphPositions;
    return baseGeo;
  }, [geometries]);
  fiber.useFrame((state) => {
    if (!meshRef.current || !geometry) return;
    morphProgress.current += morphSpeed * 0.01;
    if (morphProgress.current >= 1) {
      morphProgress.current = 0;
      setCurrentTarget((prev) => (prev + 1) % geometries.length);
    }
    const morphInfluences = meshRef.current.morphTargetInfluences;
    if (morphInfluences) {
      for (let i = 0; i < morphInfluences.length; i++) {
        morphInfluences[i] = 0;
      }
      if (currentTarget < morphInfluences.length) {
        morphInfluences[currentTarget] = morphProgress.current;
      }
    }
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
  });
  if (!geometry) return null;
  return /* @__PURE__ */ React.createElement(
    "mesh",
    {
      ref: meshRef,
      position,
      scale,
      geometry,
      morphTargetInfluences: new Array(geometries.length - 1).fill(0)
    },
    /* @__PURE__ */ React.createElement(
      drei.MeshWobbleMaterial,
      {
        color,
        speed: wobbleSpeed,
        factor: wobbleFactor,
        metalness,
        roughness,
        wireframe
      }
    )
  );
}
function MorphingShapes({
  className,
  shapes = [
    {
      position: [-3, 0, 0],
      color: "#8b5cf6",
      morphTargets: ["sphere", "box", "octahedron"]
    },
    {
      position: [0, 0, 0],
      color: "#3b82f6",
      morphTargets: ["box", "torus", "icosahedron"]
    },
    {
      position: [3, 0, 0],
      color: "#ec4899",
      morphTargets: ["cone", "dodecahedron", "sphere"]
    }
  ],
  backgroundColor = "#0a0a0a",
  fog = true,
  fogColor = "#0a0a0a",
  fogNear = 5,
  fogFar = 20,
  ambientLightIntensity = 0.5,
  pointLightIntensity = 1,
  pointLightPosition = [10, 10, 10],
  cameraPosition = [0, 0, 10],
  enableOrbitControls = true,
  autoRotate = true,
  autoRotateSpeed = 1
}) {
  return /* @__PURE__ */ React.createElement("div", { className: utils.cn("w-full h-full", className) }, /* @__PURE__ */ React.createElement(
    fiber.Canvas,
    {
      camera: { position: cameraPosition, fov: 75 },
      style: { background: backgroundColor }
    },
    fog && /* @__PURE__ */ React.createElement("fog", { attach: "fog", args: [fogColor, fogNear, fogFar] }),
    /* @__PURE__ */ React.createElement("ambientLight", { intensity: ambientLightIntensity }),
    /* @__PURE__ */ React.createElement(
      "pointLight",
      {
        position: pointLightPosition,
        intensity: pointLightIntensity
      }
    ),
    /* @__PURE__ */ React.createElement(
      "pointLight",
      {
        position: [
          -pointLightPosition[0],
          -pointLightPosition[1],
          -pointLightPosition[2]
        ],
        intensity: pointLightIntensity * 0.5,
        color: "#ff6b6b"
      }
    ),
    shapes.map((shape, index) => /* @__PURE__ */ React.createElement(MorphingMesh, __spreadValues({ key: index }, shape))),
    enableOrbitControls && /* @__PURE__ */ React.createElement(
      drei.OrbitControls,
      {
        enablePan: false,
        enableZoom: false,
        autoRotate,
        autoRotateSpeed
      }
    )
  ));
}

exports.ClientOnly = ClientOnly;
exports.ExampleOrbitBox = ExampleOrbitBox;
exports.FloatingObjects = FloatingObjects;
exports.MorphingShapes = MorphingShapes;
exports.R3FCanvas = R3FCanvas;
exports.ThreeOrbitScene = ThreeOrbitScene;
