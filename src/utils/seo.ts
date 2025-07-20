import { Metadata } from "next";

export type TSEO = {
  title: string;
  keywords?: string[];
  description: string;
  thumbnail: string;
};

const defaultSEO: TSEO = {
  title: "Zama Launchpad",
  description: "Create and launch your tokens with ease",
  thumbnail: "/thumbnail.jpeg",
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
      site: "@zamalaunchpad",
    },
    openGraph: {
      title: title ?? defaultSEO.title,
      description: description ?? defaultSEO.description,
      images: [thumbnail ?? defaultSEO.thumbnail],
      siteName: "@zamalaunchpad",
    },
  };
}
