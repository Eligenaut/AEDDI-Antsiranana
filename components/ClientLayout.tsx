// components/ClientLayout.tsx
"use client";
import { useNetwork } from "./hooks/useNetwork";
import NoInternet from "./NoInternet";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const isConnected = useNetwork();

  if (!isConnected) {
    return <NoInternet onRetry={() => window.location.reload()} />;
  }

  return (
    <>
      {children}
    </>
  );
}