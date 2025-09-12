'use client';

import { useState, useLayoutEffect, useCallback } from 'react';

export function useFullscreen(elementRef: React.RefObject<HTMLElement>) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(document.fullscreenElement !== null);
  }, []);

  useLayoutEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [handleFullscreenChange]);

  const requestFullscreen = useCallback(async () => {
    const element = elementRef.current;
    if (element && !isFullscreen) {
      try {
        await element.requestFullscreen();
      } catch (error) {
        console.error('Fullscreen request failed:', error);
      }
    }
  }, [elementRef, isFullscreen]);

  const exitFullscreen = useCallback(async () => {
    if (document.fullscreenElement && isFullscreen) {
      try {
        await document.exitFullscreen();
      } catch (error) {
        console.error('Exit fullscreen request failed:', error);
      }
    }
  }, [isFullscreen]);

  return { isFullscreen, requestFullscreen, exitFullscreen };
}
