import { MetadataRoute } from "next";
import haikais from "../../data/haikais.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://treslinhas.com.br";

  const haikaiEntries = haikais.map((h) => ({
    url: `${base}/arquivo`,
    lastModified: new Date(h.date),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/arquivo`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...haikaiEntries,
  ];
}
