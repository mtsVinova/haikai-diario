import { MetadataRoute } from "next";
import haikais from "../../data/haikais.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://treslinhas.com.br";

  const haikaiPages = haikais
    .filter((h: any) => h.number)
    .map((h: any) => ({
      url: `${base}/haikai/${h.number}`,
      lastModified: new Date(h.date),
      changeFrequency: "never" as const,
      priority: 0.6,
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
      lastModified: haikais[0] ? new Date(haikais[0].date) : new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${base}/sobre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...haikaiPages,
  ];
}
