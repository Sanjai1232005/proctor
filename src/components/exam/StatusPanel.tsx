'use client';

import { CheckCircle2, XCircle, Loader, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';

type Status = 'pending' | 'connected' | 'error';

interface StatusPanelProps {
  icon: LucideIcon;
  title: string;
  status: Status;
  description: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

export default function StatusPanel({ icon: Icon, title, status, description, action, children }: StatusPanelProps) {
  const statusConfig = {
    pending: { color: 'text-amber-600 dark:text-amber-400', icon: <Loader className="h-6 w-6 animate-spin" /> },
    connected: { color: 'text-green-600 dark:text-green-400', icon: <CheckCircle2 className="h-6 w-6" /> },
    error: { color: 'text-red-600 dark:text-red-400', icon: <XCircle className="h-6 w-6" /> },
  };

  const { color, icon } = statusConfig[status];

  return (
    <Card className={cn("text-left transition-colors duration-300", status === 'error' && 'border-destructive/50 bg-destructive/5', status === 'connected' && 'border-green-500/50 bg-green-500/5')}>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <div className={cn("p-2 rounded-lg transition-colors duration-300", color, status === 'error' && 'bg-destructive/10', status === 'connected' && 'bg-green-500/10', status === 'pending' && 'bg-amber-500/10')}>
            <Icon className="h-6 w-6" />
        </div>
        <CardTitle className='text-xl'>{title}</CardTitle>
        <div className={cn("ml-auto transition-opacity", color)}>{icon}</div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
        {children}
        {action}
      </CardContent>
    </Card>
  );
}
