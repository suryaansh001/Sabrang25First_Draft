'use client';
import CountdownTimer from '../../../components/CountdownTimer';
import MobileScrollMenu from '../../../components/MobileScrollMenu';
import { useRouter } from 'next/navigation';

export default function RegistrationStartingSoonPage() {
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <div className="w-full h-full">
      <MobileScrollMenu onNavigate={handleNavigation} alwaysVisible={true} />
      <CountdownTimer />
    </div>
  );
}
