import type { Metadata } from "next";

export const SITE_URL = "https://code-together.ru";

export type PageMetadataInput = {
  path: string;
  title: string;
  description: string;
};

export function createPageMetadata({ path, title, description }: PageMetadataInput): Metadata {
  const canonical = new URL(path, SITE_URL).toString();
  const image = `${SITE_URL}/tutor.webp`;
  const imageAlt = "Руслан Гильметдинов, репетитор по информатике и Python";

  return {
  title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      siteName: "TutorPlace",
      title,
      description,
      url: canonical,
      images: [{ url: image, width: 1537, height: 1023, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
