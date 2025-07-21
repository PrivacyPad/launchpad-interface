import { Metadata } from "next";

export type TSEO = {
  title: string;
  keywords?: string[];
  description: string;
  thumbnail: string;
};

const defaultSEO: TSEO = {
  title: "PrivacyPad - Confidential Token Launchpad",
  description:
    "PrivacyPad is a privacy-focused launchpad enabling confidential participation in decentralized fundraising using Zama's FHE protocol",
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
