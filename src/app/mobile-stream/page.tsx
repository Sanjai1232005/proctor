import MobileCameraView from '@/components/exam/MobileCameraView';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Room View Camera - Guardian View',
};

export default function MobileStreamPage() {
  return <MobileCameraView />;
}
