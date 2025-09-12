'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Maximize, ShieldCheck, Minimize } from 'lucide-react';

import { useCamera } from '@/hooks/useCamera';
import { useFullscreen } from '@/hooks/useFullscreen';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { getTabSwitchWarning } from '@/lib/actions';

import CameraFeed from './CameraFeed';
import QRCodeDisplay from './QRCodeDisplay';
import StatusPanel from './StatusPanel';
import VisibilityWarningDialog from './VisibilityWarningDialog';
import SampleExam from './SampleExam';

export default function ProctoringDashboard() {
  const router = useRouter();
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [isQrScanned, setIsQrScanned] = useState(false);
  const [visibilityWarning, setVisibilityWarning] = useState<string | null>(null);

  const { stream: webcamStream, error: webcamError, retry: retryWebcam } = useCamera();
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen(fullscreenRef);

  const handleVisibilityChange = useCallback(async () => {
    if (isExamStarted && !visibilityWarning) {
      const warning = await getTabSwitchWarning();
      setVisibilityWarning(warning);
      exitFullscreen();
    }
  }, [isExamStarted, exitFullscreen, visibilityWarning]);

  usePageVisibility(handleVisibilityChange);

  const handleStartExam = () => {
    if (!webcamStream) {
        alert("Please grant webcam access to start the exam.");
        return;
    }
    if (!isQrScanned) {
        alert("Please scan the QR code with your mobile device and confirm before starting.");
        return;
    }
    setIsExamStarted(true);
    requestFullscreen();
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('guardian-view-auth');
    } finally {
      router.push('/login');
    }
  };

  const handleSubmitExam = () => {
    setIsExamSubmitted(true);
    exitFullscreen();
  }

  return (
    <div ref={fullscreenRef} className="min-h-screen bg-background text-foreground flex flex-col p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-3xl font-bold text-primary">Guardian View</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </header>

      <main className="flex-grow">
        {!isExamStarted ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Exam Readiness Check</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Please complete the following steps to begin your secure exam session.
                </p>
                <StatusPanel
                  webcamStatus={webcamError ? 'error' : webcamStream ? 'connected' : 'pending'}
                  qrStatus={isQrScanned ? 'scanned' : 'pending'}
                  webcamError={webcamError}
                />
                 {!webcamError && !webcamStream && <p className="text-sm text-muted-foreground">Waiting for camera permission...</p>}
                 {webcamError && <Button onClick={retryWebcam}>Retry Camera</Button>}

                 {!isQrScanned && <Button onClick={() => setIsQrScanned(true)} variant="outline">I have scanned the QR code</Button>}

                <Button
                  onClick={handleStartExam}
                  disabled={!webcamStream || !isQrScanned}
                  size="lg"
                  className="w-full"
                >
                  <Maximize className="mr-2 h-5 w-5" />
                  Start Secure Exam
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>
            <div className='flex items-center justify-center mb-4'>
                 <h2 className="text-2xl font-headline text-center">Exam in Progress</h2>
                 <Button onClick={isFullscreen ? exitFullscreen : requestFullscreen} variant="ghost" size="icon" className="ml-4">
                    {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                 </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SampleExam onSubmit={handleSubmitExam} isSubmitted={isExamSubmitted} />
                </div>
                <div className="space-y-6">
                    <CameraFeed stream={webcamStream} error={webcamError} label="Your Webcam (Front View)" />
                    <QRCodeDisplay isScanned={isQrScanned} />
                </div>
            </div>
          </div>
        )}
      </main>

      <VisibilityWarningDialog
        isOpen={!!visibilityWarning}
        warningMessage={visibilityWarning || ''}
        onClose={() => {
            setVisibilityWarning(null);
            requestFullscreen();
        }}
      />
    </div>
  );
}
