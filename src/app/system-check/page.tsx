import AuthGuard from '@/components/auth/AuthGuard';
import SystemCheck from '@/components/exam/SystemCheck';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'System Check - Guardian View',
};

export default function SystemCheckPage() {
  return (
    <AuthGuard>
      <SystemCheck />
    </AuthGuard>
  );
}
