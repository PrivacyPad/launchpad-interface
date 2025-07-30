import { Metadata } from "next";

export type TSEO = {
  title: string;
  keywords?: string[];
  description: string;
  thumbnail: string;
};

const defaultSEO: TSEO = {
  title: "PrivacyPad - Privacy-Preserving Launchpad Protocol",
  description:
    "A decentralized launchpad protocol focused on financial privacy, powered by Fully Homomorphic Encryption (FHE).",
  thumbnail: "/thumbnail.png",
  keywords: ["Zama", "Launchpad", "Tokens", "Blockchain"],
};

export function generateMetadata({ title, description, thumbnail, keywords }: Partial<TSEO> = {}): Metadata {
  return {
    title: title ?? defaultSEO.title,
    description: description ?? defaultSEO.description,
    // metadataBase: new URL(""),
    keywords: keywords ?? defaultSEO.keywords,
    twitter: {
      title: title ?? defaultSEO.title,
      description: description ?? defaultSEO.description,
      images: [thumbnail ?? defaultSEO.thumbnail],
      site: "@privacypad",
    },
    openGraph: {
      title: title ?? defaultSEO.title,
      description: description ?? defaultSEO.description,
      images: [thumbnail ?? defaultSEO.thumbnail],
      siteName: "@privacypad",
    },
  };
}
