"use client";
import { useState, useEffect } from "react";

type Lang = "pt" | "en" | "es";

const FLAGS: Record<Lang, { src: string; label: string }> = {
  pt: { src: "https://flagcdn.com/w40/br.png", label: "Português" },
  en: { src: "https://flagcdn.com/w40/us.png", label: "English" },
  es: { src: "https://flagcdn.com/w40/es.png", label: "Español" },
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
    <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", justifyContent: "flex-end" }}>
      {(["pt", "en", "es"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => select(l)}
          title={FLAGS[l].label}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0",
            opacity: lang === l ? 1 : 0.3,
            transition: "opacity 0.2s",
            lineHeight: 0,
          }}
        >
          <img
            src={FLAGS[l].src}
            alt={FLAGS[l].label}
            width={20}
            height={14}
            style={{ display: "block", borderRadius: "2px" }}
          />
        </button>
      ))}
    </div>
  );
}
