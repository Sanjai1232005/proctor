
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
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
                <ShieldCheck className="h-10 w-10 text-primary" />
                <h1 className="font-headline text-4xl font-bold text-primary">
                    Guardian View
                </h1>
            </div>
          <p className="text-muted-foreground">
            Secure Proctoring for Your Exams
          </p>
        </div>
        {isClient ? <LoginForm /> : null}
      </div>
    </main>
  );
}
