'use client';

import { useCamera } from '@/hooks/useCamera';
import { Camera, CameraOff, Video, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '../ui/button';

export default function MobileCameraView() {
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const { stream, error, retry } = useCamera({
    video: { facingMode },
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const toggleCamera = useCallback(() => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  }, []);

  return (
    <main className="fixed inset-0 bg-gray-900 text-white flex flex-col items-center justify-center">
      {stream && !error ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
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
              <Button
                onClick={retry}
                className="mt-6"
              >
                Try Again
              </Button>
            </>
          ) : (
            <p className="text-gray-400">Requesting camera access...</p>
          )}
        </div>
      )}
       {stream && (
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/50 p-3 rounded-lg text-center text-sm">
                <p className='flex-1'>Point this camera to show your exam environment.</p>
                 <Button onClick={toggleCamera} variant="outline" size="icon" className="bg-white/10 border-white/20 hover:bg-white/20">
                    <RefreshCw className="h-5 w-5" />
                    <span className="sr-only">Switch Camera</span>
                </Button>
            </div>
        )}
    </main>
  );
}
