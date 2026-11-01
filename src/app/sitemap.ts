import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/features",
    "/pricing",
    "/about",
    "/contact",
    "/book-demo",
    "/privacy",
    "/terms",
  ];
  return paths.map((p) => ({
    url: `${siteUrl}${p}`,
    priority: p === "" ? 1 : p === "/features" || p === "/book-demo" ? 0.9 : 0.7,
  }));
}
