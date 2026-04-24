import { MetadataRoute } from "next";
import haikais from "../../data/haikais.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://treslinhas.com.br";

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
  ];
}
