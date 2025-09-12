
'use client';

import LoginForm from '@/components/auth/LoginForm';
import { ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
                <div className="flex justify-center items-center gap-3 mb-2">
                    <ShieldCheck className="h-10 w-10 text-primary" />
                    <h1 className="text-4xl font-bold text-primary">
                        Guardian View
                    </h1>
                </div>
                <p className="text-balance text-muted-foreground">
                    Secure Proctoring for Your Exams
                </p>
            </div>
            {isClient ? <LoginForm /> : null}
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="text-center text-gray-500 dark:text-gray-400">
                <p className="text-lg font-semibold">AI-Powered Proctoring</p>
                <p>Ensuring exam integrity with cutting-edge technology.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
