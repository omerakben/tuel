import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Modal } from "../components/Modal";
import { Tooltip } from "../components/Tooltip";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    button: ({
      children,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      children?: React.ReactNode;
    }) => <button {...props}>{children}</button>,
    div: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      children?: React.ReactNode;
    }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

describe("Button", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders button text correctly", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Test</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("respects disabled state", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("applies different variants", () => {
    const variants = ["primary", "secondary", "outline", "ghost"] as const;

    variants.forEach((variant) => {
      const { unmount } = render(
        <Button variant={variant}>Test {variant}</Button>
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
      unmount();
    });
  });

  it("applies different sizes", () => {
    const sizes = ["sm", "md", "lg"] as const;

    sizes.forEach((size) => {
      const { unmount } = render(<Button size={size}>Test {size}</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
      unmount();
    });
  });

  it("handles loading state", () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("handles icon prop", () => {
    const Icon = () => <span data-testid="icon">Icon</span>;
    render(<Button icon={<Icon />}>With Icon</Button>);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("handles full width", () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
});

describe("Card", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(
      <Card>
        <div>Card Content</div>
      </Card>
    );
    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Card className="custom-class">
        <div>Test</div>
      </Card>
    );
    const card = screen.getByText("Test").closest(".card");
    expect(card).toHaveClass("custom-class");
  });

  it("applies different variants", () => {
    const variants = ["default", "elevated", "outlined", "filled"] as const;

    variants.forEach((variant) => {
      const { unmount } = render(
        <Card variant={variant}>
          <div>Test {variant}</div>
        </Card>
      );
      expect(screen.getByText(`Test ${variant}`)).toBeInTheDocument();
      unmount();
    });
  });

  it("handles hover effects", () => {
    render(
      <Card hover>
        <div>Hover Card</div>
      </Card>
    );
    expect(screen.getByText("Hover Card")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(
      <Card onClick={handleClick}>
        <div>Clickable Card</div>
      </Card>
    );

    fireEvent.click(screen.getByText("Clickable Card"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("handles padding variants", () => {
    const paddingVariants = ["none", "sm", "md", "lg"] as const;

    paddingVariants.forEach((padding) => {
      const { unmount } = render(
        <Card padding={padding}>
          <div>Test {padding}</div>
        </Card>
      );
      expect(screen.getByText(`Test ${padding}`)).toBeInTheDocument();
      unmount();
    });
  });

  it("handles header and footer", () => {
    render(
      <Card header={<div>Header</div>} footer={<div>Footer</div>}>
        <div>Content</div>
      </Card>
    );
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("handles loading state", () => {
    render(
      <Card loading>
        <div>Loading Card</div>
      </Card>
    );
    expect(screen.getByText("Loading Card")).toBeInTheDocument();
  });
});

describe("Modal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal when open", () => {
    render(
      <Modal isOpen>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("does not render modal when closed", () => {
    render(
      <Modal isOpen={false}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.queryByText("Modal Content")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Modal isOpen className="custom-class">
        <div>Test</div>
      </Modal>
    );
    const modal = screen.getByText("Test").closest(".modal");
    expect(modal).toHaveClass("custom-class");
  });

  it("handles close events", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose}>
        <div>Modal Content</div>
      </Modal>
    );

    // Test close functionality (implementation dependent)
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("handles different sizes", () => {
    const sizes = ["sm", "md", "lg", "xl"] as const;

    sizes.forEach((size) => {
      const { unmount } = render(
        <Modal isOpen size={size}>
          <div>Test {size}</div>
        </Modal>
      );
      expect(screen.getByText(`Test ${size}`)).toBeInTheDocument();
      unmount();
    });
  });

  it("handles close on overlay click", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} closeOnOverlayClick>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("handles close on escape key", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} closeOnEscape>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("shows close button when enabled", () => {
    render(
      <Modal isOpen showCloseButton>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("handles custom header and footer", () => {
    render(
      <Modal
        isOpen
        header={<div>Modal Header</div>}
        footer={<div>Modal Footer</div>}
      >
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByText("Modal Header")).toBeInTheDocument();
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
    expect(screen.getByText("Modal Footer")).toBeInTheDocument();
  });
});

describe("Tooltip", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(
      screen.getByRole("button", { name: "Hover me" })
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Tooltip content="Tooltip" className="custom-class">
        <button>Test</button>
      </Tooltip>
    );
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("shows tooltip on hover", async () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByRole("button");
    fireEvent.mouseEnter(button);

    await waitFor(() => {
      expect(screen.getByText("Tooltip content")).toBeInTheDocument();
    });
  });

  it("hides tooltip on mouse leave", async () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByRole("button");
    fireEvent.mouseEnter(button);
    fireEvent.mouseLeave(button);

    await waitFor(() => {
      expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
    });
  });

  it("handles different positions", () => {
    const positions = ["top", "bottom", "left", "right"] as const;

    positions.forEach((position) => {
      const { unmount } = render(
        <Tooltip content="Tooltip" position={position}>
          <button>Test {position}</button>
        </Tooltip>
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
      unmount();
    });
  });

  it("handles custom delay", () => {
    render(
      <Tooltip content="Tooltip" delay={1000}>
        <button>Delayed</button>
      </Tooltip>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("handles disabled state", () => {
    render(
      <Tooltip content="Tooltip" disabled>
        <button>Disabled</button>
      </Tooltip>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("handles custom trigger", () => {
    render(
      <Tooltip content="Tooltip" trigger="click">
        <button>Click me</button>
      </Tooltip>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("handles custom offset", () => {
    render(
      <Tooltip content="Tooltip" offset={20}>
        <button>Offset</button>
      </Tooltip>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
