import Link from "next/link";
import { notFound } from "next/navigation";
import haikais from "../../../data/haikais.json";
import ApoieLink from "../../components/ApoieLink";

export async function generateStaticParams() {
  return haikais.map((h: any) => ({ id: String(h.number) }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const haikai = haikais.find((h: any) => String(h.number) === params.id);
  if (!haikai) return {};
  const primLinha = haikai.pt.split("\n")[0];
  return {
    title: `#${(haikai as any).number} — ${primLinha}`,
    description: haikai.pt.replace(/\n/g, " "),
    alternates: { canonical: `https://treslinhas.com.br/haikai/${(haikai as any).number}` },
  };
}

export default function HaikaiPage({ params }: { params: { id: string } }) {
  const haikai = haikais.find((h: any) => String(h.number) === params.id);
  if (!haikai) notFound();

  const number = (haikai as any).number;
  const prev = haikais.find((h: any) => h.number === number - 1);
  const next = haikais.find((h: any) => h.number === number + 1);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("pt-BR", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  const CINZA = "#888888";
  const PRETO = "#1a1a1a";
  const CINZA_CLARO = "#e8e8e8";
  const CINZA_MUITO_CLARO = "#cccccc";

  const linhaStyle = {
    fontSize: "1.2rem",
    fontStyle: "italic" as const,
    lineHeight: 1.9,
    color: PRETO,
    margin: 0,
  };

  const linhaSecStyle = {
    ...linhaStyle,
    color: CINZA,
  };

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", padding: "2rem 2rem" }}>
      <header style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Link href="/arquivo" style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: CINZA }}>
            ← arquivo
          </Link>
          <Link href="/" style={{ fontSize: "0.8rem", letterSpacing: "0.15em", color: CINZA, fontWeight: 400 }}>
            três linhas
          </Link>
        </div>
      </header>

      <article>
        <p style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: CINZA, marginBottom: "1.5rem" }}>
          {formatDate(haikai.date)}
        </p>

        <p style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: CINZA, marginBottom: "1.2rem" }}>
          {number}.
        </p>

        <div style={{ marginBottom: "1.5rem" }}>
          <span style={{ fontSize: "0.55rem", letterSpacing: "0.3em", color: CINZA_MUITO_CLARO, display: "block", marginBottom: "0.3rem" }}>PT</span>
          {haikai.pt.split("\n").map((l, i) => <p key={i} style={linhaStyle}>{l}</p>)}
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <span style={{ fontSize: "0.55rem", letterSpacing: "0.3em", color: CINZA_MUITO_CLARO, display: "block", marginBottom: "0.3rem" }}>EN</span>
          {haikai.en.split("\n").map((l, i) => <p key={i} style={linhaSecStyle}>{l}</p>)}
        </div>

        <div>
          <span style={{ fontSize: "0.55rem", letterSpacing: "0.3em", color: CINZA_MUITO_CLARO, display: "block", marginBottom: "0.3rem" }}>ES</span>
          {haikai.es.split("\n").map((l, i) => <p key={i} style={linhaSecStyle}>{l}</p>)}
        </div>
      </article>

      {/* Navegação entre haikais */}
      <nav style={{ marginTop: "2.5rem", display: "flex", justifyContent: "space-between", borderTop: `1px solid ${CINZA_CLARO}`, paddingTop: "1rem" }}>
        {prev ? (
          <Link href={`/haikai/${prev.number}`} style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: CINZA }}>
            ← #{(prev as any).number}
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/haikai/${(next as any).number}`} style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: CINZA }}>
            #{(next as any).number} →
          </Link>
        ) : <span />}
      </nav>

      <ApoieLink />

      <footer style={{ marginTop: "1.5rem", borderTop: `1px solid ${CINZA_CLARO}`, paddingTop: "1rem", fontSize: "0.7rem", letterSpacing: "0.08em", color: CINZA }}>
        um poema todo dia
      </footer>
    </main>
  );
}
