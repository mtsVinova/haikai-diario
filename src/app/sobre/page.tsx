import Link from "next/link";

export const metadata = {
  title: "sobre — o que é o três linhas",
  description:
    "O três linhas é um projeto de poesia: um haikai novo todo dia, em português, inglês e espanhol. Saiba mais sobre o projeto e sobre o haikai.",
};

export default function Sobre() {
  return (
    <main
      style={{
        maxWidth: "560px",
        margin: "0 auto",
        padding: "2rem 2rem",
      }}
    >
      <header style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Link href="/" style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: "var(--gray)" }}>
            ← hoje
          </Link>
          <h1 style={{ fontSize: "0.8rem", letterSpacing: "0.15em", color: "var(--gray)", fontWeight: 400, margin: 0 }}>
            sobre
          </h1>
        </div>
      </header>

      <article
        style={{
          fontSize: "1.05rem",
          lineHeight: 1.8,
          color: "var(--black)",
        }}
      >
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 300, fontStyle: "italic", marginBottom: "1rem" }}>
            o projeto
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            O <strong>três linhas</strong> é um experimento silencioso de poesia diária.
            Todo dia, de madrugada e ao meio-dia, um novo haikai é publicado aqui — em
            português, inglês e espanhol.
          </p>
          <p style={{ marginBottom: "1rem" }}>
            Os poemas são gerados automaticamente a partir de um estilo próprio, treinado
            sobre centenas de haikais originais do autor. Cada haikai é único, escrito
            no momento em que você o lê.
          </p>
          <p>
            Acesse o <Link href="/arquivo" style={{ borderBottom: "1px solid var(--gray)" }}>arquivo completo</Link> para ler todos os haikais já publicados.
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 300, fontStyle: "italic", marginBottom: "1rem" }}>
            o que é um haikai
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            O haikai (ou haiku) é uma forma poética de origem japonesa, caracterizada
            pela brevidade: três linhas curtas que costumam somar dezessete sílabas. Sua
            força está no que não é dito — uma imagem breve, um instante suspenso, um
            pensamento que abre mais do que fecha.
          </p>
          <p style={{ marginBottom: "1rem" }}>
            No Brasil, o haikai ganhou vida própria. Afrouxou a contagem silábica,
            aproximou-se do cotidiano, tornou-se mais confessional. Poetas como Paulo
            Leminski e Alice Ruiz mostraram que o essencial do haikai está no olhar, não
            na forma — três linhas que conseguem conter um pequeno universo.
          </p>
          <p>
            Os haikais publicados aqui seguem essa tradição brasileira livre: curtos,
            observadores, íntimos. Às vezes uma imagem do cotidiano, às vezes uma
            pequena filosofia.
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 300, fontStyle: "italic", marginBottom: "1rem" }}>
            por que três linhas
          </h2>
          <p>
            Porque é o suficiente. O haikai acredita que três linhas bastam para dizer
            o que precisa ser dito — e que o que não cabe nelas talvez não precise ser
            dito. O nome do projeto é também um lembrete: ler devagar, em silêncio, sem
            pressa.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 300, fontStyle: "italic", marginBottom: "1rem" }}>
            três idiomas
          </h2>
          <p>
            Cada haikai é publicado em <strong>português</strong>, <strong>inglês</strong> e{" "}
            <strong>espanhol</strong>. As traduções não são literais — são recriações,
            buscando preservar o espírito do poema em cada língua. Use os ícones de
            bandeira no topo para trocar o idioma.
          </p>
        </section>
      </article>

      <footer style={{ marginTop: "3rem", borderTop: "1px solid var(--light-gray)", paddingTop: "1rem", fontSize: "0.7rem", letterSpacing: "0.08em", color: "var(--gray)" }}>
        um poema todo dia
      </footer>
    </main>
  );
}
