'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LogOut, Maximize, ShieldCheck, Minimize, CheckCircle2, Monitor, Smartphone, Mic } from 'lucide-react';

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
    if (isExamStarted && !visibilityWarning && !isExamSubmitted) {
      const warning = await getTabSwitchWarning();
      setVisibilityWarning(warning);
      exitFullscreen();
    }
  }, [isExamStarted, exitFullscreen, visibilityWarning, isExamSubmitted]);

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

  if (isExamSubmitted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-lg text-center shadow-lg">
            <CardContent className="p-8">
                <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-2">Exam Submitted</h2>
                <p className="text-muted-foreground text-lg mb-6">Thank you for completing the exam.</p>
                <Button onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout and Exit
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div ref={fullscreenRef} className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold text-primary">Guardian View</h1>
        </div>
        {!isExamStarted && (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
        )}
      </header>

      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        {!isExamStarted ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Card className="w-full max-w-4xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">Exam Readiness Check</CardTitle>
                <CardDescription className="text-muted-foreground pt-2">
                  Please complete the following steps to begin your secure exam session.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div className="space-y-6">
                        <StatusPanel
                            title="Webcam"
                            icon={Monitor}
                            status={webcamError ? 'error' : webcamStream ? 'connected' : 'pending'}
                            description={webcamError ? webcamError : webcamStream ? "Webcam connected successfully." : "Waiting for permission..."}
                            action={webcamError ? <Button onClick={retryWebcam} className="mt-2">Retry</Button> : null}
                        />
                         <StatusPanel
                            title="Microphone"
                            icon={Mic}
                            status={'connected'}
                            description="Audio monitoring is active."
                        />
                    </div>
                     <StatusPanel
                        title="Room View (Mobile)"
                        icon={Smartphone}
                        status={isQrScanned ? 'connected' : 'pending'}
                        description={isQrScanned ? "Mobile camera connected. Position it to show your exam environment." : "Scan the QR code with your phone to set up the room view camera."}
                    >
                        <QRCodeDisplay isScanned={isQrScanned} onScanned={() => setIsQrScanned(true)} />
                    </StatusPanel>
                </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <CameraFeed stream={webcamStream} error={webcamError} label="Webcam Preview" />
                    <CameraFeed stream={null} error={isQrScanned ? null : "Scan QR code to connect"} label="Mobile Camera Preview" />
                </div>
                <Button
                  onClick={handleStartExam}
                  disabled={!webcamStream || !isQrScanned}
                  size="lg"
                  className="w-full max-w-xs mx-auto text-lg"
                >
                  <Maximize className="mr-2 h-5 w-5" />
                  Start Secure Exam
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>
            <div className='flex items-center justify-between mb-4'>
                 <h2 className="text-2xl font-bold text-center">Exam in Progress</h2>
                 <div className='flex items-center gap-2'>
                    <span className='text-sm text-muted-foreground'>FS-Mode</span>
                    <Button onClick={isFullscreen ? exitFullscreen : requestFullscreen} variant="outline" size="icon" className="ml-auto">
                        {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                    </Button>
                 </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SampleExam onSubmit={handleSubmitExam} />
                </div>
                <div className="space-y-6">
                    <CameraFeed stream={webcamStream} error={webcamError} label="Your Webcam (Front View)" />
                    <CameraFeed stream={null} error={null} label="Your Mobile (Room View)" />
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
