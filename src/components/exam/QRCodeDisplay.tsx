'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { CheckCircle, QrCode } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';

interface QRCodeDisplayProps {
  isScanned: boolean;
  onScanned: () => void;
}

export default function QRCodeDisplay({ isScanned, onScanned }: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    // This check is to prevent generating a new QR code URL on every render.
    if (!qrCodeUrl) {
        const mobileUrlPath = process.env.NEXT_PUBLIC_PHONE_CAMERA_URL || '/mobile-stream';
        const fullUrl = window.location.origin + mobileUrlPath;
        const encodedUrl = encodeURIComponent(fullUrl);
        setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodedUrl}`);
    }
  }, [qrCodeUrl]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {isScanned ? <CheckCircle className="text-green-500 h-5 w-5" /> : <QrCode className="h-5 w-5" />}
          Room View Camera
        </CardTitle>
        <CardDescription>
            {isScanned ? "Your mobile device is connected." : "Scan with your phone to set up."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center p-4 pt-0">
        {isScanned ? (
          <div className="flex flex-col items-center justify-center h-full aspect-square w-48">
            <CheckCircle className="h-20 w-20 text-green-500 mb-4" />
            <h3 className="font-semibold">Connected</h3>
          </div>
        ) : (
          <>
            <div className="w-48 h-48 relative flex items-center justify-center rounded-lg overflow-hidden bg-white p-2">
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
                <Skeleton className="w-full h-full" />
              )}
            </div>
             <Button onClick={onScanned} variant="outline" size="sm" className="mt-4">
                I have scanned the code
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
