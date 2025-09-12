'use client';

import { CheckCircle2, XCircle, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'pending' | 'connected' | 'error';

interface StatusItemProps {
  icon: React.ElementType;
  label: string;
  status: Status;
}

const StatusItem = ({ icon: Icon, label, status }: StatusItemProps) => {
  const statusConfig = {
    pending: { color: 'text-muted-foreground', icon: <Icon className="h-5 w-5" /> },
    connected: { color: 'text-green-600', icon: <CheckCircle2 className="h-5 w-5" /> },
    scanned: { color: 'text-green-600', icon: <CheckCircle2 className="h-5 w-5" /> }, // This is not used anymore
    error: { color: 'text-destructive', icon: <XCircle className="h-5 w-5" /> },
  };

  const { color, icon } = statusConfig[status];

  return (
    <div className={cn('flex items-center gap-3 p-3 rounded-lg bg-secondary/50', color)}>
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );
};

interface StatusPanelProps {
  webcamStatus: Status;
  webcamError: string | null;
}

export default function StatusPanel({ webcamStatus, webcamError }: StatusPanelProps) {
  return (
    <div className="space-y-3">
      <StatusItem icon={Camera} label="Webcam" status={webcamStatus} />
      {webcamStatus === 'error' && webcamError && (
        <p className="text-sm text-destructive pl-11 -mt-2">{webcamError}</p>
      )}
    </div>
  );
}
