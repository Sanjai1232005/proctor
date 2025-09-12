import AuthGuard from '@/components/auth/AuthGuard';
import ProctoringDashboard from '@/components/exam/ProctoringDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Exam Session - Guardian View',
};

export default function ExamPage() {
  return (
    <AuthGuard>
      <ProctoringDashboard />
    </AuthGuard>
  );
}
