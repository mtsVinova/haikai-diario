import Link from "next/link";
import haikais from "../../data/haikais.json";
import HaikaiCard from "./components/HaikaiCard";

export default function Home() {
  const today = haikais[0];

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
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: "480px",
        margin: "0 auto",
        padding: "4rem 2rem",
      }}
    >
      <header
        style={{
          marginBottom: "5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            fontSize: "0.8rem",
            letterSpacing: "0.15em",
            color: "var(--gray)",
            fontWeight: 400,
          }}
        >
          haikai diário
        </span>
        <Link
          href="/arquivo"
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            color: "var(--gray)",
          }}
        >
          arquivo
        </Link>
      </header>

      <article style={{ flex: 1 }}>
        <p
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            color: "var(--gray)",
            marginBottom: "2.5rem",
            fontStyle: "normal",
            fontWeight: 400,
          }}
        >
          {formatDate(today.date)}
        </p>

        <HaikaiCard pt={today.pt} en={today.en} es={today.es} size="large" />
      </article>

      <footer
        style={{
          marginTop: "5rem",
          borderTop: "1px solid var(--light-gray)",
          paddingTop: "1.5rem",
          fontSize: "0.7rem",
          letterSpacing: "0.08em",
          color: "var(--gray)",
        }}
      >
        um poema todo dia
      </footer>
    </main>
  );
}
