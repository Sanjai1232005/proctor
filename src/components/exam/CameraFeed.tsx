'use client';

import { useEffect, useRef, forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CameraOff } from 'lucide-react';

interface CameraFeedProps {
  stream: MediaStream | null;
  error: string | null;
  label: string;
}

const CameraFeed = forwardRef<HTMLVideoElement, CameraFeedProps>(({ stream, error, label }, ref) => {
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  
  // Use the forwarded ref if it exists, otherwise use the internal ref
  const videoRef = ref || internalVideoRef;

  useEffect(() => {
    if (videoRef && 'current' in videoRef && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full rounded-md overflow-hidden bg-secondary flex items-center justify-center">
          {error ? (
            <div className="text-center text-destructive p-4">
              <CameraOff className="mx-auto h-12 w-12 mb-2" />
              <p className="font-semibold">Camera Error</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform scale-x-[-1] ${stream ? 'block' : 'hidden'}`}
            />
          )}
           {!stream && !error && (
             <div className="text-center text-muted-foreground">
                <CameraOff className="mx-auto h-12 w-12 mb-2" />
                <p>No camera feed</p>
             </div>
           )}
        </div>
      </CardContent>
    </Card>
  );
});

CameraFeed.displayName = 'CameraFeed';

export default CameraFeed;
