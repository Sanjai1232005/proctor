'use client';

import { useState, useEffect, useCallback } from 'react';

type UseCameraOptions = {
  video?: boolean | MediaTrackConstraints;
  audio?: boolean;
};

export function useCamera(options: UseCameraOptions = { video: true, audio: false }) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getStream = useCallback(async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(options);
      setStream(mediaStream);
    } catch (err) {
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          setError('Camera permission was denied. Please grant permission to continue.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera was found. Please ensure a camera is connected and available.');
        } else {
          setError(`An error occurred while accessing the camera: ${err.message}`);
        }
      } else {
        setError('An unknown error occurred while accessing the camera.');
        console.error(err);
      }
    }
  }, [options]);

  useEffect(() => {
    getStream();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return { stream, error, retry: getStream };
}
