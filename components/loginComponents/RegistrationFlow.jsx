'use client';

import { RegisterForm } from './RegisterForm';
import { useRouter, useSearchParams } from 'next/navigation';

export function RegistrationFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email');

  const handleSwitchToLogin = () => {
    router.push('/login');
  };

  const handleRegistrationSubmit = (formData) => {
    if (formData.step === 'password') {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <RegisterForm 
          initialEmail={emailFromUrl || ''}
          onRegistrationSubmit={handleRegistrationSubmit}
          onSwitchToLogin={handleSwitchToLogin}
        />
      </div>
    </div>
  );
}
