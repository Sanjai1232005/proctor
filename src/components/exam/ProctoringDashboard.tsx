
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LogOut, Maximize, ShieldCheck, Minimize, CheckCircle2, Monitor, Smartphone, Mic, Video, Clock, AlertTriangle, FileText, ShieldAlert } from 'lucide-react';

import { useCamera } from '@/hooks/useCamera';
import { useFullscreen } from '@/hooks/useFullscreen';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { getTabSwitchWarning } from '@/lib/actions';
import { useMediaPermissions } from '@/hooks/useMediaPermissions';

import CameraFeed from './CameraFeed';
import QRCodeDisplay from './QRCodeDisplay';
import StatusPanel from './StatusPanel';
import VisibilityWarningDialog from './VisibilityWarningDialog';
import SampleExam from './SampleExam';
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

const EXAM_DURATION_SECONDS = 30 * 60; // 30 minutes

export default function ProctoringDashboard() {
  const router = useRouter();
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [isQrScanned, setIsQrScanned] = useState(false);
  const [visibilityWarning, setVisibilityWarning] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [agreedToGuidelines, setAgreedToGuidelines] = useState(false);
  const [violations, setViolations] = useState<string[]>([]);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const { stream: webcamStream, error: webcamError, retry: retryWebcam } = useCamera({video: true, audio: true});
  const { hasVideo, hasAudio, error: mediaPermissionError } = useMediaPermissions(webcamStream);
  
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen(fullscreenRef);

  useEffect(() => {
    if (isExamStarted && !isExamSubmitted && mediaPermissionError) {
      if (!permissionError) { // Prevent adding duplicate messages
        const newViolation = `Violation: ${mediaPermissionError}`;
        setPermissionError(newViolation);
        setViolations(prev => [...prev, newViolation]);
      }
    }
  }, [isExamStarted, isExamSubmitted, mediaPermissionError, permissionError]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isExamStarted && !isExamSubmitted) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsTimeUp(true);
            handleSubmitExam(); 
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isExamStarted, isExamSubmitted]);

  const handleVisibilityChange = useCallback(async () => {
    if (isExamStarted && !visibilityWarning && !isExamSubmitted) {
      const warning = await getTabSwitchWarning();
      setVisibilityWarning(warning);
      setViolations(prev => [...prev, "Violation: Navigated away from the exam tab."]);
      exitFullscreen();
    }
  }, [isExamStarted, exitFullscreen, visibilityWarning, isExamSubmitted]);

  usePageVisibility(handleVisibilityChange);

  const handleStartExam = () => {
    if (!webcamStream || !hasVideo || !hasAudio) {
        alert("Please grant webcam & microphone access to start the exam.");
        return;
    }
    if (!isQrScanned) {
        alert("Please scan the QR code with your mobile device and confirm before starting.");
        return;
    }
    if (!agreedToGuidelines) {
        alert("You must agree to the exam guidelines to start the exam.");
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (isExamSubmitted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-lg text-center shadow-lg">
            <CardContent className="p-8">
                <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-2">Exam Submitted</h2>
                <p className="text-muted-foreground text-lg mb-6">{isTimeUp ? "Your time is up. The exam has been automatically submitted." : "Thank you for completing the exam."}</p>
                 {violations.length > 0 && (
                  <div className="mb-6 text-left text-sm">
                    <p className="font-bold text-destructive">{violations.length} violation(s) were recorded:</p>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {violations.map((v, i) => <li key={i}>{v.replace('Violation: ', '')}</li>)}
                    </ul>
                  </div>
                )}
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
       <AlertDialog open={isTimeUp && !isExamSubmitted}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Time's Up!</AlertDialogTitle>
            <AlertDialogDescription>
              The exam time has expired. Your answers will be submitted automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSubmitExam}>Acknowledge</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

       <AlertDialog open={!!permissionError}>
        <AlertDialogContent>
          <AlertDialogHeader>
             <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            <AlertDialogTitle className="text-center text-2xl">Permission Issue Detected</AlertDialogTitle>
            <AlertDialogDescription className="text-center pt-2">
              {permissionError} This is a serious violation of exam rules. The exam will continue, but this event has been logged. Re-enable your devices immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setPermissionError(null)}>I Understand</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <header className="flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold text-primary">Guardian View</h1>
        </div>
        {isExamStarted && (
            <div className="flex items-center gap-6">
                 {violations.length > 0 && (
                    <div className="flex items-center gap-2 text-destructive">
                        <ShieldAlert className="h-5 w-5" />
                        <span className="font-semibold">{violations.length} {violations.length === 1 ? 'Violation' : 'Violations'}</span>
                    </div>
                )}
                <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                    <Clock className="h-6 w-6" />
                    <span>{formatTime(timeLeft)}</span>
                </div>
          </div>
        )}
        {!isExamStarted && (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
        )}
      </header>

      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
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
                            status={webcamError ? 'error' : hasVideo ? 'connected' : 'pending'}
                            description={webcamError ? webcamError : hasVideo ? "Webcam connected successfully." : "Waiting for permission..."}
                            action={webcamError ? <Button onClick={retryWebcam} className="mt-2">Retry</Button> : null}
                        />
                         <StatusPanel
                            title="Microphone"
                            icon={Mic}
                            status={webcamError ? 'error' : hasAudio ? 'connected' : 'pending'}
                            description={webcamError ? "Audio permission denied or device unavailable." : hasAudio ? "Audio monitoring is active." : "Waiting for permission..."}
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Mobile Camera Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-video w-full rounded-md overflow-hidden bg-secondary flex items-center justify-center">
                                {isQrScanned ? (
                                    <div className="text-center text-green-600 p-4">
                                        <div className='relative'>
                                            <Image src="https://picsum.photos/seed/desk/600/400" alt="Sample environment" width={600} height={400} className='rounded-md' data-ai-hint="desk room" />
                                            <div className='absolute inset-0 bg-green-500/20 flex items-center justify-center rounded-md'>
                                                <CheckCircle2 className="h-16 w-16 text-white" />
                                            </div>
                                        </div>
                                        <p className="font-semibold mt-2">Mobile Feed Connected</p>
                                        <p className="text-sm text-muted-foreground">The preview is not live. This confirms connection.</p>
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground p-4">
                                        <Smartphone className="mx-auto h-12 w-12 mb-2" />
                                        <p>Scan QR code to connect mobile camera</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-amber-500/50 bg-amber-500/5 text-left">
                  <CardHeader className="flex flex-row items-start gap-4">
                    <FileText className="h-6 w-6 text-amber-600 mt-1" />
                    <div>
                      <CardTitle className="text-xl text-amber-800">Exam Guidelines</CardTitle>
                      <CardDescription className="text-amber-700">Please read carefully before starting.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>Exam Duration:</strong> This exam is timed for {formatTime(EXAM_DURATION_SECONDS)}.</p>
                    <p><strong>Stay Focused:</strong> Do not switch tabs, minimize the browser, or navigate away from the exam page. Your session is monitored for this activity.</p>
                    <p><strong>Environment:</strong> Both your webcam and mobile camera must remain active and unobstructed for the entire duration of the exam.</p>
                    <p><strong>Integrity:</strong> No other people are allowed in the room. Talking or using unauthorized materials is strictly forbidden.</p>
                    <p><strong>Submission:</strong> The exam will be automatically submitted when the time runs out. You can also submit it manually once you have answered all questions.</p>
                    <div className="flex items-center space-x-2 pt-4">
                      <Checkbox id="terms" checked={agreedToGuidelines} onCheckedChange={(checked) => setAgreedToGuidelines(checked as boolean)} />
                      <Label htmlFor="terms" className="font-medium">I have read and agree to the exam guidelines.</Label>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={handleStartExam}
                  disabled={!hasVideo || !hasAudio || !isQrScanned || !agreedToGuidelines}
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
          <div className='h-[calc(100vh-8rem)] flex flex-col'>
            <div className='flex items-center justify-between mb-4'>
                 <h2 className="text-2xl font-bold">Exam in Progress</h2>
                 <div className='flex items-center gap-2'>
                    <span className='text-sm text-muted-foreground'>FS-Mode</span>
                    <Button onClick={isFullscreen ? exitFullscreen : requestFullscreen} variant="outline" size="icon" className="ml-auto">
                        {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                    </Button>
                 </div>
            </div>
            <ScrollArea className="flex-grow pr-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                      <SampleExam onSubmit={handleSubmitExam} />
                  </div>
                  <div className="space-y-6">
                      <CameraFeed stream={webcamStream} error={webcamError} label="Your Webcam (Front View)" />
                      <Card>
                          <CardHeader>
                              <CardTitle className="text-lg">Your Mobile (Room View)</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <div className="aspect-video w-full rounded-md overflow-hidden bg-secondary flex items-center justify-center">
                                  <div className="text-center text-green-600 p-4">
                                      <Video className="mx-auto h-12 w-12 mb-2" />
                                      <p className="font-semibold">Feed Active</p>
                                      <p className="text-sm text-muted-foreground">Keep mobile page open.</p>
                                  </div>
                              </div>
                          </CardContent>
                      </Card>
                  </div>
              </div>
            </ScrollArea>
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
