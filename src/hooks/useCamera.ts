'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

type UseCameraOptions = {
  video?: boolean | MediaTrackConstraints;
  audio?: boolean;
};

export function useCamera(options: UseCameraOptions = { video: true, audio: false }) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Memoize options to prevent re-renders from causing `getStream` to be recreated
  const memoizedOptions = useMemo(() => options, [JSON.stringify(options)]);

  const getStream = useCallback(async () => {
    setError(null);
    // Stop any existing stream before getting a new one
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(memoizedOptions);
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
  }, [memoizedOptions, stream]);

  useEffect(() => {
    getStream();

    return () => {
      // This cleanup function will run when the component unmounts
      // or when memoizedOptions changes, but we want to make sure
      // we are not leaving streams open.
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoizedOptions]); // Rerun effect if options change

  const retry = useCallback(() => {
    getStream();
  }, [getStream]);


  return { stream, error, retry };
}
