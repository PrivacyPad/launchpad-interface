import type { Metadata } from "next";
import Header from "./components/Header";
import "./globals.css";
import { generateMetadata } from "@/utils/seo";
import StatsBar from "./components/StatsBar";

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
        {/* <div>
          <Header />
          <StatsBar />
          <main className="max-w-320 mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
        </div> */}
        {children}
      </body>
    </html>
  );
}
