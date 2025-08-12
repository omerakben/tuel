import { cn } from "@tuel/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

export interface VideoItem {
  id: string;
  src: string;
  poster?: string;
  title?: string;
  description?: string;
  duration?: string;
  type?: "mp4" | "webm" | "ogg" | "youtube" | "vimeo";
  thumbnail?: string;
}

export interface VideoGalleryProps {
  videos: VideoItem[];
  className?: string;
  layout?: "grid" | "list" | "carousel";
  columns?: number;
  gap?: number;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: "none" | "metadata" | "auto";
  aspectRatio?: "16/9" | "4/3" | "1/1" | "auto";
  showThumbnails?: boolean;
  lightbox?: boolean;
  onVideoSelect?: (video: VideoItem, index: number) => void;
  onVideoPlay?: (video: VideoItem, index: number) => void;
  onVideoEnd?: (video: VideoItem, index: number) => void;
}

export function VideoGallery({
  videos,
  className,
  layout = "grid",
  columns = 3,
  gap = 16,
  autoPlay = false,
  controls = true,
  muted = true,
  loop = false,
  preload = "metadata",
  aspectRatio = "16/9",
  showThumbnails = true,
  lightbox = true,
  onVideoSelect,
  onVideoPlay,
  onVideoEnd,
}: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

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
      case "list":
        return {
          display: "flex",
          flexDirection: "column" as const,
          gap: `${gap}px`,
        };
      case "carousel":
        return {
          display: "flex",
          gap: `${gap}px`,
          overflowX: "auto" as const,
          scrollSnapType: "x mandatory" as const,
        };
      default:
        return {};
    }
  };

  // Aspect ratio class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "16/9":
        return "aspect-video";
      case "4/3":
        return "aspect-[4/3]";
      case "1/1":
        return "aspect-square";
      default:
        return "";
    }
  };

  // Video type detection
  const getVideoType = (video: VideoItem) => {
    if (video.type) return video.type;

    const url = video.src.toLowerCase();
    if (url.includes("youtube.com") || url.includes("youtu.be"))
      return "youtube";
    if (url.includes("vimeo.com")) return "vimeo";
    if (url.endsWith(".webm")) return "webm";
    if (url.endsWith(".ogg")) return "ogg";
    return "mp4";
  };

  // Extract video ID for embeds
  const getVideoId = (video: VideoItem) => {
    const type = getVideoType(video);
    const url = video.src;

    if (type === "youtube") {
      const match = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
      );
      return match ? match[1] : null;
    }

    if (type === "vimeo") {
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? match[1] : null;
    }

    return null;
  };

  // Video handlers
  const handleVideoClick = (video: VideoItem, index: number) => {
    if (lightbox) {
      setSelectedVideo(video);
    }
    onVideoSelect?.(video, index);
  };

  const handleVideoPlay = (video: VideoItem, index: number) => {
    setPlayingVideo(video.id);
    onVideoPlay?.(video, index);
  };

  const handleVideoEnd = (video: VideoItem, index: number) => {
    setPlayingVideo(null);
    onVideoEnd?.(video, index);
  };

  const handleVideoLoad = (videoId: string) => {
    setLoadedVideos((prev) => new Set(prev).add(videoId));
  };

  // Pause all videos except the current one
  const pauseOtherVideos = (currentVideoId: string) => {
    videoRefs.current.forEach((video, videoId) => {
      if (videoId !== currentVideoId && !video.paused) {
        video.pause();
      }
    });
  };

  // Render video element based on type
  const renderVideo = (video: VideoItem, index: number) => {
    const videoType = getVideoType(video);
    const videoId = getVideoId(video);

    if (videoType === "youtube" && videoId) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1${
            autoPlay ? "&autoplay=1" : ""
          }${muted ? "&mute=1" : ""}`}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={video.title || `Video ${index + 1}`}
        />
      );
    }

    if (videoType === "vimeo" && videoId) {
      return (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479${
            autoPlay ? "&autoplay=1" : ""
          }${muted ? "&muted=1" : ""}`}
          className="w-full h-full"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={video.title || `Video ${index + 1}`}
        />
      );
    }

    // Native video element
    return (
      <video
        ref={(el) => {
          if (el) videoRefs.current.set(video.id, el);
        }}
        className="w-full h-full object-cover"
        poster={video.poster || video.thumbnail}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        preload={preload}
        onPlay={() => {
          handleVideoPlay(video, index);
          pauseOtherVideos(video.id);
        }}
        onEnded={() => handleVideoEnd(video, index)}
        onLoadedMetadata={() => handleVideoLoad(video.id)}
      >
        <source src={video.src} type={`video/${videoType}`} />
        Your browser does not support the video tag.
      </video>
    );
  };

  return (
    <>
      <div className={cn("video-gallery", className)} style={getLayoutStyles()}>
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "video-item relative cursor-pointer group",
              "rounded-lg overflow-hidden bg-black",
              getAspectRatioClass(),
              layout === "carousel" && "flex-shrink-0 w-80"
            )}
            onClick={() => handleVideoClick(video, index)}
          >
            {/* Video Element */}
            <div className="w-full h-full">{renderVideo(video, index)}</div>

            {/* Play Overlay for Thumbnails */}
            {showThumbnails && !loadedVideos.has(video.id) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/30 transition-colors">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-black ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Video Info Overlay */}
            {(video.title || video.description || video.duration) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-white">
                  {video.title && (
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                      {video.title}
                    </h3>
                  )}
                  {video.description && (
                    <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                  {video.duration && (
                    <span className="text-xs bg-black/50 px-2 py-1 rounded">
                      {video.duration}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Playing Indicator */}
            {playingVideo === video.id && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                PLAYING
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightbox && (
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8"
              onClick={() => setSelectedVideo(null)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {renderVideo(
                  selectedVideo,
                  videos.findIndex((v) => v.id === selectedVideo.id)
                )}

                {/* Close Button */}
                <button
                  className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition-colors z-10"
                  onClick={() => setSelectedVideo(null)}
                >
                  ×
                </button>

                {/* Video Info */}
                {(selectedVideo.title || selectedVideo.description) && (
                  <div className="absolute bottom-4 left-4 text-white z-10">
                    {selectedVideo.title && (
                      <h3 className="text-xl font-bold mb-2">
                        {selectedVideo.title}
                      </h3>
                    )}
                    {selectedVideo.description && (
                      <p className="text-gray-300">
                        {selectedVideo.description}
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
