import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FloatingObjects } from "../components/FloatingObjects";
import { ParticleField } from "../components/ParticleField";
import { MorphingShapes } from "../components/MorphingShapes";
import { ThreeOrbitScene } from "../components/ThreeOrbitScene";

// Mock @react-three/fiber
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children, ...props }: any) => (
    <div data-testid="canvas" {...props}>
      {children}
    </div>
  ),
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    camera: { position: { set: vi.fn() } },
    scene: { add: vi.fn(), remove: vi.fn() },
    renderer: { setSize: vi.fn() },
  })),
}));

// Mock @react-three/drei
vi.mock("@react-three/drei", () => ({
  ContactShadows: ({ ...props }: any) => (
    <div data-testid="contact-shadows" {...props} />
  ),
  Environment: ({ ...props }: any) => (
    <div data-testid="environment" {...props} />
  ),
  Float: ({ children, ...props }: any) => (
    <div data-testid="float" {...props}>
      {children}
    </div>
  ),
  MeshDistortMaterial: ({ ...props }: any) => (
    <div data-testid="mesh-distort-material" {...props} />
  ),
  OrbitControls: ({ ...props }: any) => (
    <div data-testid="orbit-controls" {...props} />
  ),
  PerspectiveCamera: ({ ...props }: any) => (
    <div data-testid="perspective-camera" {...props} />
  ),
  Preload: ({ ...props }: any) => <div data-testid="preload" {...props} />,
}));

// Mock Three.js
vi.mock("three", () => ({
  Scene: vi.fn(),
  PerspectiveCamera: vi.fn(),
  WebGLRenderer: vi.fn(() => ({
    setSize: vi.fn(),
    setClearColor: vi.fn(),
    setPixelRatio: vi.fn(),
    domElement: document.createElement("canvas"),
  })),
  AmbientLight: vi.fn(),
  DirectionalLight: vi.fn(),
  PointLight: vi.fn(),
  BoxGeometry: vi.fn(),
  SphereGeometry: vi.fn(),
  TorusGeometry: vi.fn(),
  ConeGeometry: vi.fn(),
  DodecahedronGeometry: vi.fn(),
  OctahedronGeometry: vi.fn(),
  MeshStandardMaterial: vi.fn(),
  Mesh: vi.fn(),
}));

describe("FloatingObjects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders floating objects correctly", () => {
    render(<FloatingObjects />);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<FloatingObjects className="custom-class" />);
    const container = screen.getByTestId("canvas").closest(".w-full");
    expect(container).toHaveClass("custom-class");
  });

  it("renders custom objects", () => {
    const customObjects = [
      { position: [1, 0, 0], color: "#ff0000", shape: "sphere" },
      { position: [-1, 0, 0], color: "#00ff00", shape: "box" },
    ];

    render(<FloatingObjects objects={customObjects} />);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("applies custom background color", () => {
    render(<FloatingObjects backgroundColor="#123456" />);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("handles fog settings", () => {
    render(<FloatingObjects fog fogColor="#654321" fogNear={1} fogFar={10} />);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("applies shadow settings", () => {
    render(<FloatingObjects shadows />);
    expect(screen.getByTestId("contact-shadows")).toBeInTheDocument();
  });

  it("sets custom environment", () => {
    render(<FloatingObjects environment="sunset" />);
    expect(screen.getByTestId("environment")).toBeInTheDocument();
  });

  it("applies custom camera position", () => {
    render(<FloatingObjects cameraPosition={[0, 0, 10]} />);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("handles auto rotation", () => {
    render(<FloatingObjects autoRotate autoRotateSpeed={2} />);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });
});

describe("ParticleField", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders particle field correctly", () => {
    render(<ParticleField />);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<ParticleField className="custom-class" />);
    const container = screen.getByTestId("canvas").closest(".w-full");
    expect(container).toHaveClass("custom-class");
  });

  it("handles custom particle count", () => {
    render(<ParticleField count={500} />);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("applies custom particle size", () => {
    render(<ParticleField size={0.1} />);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("sets custom particle color", () => {
    render(<ParticleField color="#ff00ff" />);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("handles custom velocity", () => {
    render(<ParticleField velocity={2} />);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("applies custom background color", () => {
    render(<ParticleField backgroundColor="#000000" />);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("handles fog settings", () => {
    render(<ParticleField fog fogColor="#333333" fogNear={5} fogFar={20} />);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });
});

describe("MorphingShapes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders morphing shapes correctly", () => {
    render(<MorphingShapes />);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<MorphingShapes className="custom-class" />);
    const container = screen.getByTestId("canvas").closest(".w-full");
    expect(container).toHaveClass("custom-class");
  });

  it("handles custom shapes array", () => {
    const customShapes = ["sphere", "box", "torus"];
    render(<MorphingShapes shapes={customShapes} />);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("applies custom morph speed", () => {
    render(<MorphingShapes morphSpeed={2} />);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("handles wobble settings", () => {
    render(<MorphingShapes wobbleSpeed={1.5} wobbleFactor={0.5} />);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("applies custom scale", () => {
    render(<MorphingShapes scale={2} />);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("sets custom color", () => {
    render(<MorphingShapes color="#00ff00" />);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("handles material properties", () => {
    render(<MorphingShapes metalness={0.8} roughness={0.2} wireframe />);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });
});

describe("ThreeOrbitScene", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders orbit scene correctly", () => {
    render(<ThreeOrbitScene>Test Content</ThreeOrbitScene>);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<ThreeOrbitScene className="custom-class">Test</ThreeOrbitScene>);
    const container = screen.getByTestId("canvas").closest(".w-full");
    expect(container).toHaveClass("custom-class");
  });

  it("renders children content", () => {
    render(<ThreeOrbitScene>Custom Content</ThreeOrbitScene>);
    expect(screen.getByText("Custom Content")).toBeInTheDocument();
  });

  it("applies custom camera settings", () => {
    render(
      <ThreeOrbitScene cameraPosition={[0, 0, 10]} cameraFov={60}>
        Test
      </ThreeOrbitScene>
    );
    expect(screen.getByTestId("perspective-camera")).toBeInTheDocument();
  });

  it("handles orbit controls settings", () => {
    render(
      <ThreeOrbitScene
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      >
        Test
      </ThreeOrbitScene>
    );
    expect(screen.getByTestId("orbit-controls")).toBeInTheDocument();
  });

  it("handles auto rotation", () => {
    render(
      <ThreeOrbitScene autoRotate autoRotateSpeed={2}>
        Test
      </ThreeOrbitScene>
    );
    expect(screen.getByTestId("orbit-controls")).toBeInTheDocument();
  });

  it("sets custom environment", () => {
    render(<ThreeOrbitScene environment="studio">Test</ThreeOrbitScene>);
    expect(screen.getByTestId("environment")).toBeInTheDocument();
  });

  it("handles shadows", () => {
    render(<ThreeOrbitScene shadows>Test</ThreeOrbitScene>);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("shows custom fallback", () => {
    const customFallback = <div>Custom Loading...</div>;
    render(<ThreeOrbitScene fallback={customFallback}>Test</ThreeOrbitScene>);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("calls onLoad callback", () => {
    const onLoad = vi.fn();
    render(<ThreeOrbitScene onLoad={onLoad}>Test</ThreeOrbitScene>);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });
});
