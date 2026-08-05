'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { VerifyCode } from '../../../components/loginComponents/VerifyCode';

function VerifyCodeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';

  if (!email) {
    router.replace('/devenir-membre');
    return null;
  }

  return <VerifyCode email={email} />;
}

export default function VerifyCodePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <VerifyCodeContent />
    </Suspense>
  );
}
