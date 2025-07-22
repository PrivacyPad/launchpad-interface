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
            <Toaster duration={5000} position="top-right" richColors closeButton />
          </Providers>
        </div>
      </body>
    </html>
  );
}
