import { useQuery } from "@tanstack/react-query";

let sdkInitialized = false;

export default function useZamaRelayerInstance() {
  const { data } = useQuery({
    queryKey: ["zamaRelayerInstance"],
    queryFn: async () => {
      if (!window.relayerSDK) {
        throw new Error("Relayer SDK not loaded on window object");
      }

      const { initSDK, createInstance, SepoliaConfig } = window.relayerSDK;

      // Initialize the SDK first to load WASM modules
      if (!sdkInitialized) {
        await initSDK();
      }
      console.debug("🚀 ~ SDK initialized successfully");
      sdkInitialized = true;

      // Now create the instance
      const instance = await createInstance(SepoliaConfig);
      return instance;
    },
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry(failureCount) {
      if (!window.relayerSDK && failureCount < 10) {
        console.error("Relayer SDK not found on window object.");
        return true; // Do not retry if relayerSDK is not available
      }
      return false;
    },
    retryDelay: 1_000,
    staleTime: 60 * 60_000,
  });

  return data;
}
