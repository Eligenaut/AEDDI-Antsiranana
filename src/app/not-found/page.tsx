"use client";

import { useSearchParams, useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get('email') || '';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Compte introuvable</h1>
        <p className="mb-4">
          Le compte Google <span className="font-semibold">{email}</span> n'existe pas encore dans notre base de données.
        </p>
        <p className="mb-6">Vous pouvez devenir membre en créant un compte :</p>
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          onClick={() => router.push(`/devenir-membre?email=${encodeURIComponent(email)}`)}
        >
          Devenir membre
        </button>
      </div>
    </div>
  );
}

