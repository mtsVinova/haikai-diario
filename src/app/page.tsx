"use client";
import { useState } from "react";
import haikais from "../../data/haikais.json";
import HaikaiCard from "./components/HaikaiCard";
import LangSelector from "./components/LangSelector";
import Link from "next/link";

type Lang = "pt" | "en" | "es";

export default function Home() {
  const [lang, setLang] = useState<Lang>("pt");

  const today = haikais[0]?.date;
  const todayHaikais = haikais.filter((h) => h.date === today);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: "480px",
        margin: "0 auto",
        padding: "2rem 2rem",
      }}
    >
      <header style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.4rem" }}>
          <LangSelector onChange={setLang} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: "0.8rem", letterSpacing: "0.15em", color: "var(--gray)", fontWeight: 400 }}>
            haikai diário
          </span>
          <Link href="/arquivo" style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: "var(--gray)" }}>
            arquivo
          </Link>
        </div>
      </header>

      <article>
        <p style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: "var(--gray)", marginBottom: "1.5rem", fontWeight: 400 }}>
          {today ? formatDate(today) : ""}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {todayHaikais.map((haikai, i) => (
            <div key={(haikai as any).id || i}>
              <p style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "var(--gray)", marginBottom: "0.8rem" }}>
                {(haikai as any).number ? `${(haikai as any).number}.` : ""}
              </p>
              <HaikaiCard pt={haikai.pt} en={haikai.en} es={haikai.es} lang={lang} size="large" />
              {i < todayHaikais.length - 1 && (
                <div style={{ marginTop: "2.5rem", borderTop: "1px solid var(--light-gray)" }} />
              )}
            </div>
          ))}
        </div>
      </article>

      <footer style={{ marginTop: "2.5rem", borderTop: "1px solid var(--light-gray)", paddingTop: "1rem", fontSize: "0.7rem", letterSpacing: "0.08em", color: "var(--gray)" }}>
        um poema todo dia
      </footer>
    </main>
  );
}
