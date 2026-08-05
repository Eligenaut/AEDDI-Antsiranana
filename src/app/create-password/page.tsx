'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function CreatePasswordRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      router.replace(`/creer-mot-de-passe?email=${encodeURIComponent(emailParam)}`);
    } else {
      router.replace('/devenir-membre');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirection...</p>
    </div>
  );
}

export default function CreatePasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <CreatePasswordRedirect />
    </Suspense>
  );
}