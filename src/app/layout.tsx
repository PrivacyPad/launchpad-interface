import type { Metadata } from "next";
import Header from "./components/Header";
import "./globals.css";
import { generateMetadata } from "@/utils/seo";
import StatsBar from "./components/StatsBar";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  ...generateMetadata(),
  title: {
    default: "PrivacyPad - Confidential Token Launchpad",
    template: "%s | PrivacyPad",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <div>
          <Providers>
            <Header />
            <StatsBar />
            <main className="max-w-320 mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
            <Toaster
              duration={8000}
              position="top-right"
              richColors
              closeButton
              expand
              visibleToasts={3}
              toastOptions={{
                actionButtonStyle: {
                  backgroundColor: "#4A90E2",
                  color: "#FFFFFF",
                  borderRadius: "4px",
                  padding: "0.25rem 0.5rem",
                },
                style: {
                  pointerEvents: "auto",
                },
              }}
            />
          </Providers>
        </div>
      </body>
    </html>
  );
}
