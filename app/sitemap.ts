import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/offer", "/privacy", "/python", "/oge-informatika", "/ege-informatika", "/mcko-informatika"].map((path) => ({
    url: new URL(path, SITE_URL).toString(),
  }));
}
