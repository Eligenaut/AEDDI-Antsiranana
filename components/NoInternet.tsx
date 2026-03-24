// components/NoInternet.tsx
export default function NoInternet({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-6">
      <div className="text-8xl mb-6">📡</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Pas de connexion Internet
      </h2>
      <p className="text-gray-500 mb-8">
        Vérifie ta connexion et réessaie.
      </p>
      <button
        onClick={onRetry}
        className="bg-blue-500 text-white px-8 py-3 rounded-full text-lg font-medium active:scale-95 transition"
      >
        🔄 Réessayer
      </button>
    </div>
  );
}