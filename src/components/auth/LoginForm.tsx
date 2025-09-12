'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() !== '' && password.trim() !== '') {
      try {
        localStorage.setItem('guardian-view-auth', 'true');
        router.push('/system-check');
      } catch (error) {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Could not save session. Please enable cookies/site data.",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Credentials",
        description: "Please enter a username and password.",
      });
    }
  };

  return (
    <form onSubmit={handleLogin} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="e.g., testuser"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="e.g., password123"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Enter Secure Exam
      </Button>
    </form>
  );
}
