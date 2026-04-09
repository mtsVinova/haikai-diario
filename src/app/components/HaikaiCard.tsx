"use client";
import { useState } from "react";

type Lang = "pt" | "en" | "es";

interface Props {
  pt: string;
  en: string;
  es: string;
  size?: "large" | "small";
}

export default function HaikaiCard({ pt, en, es, size = "large" }: Props) {
  const [lang, setLang] = useState<Lang>("pt");

  const texts: Record<Lang, string> = { pt, en, es };
  const labels: Record<Lang, string> = { pt: "PT", en: "EN", es: "ES" };

  const lines = texts[lang].split("\n");

  return (
    <div>
      <div
        style={{
          fontSize: size === "large" ? "1.7rem" : "1.2rem",
          fontWeight: 300,
          fontStyle: "italic",
          lineHeight: 1.9,
          letterSpacing: "0.01em",
          marginBottom: size === "large" ? "2rem" : "1rem",
        }}
      >
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        {(["pt", "en", "es"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              color: lang === l ? "var(--black)" : "var(--gray)",
              fontFamily: "var(--font)",
              fontWeight: lang === l ? 500 : 400,
              padding: "0",
              borderBottom: lang === l ? "1px solid var(--black)" : "1px solid transparent",
              paddingBottom: "1px",
              transition: "all 0.2s",
            }}
          >
            {labels[l]}
          </button>
        ))}
      </div>
    </div>
  );
}
