'use client';

import { LoginProvider } from './LoginContexte';
import { LoginForm } from './LoginForm';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();

  return (
    <LoginProvider>
      <div className="flex items-center justify-center bg-white w-full">
        <LoginForm onSwitchToRegister={() => router.push('/devenir-membre')} />
      </div>
    </LoginProvider>
  );
}
