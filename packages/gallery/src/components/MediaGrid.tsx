import { cn } from "@tuel/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

export interface MediaItem {
  id: string;
  type: "image" | "video" | "audio";
  src: string;
  thumbnail?: string;
  poster?: string;
  title?: string;
  description?: string;
  duration?: string;
  size?: { width: number; height: number };
  alt?: string;
}

export interface MediaGridProps {
  media: MediaItem[];
  className?: string;
  layout?: "grid" | "masonry" | "justified" | "pinterest";
  columns?: number;
  gap?: number;
  aspectRatio?: "auto" | "square" | "4/3" | "16/9";
  lightbox?: boolean;
  autoPlay?: boolean;
  lazy?: boolean;
  showOverlay?: boolean;
  filterType?: "all" | "image" | "video" | "audio";
  sortBy?: "none" | "title" | "type" | "date";
  onMediaClick?: (item: MediaItem, index: number) => void;
  onFilterChange?: (filter: "all" | "image" | "video" | "audio") => void;
}

export function MediaGrid({
  media,
  className,
  layout = "grid",
  columns = 3,
  gap = 16,
  aspectRatio = "auto",
  lightbox = true,
  autoPlay = false,
  lazy = true,
  showOverlay = true,
  filterType = "all",
  sortBy = "none",
  onMediaClick,
  onFilterChange,
}: MediaGridProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [currentFilter, setCurrentFilter] = useState(filterType);
  const [loadedItems, setLoadedItems] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);

  // Filter and sort media
  const filteredMedia = media
    .filter((item) => currentFilter === "all" || item.type === currentFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "type":
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

  // Layout styles
  const getLayoutStyles = () => {
    switch (layout) {
      case "grid":
        return {
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${Math.floor(
            300 / columns
          )}px, 1fr))`,
          gap: `${gap}px`,
        };
      case "masonry":
        return {
          columnCount: columns,
          columnGap: `${gap}px`,
        };
      case "justified":
        return {
          display: "flex",
          flexWrap: "wrap" as const,
          gap: `${gap}px`,
        };
      case "pinterest":
        return {
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(250px, 1fr))`,
          gridAutoRows: "10px",
          gap: `${gap}px`,
        };
      default:
        return {};
    }
  };

  // Aspect ratio class
  const getAspectRatioClass = () => {
    if (aspectRatio === "auto") return "";
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "4/3":
        return "aspect-[4/3]";
      case "16/9":
        return "aspect-video";
      default:
        return "";
    }
  };

  // Media type icon
  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        );
      case "audio":
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
          </svg>
        );
    }
  };

  // Handle media click
  const handleMediaClick = (item: MediaItem, index: number) => {
    if (lightbox) {
      setSelectedMedia(item);
    }
    onMediaClick?.(item, index);
  };

  // Handle filter change
  const handleFilterChange = (filter: "all" | "image" | "video" | "audio") => {
    setCurrentFilter(filter);
    onFilterChange?.(filter);
  };

  // Handle item load
  const handleItemLoad = (itemId: string) => {
    setLoadedItems((prev) => new Set(prev).add(itemId));
  };

  // Render media item based on type
  const renderMediaItem = (item: MediaItem, index: number) => {
    switch (item.type) {
      case "video":
        return (
          <video
            className="w-full h-full object-cover"
            poster={item.poster || item.thumbnail}
            controls={!lightbox}
            autoPlay={autoPlay}
            muted
            loop
            preload="metadata"
            onLoadedMetadata={() => handleItemLoad(item.id)}
          >
            <source src={item.src} type="video/mp4" />
          </video>
        );
      case "audio":
        return (
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                {getMediaTypeIcon("audio")}
              </div>
              {item.title && (
                <h4 className="font-semibold mb-2">{item.title}</h4>
              )}
              {item.duration && (
                <p className="text-sm opacity-75">{item.duration}</p>
              )}
            </div>
            <audio
              className="absolute bottom-2 left-2 right-2 opacity-75"
              controls
              preload="metadata"
              onLoadedMetadata={() => handleItemLoad(item.id)}
            >
              <source src={item.src} type="audio/mpeg" />
            </audio>
          </div>
        );
      default: // image
        return (
          <img
            src={item.src}
            alt={item.alt || item.title || `Media item ${index + 1}`}
            className={cn(
              "w-full h-full object-cover transition-all duration-300",
              !loadedItems.has(item.id) && lazy && "opacity-0"
            )}
            loading={lazy ? "lazy" : "eager"}
            onLoad={() => handleItemLoad(item.id)}
          />
        );
    }
  };

  // Get unique media types for filter
  const mediaTypes = [...new Set(media.map((item) => item.type))];

  return (
    <>
      {/* Filter Controls */}
      {mediaTypes.length > 1 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => handleFilterChange("all")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              currentFilter === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            )}
          >
            All ({media.length})
          </button>
          {mediaTypes.map((type) => {
            const count = media.filter((item) => item.type === type).length;
            return (
              <button
                key={type}
                onClick={() => handleFilterChange(type)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
                  currentFilter === type
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                )}
              >
                {type} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Media Grid */}
      <div
        ref={gridRef}
        className={cn("media-grid", className)}
        style={getLayoutStyles()}
      >
        {filteredMedia.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "media-item relative cursor-pointer group",
              "rounded-lg overflow-hidden bg-gray-100",
              getAspectRatioClass(),
              layout === "masonry" && "break-inside-avoid mb-4"
            )}
            onClick={() => handleMediaClick(item, index)}
            style={
              layout === "pinterest" && item.size
                ? { gridRowEnd: `span ${Math.ceil(item.size.height / 10)}` }
                : undefined
            }
          >
            {/* Media Content */}
            <div className="w-full h-full">{renderMediaItem(item, index)}</div>

            {/* Media Type Badge */}
            <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
              <span className="w-3 h-3">{getMediaTypeIcon(item.type)}</span>
              {item.type.toUpperCase()}
            </div>

            {/* Duration Badge */}
            {item.duration && (
              <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                {item.duration}
              </div>
            )}

            {/* Overlay */}
            {showOverlay && (item.title || item.description) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div className="text-white">
                  {item.title && (
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                      {item.title}
                    </h3>
                  )}
                  {item.description && (
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                  {getMediaTypeIcon(item.type)}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <AnimatePresence>
          {selectedMedia && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8"
              onClick={() => setSelectedMedia(null)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative max-w-4xl max-h-full bg-black rounded-lg overflow-hidden"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                {/* Media Content */}
                <div className="w-full h-full">
                  {selectedMedia.type === "video" && (
                    <video
                      className="w-full h-full"
                      controls
                      autoPlay
                      poster={selectedMedia.poster}
                    >
                      <source src={selectedMedia.src} type="video/mp4" />
                    </video>
                  )}
                  {selectedMedia.type === "image" && (
                    <img
                      src={selectedMedia.src}
                      alt={
                        selectedMedia.alt || selectedMedia.title || "Media item"
                      }
                      className="w-full h-full object-contain"
                    />
                  )}
                  {selectedMedia.type === "audio" && (
                    <div className="p-8 text-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <div className="w-16 h-16 text-white">
                          {getMediaTypeIcon("audio")}
                        </div>
                      </div>
                      {selectedMedia.title && (
                        <h3 className="text-2xl font-bold text-white mb-4">
                          {selectedMedia.title}
                        </h3>
                      )}
                      <audio className="w-full" controls autoPlay>
                        <source src={selectedMedia.src} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <button
                  className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition-colors z-10"
                  onClick={() => setSelectedMedia(null)}
                >
                  ×
                </button>

                {/* Media Info */}
                {(selectedMedia.title || selectedMedia.description) &&
                  selectedMedia.type !== "audio" && (
                    <div className="absolute bottom-4 left-4 text-white z-10">
                      {selectedMedia.title && (
                        <h3 className="text-xl font-bold mb-2">
                          {selectedMedia.title}
                        </h3>
                      )}
                      {selectedMedia.description && (
                        <p className="text-gray-300">
                          {selectedMedia.description}
                        </p>
                      )}
                    </div>
                  )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
