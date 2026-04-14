"use client";
import { useState, useEffect } from "react";

type Lang = "pt" | "en" | "es";

const FLAGS: Record<Lang, string> = {
  pt: "🇧🇷",
  en: "🇺🇸",
  es: "🇪🇸",
};

interface Props {
  onChange: (lang: Lang) => void;
}

export default function LangSelector({ onChange }: Props) {
  const [lang, setLang] = useState<Lang>("pt");

  useEffect(() => {
    const saved = localStorage.getItem("haikai-lang") as Lang | null;
    if (saved && ["pt", "en", "es"].includes(saved)) {
      setLang(saved);
      onChange(saved);
    }
  }, []);

  const select = (l: Lang) => {
    setLang(l);
    localStorage.setItem("haikai-lang", l);
    onChange(l);
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      {(["pt", "en", "es"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => select(l)}
          title={l.toUpperCase()}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.3rem",
            opacity: lang === l ? 1 : 0.35,
            transition: "opacity 0.2s",
            padding: "0",
            lineHeight: 1,
          }}
        >
          {FLAGS[l]}
        </button>
      ))}
    </div>
  );
}
