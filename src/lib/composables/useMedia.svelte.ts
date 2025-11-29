/**
 * Media Utilities Composable
 * Helper functions for handling media URLs (videos, images, YouTube)
 */

export function useMedia() {
  /**
   * Get YouTube embed URL from regular URL
   */
  function getYoutubeEmbedUrl(url: string): string {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }

  /**
   * Check if URL is a video file
   */
  function isVideo(url: string): boolean {
    return /\.(mp4|webm|ogg|gifv)(?:\?.*)?$/i.test(url);
  }

  /**
   * Convert URL to video URL (handle Imgur special cases)
   */
  function toVideoUrl(url: string): string {
    // Imgur gifv -> mp4
    if (/\.gifv$/i.test(url)) {
      return url.replace(/\.gifv$/i, ".mp4");
    }

    // Imgur page URL (e.g., https://imgur.com/abc123) -> direct mp4
    const imgurMatch = url.match(/^https?:\/\/imgur\.com\/([A-Za-z0-9]+)$/);
    if (imgurMatch) {
      return `https://i.imgur.com/${imgurMatch[1]}.mp4`;
    }

    return url;
  }

  return {
    getYoutubeEmbedUrl,
    isVideo,
    toVideoUrl,
  };
}
