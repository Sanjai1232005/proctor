'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { CheckCircle, QrCode } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface QRCodeDisplayProps {
  isScanned: boolean;
}

export default function QRCodeDisplay({ isScanned }: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    const mobileUrlPath = process.env.NEXT_PUBLIC_PHONE_CAMERA_URL || '/mobile-stream';
    const fullUrl = window.location.origin + mobileUrlPath;
    const encodedUrl = encodeURIComponent(fullUrl);
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodedUrl}`);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Room View Camera Setup</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center">
        {isScanned ? (
          <div className="flex flex-col items-center justify-center h-full aspect-video">
            <CheckCircle className="h-24 w-24 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold">Room View Connected</h3>
            <p className="text-muted-foreground">Your mobile device is ready.</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-muted-foreground">
              Scan this QR code with your mobile phone to set up the room view camera.
            </p>
            <div className="w-48 h-48 relative flex items-center justify-center rounded-lg overflow-hidden">
              {qrCodeUrl ? (
                <Image
                  src={qrCodeUrl}
                  alt="QR Code for mobile camera stream"
                  width={192}
                  height={192}
                  className="object-contain"
                  priority
                />
              ) : (
                <Skeleton className="w-48 h-48" />
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
