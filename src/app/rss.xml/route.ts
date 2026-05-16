import { NextResponse } from "next/server";
import haikais from "../../../data/haikais.json";

export async function GET() {
  const base = "https://treslinhas.com.br";

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day).toUTCString();
  };

  const items = haikais
    .slice(0, 30)
    .map((h: any) => {
      const lines = h.pt.split("\n").join("<br/>");
      return `
    <item>
      <title>${h.number ? `#${h.number}` : h.date} — três linhas</title>
      <link>${base}</link>
      <guid isPermaLink="false">${h.id || h.date}</guid>
      <pubDate>${formatDate(h.date)}</pubDate>
      <description><![CDATA[
        <p><em>${lines}</em></p>
        <p><small>${h.date}</small></p>
      ]]></description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>três linhas</title>
    <link>${base}</link>
    <description>Um haikai novo todo dia, em português, inglês e espanhol.</description>
    <language>pt-BR</language>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${formatDate(haikais[0]?.date || new Date().toISOString().split("T")[0])}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
