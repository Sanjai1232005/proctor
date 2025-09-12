
'use client';

import { useState, useEffect, useCallback } from 'react';

export function useMediaPermissions(stream: MediaStream | null) {
  const [hasVideo, setHasVideo] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPermissions = useCallback(() => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();
      
      const isVideoActive = videoTracks.length > 0 && !videoTracks[0].muted;
      const isAudioActive = audioTracks.length > 0 && !audioTracks[0].muted;

      setHasVideo(isVideoActive);
      setHasAudio(isAudioActive);
      
      let errorMessage = '';
      if (!isVideoActive) {
          errorMessage += 'Webcam has been disconnected or disabled.';
      }
      if (!isAudioActive) {
          errorMessage += `${errorMessage ? ' ' : ''}Microphone has been disconnected or disabled.`;
      }
      setError(errorMessage || null);

    } else {
      setHasVideo(false);
      setHasAudio(false);
      setError(null);
    }
  }, [stream]);

  useEffect(() => {
    checkPermissions();

    const handleDeviceChange = () => {
      // Small delay to allow stream to update after device change
      setTimeout(checkPermissions, 100);
    };

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    
    if (stream) {
      stream.getTracks().forEach(track => {
        track.onended = checkPermissions;
        track.onmute = checkPermissions;
        track.onunmute = checkPermissions;
      });
    }

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
      if (stream) {
        stream.getTracks().forEach(track => {
          track.onended = null;
          track.onmute = null;
          track.onunmute = null;
        });
      }
    };
  }, [stream, checkPermissions]);

  return { hasVideo, hasAudio, error };
}
