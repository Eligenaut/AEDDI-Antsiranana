'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { LoginProvider } from '../../../components/loginComponents/LoginContexte';
import { RegisterPassword } from '../../../components/loginComponents/RegisterPassword';

function CreerMotDePasseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';

  useEffect(() => {
    if (!email) router.replace('/devenir-membre');
  }, [email, router]);

  if (!email) return null;

  const handlePasswordCreated = () => {
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <LoginProvider>
      <div className="flex flex-col-reverse lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden bg-white">
        <div className="w-full lg:w-1/2 bg-white p-0 md:p-4 lg:p-8 flex items-center justify-center flex-1 lg:overflow-hidden">
          <div className="w-full">
            <RegisterPassword
              email={email}
              onPasswordCreated={handlePasswordCreated}
            />
          </div>
        </div>
      </div>
    </LoginProvider>
  );
}

export default function CreerMotDePassePage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <CreerMotDePasseContent />
    </Suspense>
  );
}
