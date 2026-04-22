"use client";
import { useState } from "react";
import Link from "next/link";
import haikais from "../../../data/haikais.json";
import HaikaiCard from "../components/HaikaiCard";
import LangSelector from "../components/LangSelector";

type Lang = "pt" | "en" | "es";

export default function Arquivo() {
  const [lang, setLang] = useState<Lang>("pt");

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const grouped: Record<string, typeof haikais> = {};
  haikais.forEach((h) => {
    const [year, month] = h.date.split("-");
    const key = `${year}-${month}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(h);
  });

  const monthLabel = (key: string) => {
    const [year, month] = key.split("-").map(Number);
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  };

  const sortedGroups = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <main style={{ maxWidth: "560px", margin: "0 auto", padding: "2rem 2rem" }}>
      <header style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.4rem" }}>
          <LangSelector onChange={setLang} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Link href="/" style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: "var(--gray)" }}>
            ← hoje
          </Link>
          <span style={{ fontSize: "0.8rem", letterSpacing: "0.15em", color: "var(--gray)" }}>
            arquivo
          </span>
        </div>
      </header>

      {sortedGroups.map((groupKey) => (
        <section key={groupKey} style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "0.7rem", letterSpacing: "0.18em", color: "var(--gray)", fontWeight: 400, marginBottom: "1.5rem", textTransform: "uppercase" }}>
            {monthLabel(groupKey)}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {grouped[groupKey].map((haikai) => (
              <article key={(haikai as any).id || haikai.date} style={{ paddingBottom: "2rem", borderBottom: "1px solid var(--light-gray)" }}>
                <p style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "var(--gray)", marginBottom: "0.3rem" }}>
                  {formatDate(haikai.date)}
                </p>
                <p style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "var(--gray)", marginBottom: "0.8rem" }}>
                  {(haikai as any).number ? `${(haikai as any).number}.` : ""}
                </p>
                <HaikaiCard pt={haikai.pt} en={haikai.en} es={haikai.es} lang={lang} size="small" />
              </article>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
