import { Canvas, CanvasProps } from "@react-three/fiber";
import { TuelErrorBoundary } from "@tuel/utils";
import { ReactNode, Suspense } from "react";

/**
 * Client-only wrapper for React Three Fiber Canvas to prevent SSR issues
 */
export interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  // Simple client-side check
  if (typeof window === "undefined") {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Safe R3F Canvas wrapper that handles SSR gracefully
 */
export interface R3FCanvasProps extends Omit<CanvasProps, "children"> {
  children: ReactNode;
  fallback?: ReactNode;
}

export function R3FCanvas({
  children,
  fallback = (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="text-gray-500">Loading 3D Scene...</div>
    </div>
  ),
  ...canvasProps
}: R3FCanvasProps) {
  return (
    <TuelErrorBoundary
      animationType="three-canvas"
      onError={(error, errorInfo, errorId) => {
        console.warn(`[TUEL] R3FCanvas error:`, error);
      }}
    >
      <ClientOnly fallback={fallback}>
        <Canvas {...canvasProps}>
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      </ClientOnly>
    </TuelErrorBoundary>
  );
}
