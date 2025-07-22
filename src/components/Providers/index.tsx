"use client";

import { defaultChain, networks, projectId, wagmiAdapter } from "@/web3/config";
import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { WagmiProvider } from "wagmi";

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
  name: "PrivacyPad",
  description:
    "PrivacyPad is a privacy-focused launchpad enabling confidential participation in decentralized fundraising using Zama's FHE protocol",
  url: "https://launchpad-interface-eight.vercel.app/",
  icons: ["https://launchpad-interface-eight.vercel.app/icon.png"],
};

// Create the modal
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  // @ts-expect-error
  networks: networks,
  defaultNetwork: defaultChain,
  metadata: metadata,
  features: {
    analytics: false, // Optional - defaults to your Cloud configuration
    // socials: false,
    // email: false,
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "var(--primary)",
    "--w3m-border-radius-master": "1px",
  },
});

export default function Providers({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
