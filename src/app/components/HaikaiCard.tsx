"use client";
import { useLang } from "./LangProvider";

interface Props {
  pt: string;
  en: string;
  es: string;
  size?: "large" | "small";
}

export default function HaikaiCard({ pt, en, es, size = "large" }: Props) {
  const lang = useLang();
  const texts: Record<string, string> = { pt, en, es };
  const lines = texts[lang].split("\n");

  return (
    <div
      style={{
        fontSize: size === "large" ? "1.35rem" : "1.1rem",
        fontWeight: 300,
        fontStyle: "italic",
        lineHeight: 1.9,
        letterSpacing: "0.01em",
      }}
    >
      {lines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
}
