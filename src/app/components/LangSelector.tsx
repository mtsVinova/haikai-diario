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
    <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
      {(["pt", "en", "es"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => select(l)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.5rem",
            opacity: lang === l ? 1 : 0.3,
            transition: "opacity 0.2s",
            padding: "0",
            lineHeight: 1,
            fontFamily: "Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif",
          }}
        >
          {FLAGS[l]}
        </button>
      ))}
    </div>
  );
}
