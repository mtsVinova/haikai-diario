"use client";
import { useState, createContext, useContext, ReactNode, useEffect } from "react";
import LangSelector from "./LangSelector";

type Lang = "pt" | "en" | "es";

const LangContext = createContext<Lang>("pt");

export function useLang() {
  return useContext(LangContext);
}

export default function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("pt");

  return (
    <LangContext.Provider value={lang}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.4rem" }}>
        <LangSelector onChange={setLang} />
      </div>
      {children}
    </LangContext.Provider>
  );
}
