// hooks/useNetwork.ts
import { useEffect, useState } from "react";

export function useNetwork() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    let listener: any;

    const init = async () => {
      const { Network } = await import("@capacitor/network");

      const status = await Network.getStatus();
      setIsConnected(status.connected);

      listener = await Network.addListener("networkStatusChange", (status) => {
        setIsConnected(status.connected);
      });
    };

    init();

    return () => {
      listener?.remove();
    };
  }, []);

  return isConnected;
}