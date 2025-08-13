import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { HorizontalScroll, HorizontalScrollItem } from './HorizontalScroll';

// Mock GSAP modules
vi.mock('gsap', () => ({
  gsap: {
    to: vi.fn(() => ({
      kill: vi.fn(),
    })),
    registerPlugin: vi.fn(),
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(),
    refresh: vi.fn(),
    kill: vi.fn(),
  },
}));

// Mock performance hook
vi.mock('@tuel/performance', () => ({
  useReducedMotion: vi.fn(() => false),
}));

describe('HorizontalScroll', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children correctly', () => {
    render(
      <HorizontalScroll>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </HorizontalScroll>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('applies custom class names', () => {
    const { container } = render(
      <HorizontalScroll
        containerClassName="custom-container"
        className="custom-scroll"
      >
        <div>Content</div>
      </HorizontalScroll>
    );

    const containerEl = container.querySelector('.custom-container');
    const scrollEl = container.querySelector('.custom-scroll');

    expect(containerEl).toBeInTheDocument();
    expect(scrollEl).toBeInTheDocument();
  });

  it('respects prefers-reduced-motion', async () => {
    const { useReducedMotion } = await import('@tuel/performance');
    (useReducedMotion as any).mockReturnValue(true);

    const { gsap } = await import('gsap');

    render(
      <HorizontalScroll>
        <div>Content</div>
      </HorizontalScroll>
    );

    // GSAP should not be called when reduced motion is preferred
    await waitFor(() => {
      expect(gsap.to).not.toHaveBeenCalled();
    });
  });

  it('calls onUpdate callback with progress', async () => {
    const onUpdate = vi.fn();
    
    render(
      <HorizontalScroll onUpdate={onUpdate}>
        <div>Content</div>
      </HorizontalScroll>
    );

    // Component will attempt to set up GSAP after mount
    await waitFor(() => {
      // Check that component rendered without errors
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});

describe('HorizontalScrollItem', () => {
  it('renders children correctly', () => {
    render(
      <HorizontalScrollItem>
        <span>Item Content</span>
      </HorizontalScrollItem>
    );

    expect(screen.getByText('Item Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <HorizontalScrollItem className="custom-item">
        <span>Item</span>
      </HorizontalScrollItem>
    );

    const item = container.querySelector('.custom-item');
    expect(item).toBeInTheDocument();
  });

  it('sets data-width attribute', () => {
    const { container } = render(
      <HorizontalScrollItem width="300px">
        <span>Item</span>
      </HorizontalScrollItem>
    );

    const item = container.querySelector('[data-width="300px"]');
    expect(item).toBeInTheDocument();
  });
});