'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, CheckCircle2, XCircle, Loader, Wifi, Webcam, Mic, Info, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { cn } from '@/lib/utils';
import StatusPanel from './StatusPanel';

export default function SystemCheck() {
  const router = useRouter();
  const [checks, setChecks] = useState({
    browser: 'pending' as 'pending' | 'success' | 'error',
    network: 'pending' as 'pending' | 'success' | 'error',
    camera: 'pending' as 'pending' | 'success' | 'error',
    mic: 'pending' as 'pending' | 'success' | 'error',
  });
  
  const { stream: cameraStream, error: cameraError, retry: retryCamera } = useCamera({ video: true, audio: true });

  useEffect(() => {
    // Browser Check
    setChecks(prev => ({...prev, browser: 'success' }));

    // Network Check (simple online/offline check)
    setChecks(prev => ({...prev, network: navigator.onLine ? 'success' : 'error' }));
    const handleOnline = () => setChecks(prev => ({...prev, network: 'success'}));
    const handleOffline = () => setChecks(prev => ({...prev, network: 'error'}));
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    }
  }, []);

  useEffect(() => {
    if (cameraError) {
        setChecks(prev => ({ ...prev, camera: 'error', mic: 'error' }));
    } else if (cameraStream) {
        setChecks(prev => ({ ...prev, camera: 'success' }));
        if (cameraStream.getAudioTracks().length > 0) {
            setChecks(prev => ({ ...prev, mic: 'success' }));
        } else {
            // This case might happen if user gives video but not audio permission
             setChecks(prev => ({ ...prev, mic: 'error' }));
        }
    }
  }, [cameraStream, cameraError]);

  const allChecksPassed = Object.values(checks).every(status => status === 'success');

  const getStatus = (check: 'browser' | 'network' | 'camera' | 'mic') => {
      if(checks[check] === 'success') return 'connected';
      if(checks[check] === 'error') return 'error';
      return 'pending';
  }

  const getDescription = (check: 'browser' | 'network' | 'camera' | 'mic') => {
      if (check === 'browser') {
          return checks.browser === 'success' ? 'Your browser is compatible.' : 'Checking browser...';
      }
      if (check === 'network') {
          return checks.network === 'success' ? 'Your internet connection is stable.' : 'You are offline. Please check your connection.';
      }
      if (check === 'camera') {
          return checks.camera === 'error' ? (cameraError || 'Camera permission is required.') : checks.camera === 'success' ? 'Camera is accessible.' : 'Requesting camera access...';
      }
      if (check === 'mic') {
          return checks.mic === 'error' ? 'Microphone permission is required.' : checks.mic === 'success' ? 'Microphone is accessible.' : 'Requesting microphone access...';
      }
      return '';
  }


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6">
            <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-primary">Guardian View</h1>
            </div>
             <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
                <Power className="mr-2 h-4 w-4" />
                Logout
            </Button>
        </header>
        <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <Card className="w-full max-w-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">System & Environment Check</CardTitle>
                <CardDescription className="text-muted-foreground pt-2 text-center">
                    We need to make sure your system is ready for the secure exam.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <StatusPanel
                        title="Browser"
                        icon={Info}
                        status={getStatus('browser')}
                        description={getDescription('browser')}
                    />
                    <StatusPanel
                        title="Internet"
                        icon={Wifi}
                        status={getStatus('network')}
                        description={getDescription('network')}
                    />
                    <StatusPanel
                        title="Webcam"
                        icon={Webcam}
                        status={getStatus('camera')}
                        description={getDescription('camera')}
                    />
                    <StatusPanel
                        title="Microphone"
                        icon={Mic}
                        status={getStatus('mic')}
                        description={getDescription('mic')}
                    />
                </div>
                {checks.camera === 'error' || checks.mic === 'error' ? (
                     <div className="text-center">
                        <p className='text-destructive text-sm mb-4'>One or more permissions were denied. You must grant access to your camera and microphone to proceed.</p>
                        <Button onClick={retryCamera}>Retry Permissions</Button>
                     </div>
                ) : null}
                <div className="text-center pt-4">
                    <Button
                        onClick={() => router.push('/exam')}
                        disabled={!allChecksPassed}
                        size="lg"
                        className="w-full max-w-xs mx-auto text-lg"
                        >
                        Proceed to Exam Setup
                    </Button>
                    {!allChecksPassed && <p className="text-sm text-muted-foreground mt-4">Please resolve all issues to proceed.</p>}
                </div>
              </CardContent>
            </Card>
        </main>
    </div>
  );
}
