'use client';

import { useCamera } from '@/hooks/useCamera';
import { Camera, CameraOff, Video } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function MobileCameraView() {
  const { stream, error, retry } = useCamera({
    video: { facingMode: 'user' }, // default to front camera
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <main className="fixed inset-0 bg-gray-900 text-white flex flex-col items-center justify-center">
      {stream && !error ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="text-center p-8">
            <Video className="mx-auto h-16 w-16 mb-4 text-primary" />
            <h1 className="text-2xl font-bold mb-2 font-headline">Room View Setup</h1>
          {error ? (
            <>
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                    <CameraOff className="h-6 w-6 text-red-400" />
                    <p className="font-semibold text-red-300">Camera Error</p>
                </div>
                <p className="mt-2 text-sm text-red-200">{error}</p>
              </div>
              <button
                onClick={retry}
                className="mt-6 px-6 py-2 bg-primary rounded-lg font-semibold hover:bg-primary/80 transition-colors"
              >
                Try Again
              </button>
            </>
          ) : (
            <p className="text-gray-400">Requesting camera access...</p>
          )}
        </div>
      )}
       {stream && (
            <div className="absolute bottom-4 left-4 right-4 bg-black/50 p-3 rounded-lg text-center text-sm">
                <p>Point this camera to show your exam environment. Keep this page open.</p>
            </div>
        )}
    </main>
  );
}
