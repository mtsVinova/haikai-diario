export default function ApoieLink() {
  return (
    <div
      style={{
        marginTop: "2rem",
        paddingTop: "1.5rem",
        borderTop: "1px solid var(--light-gray)",
      }}
    >
      <p
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.12em",
          color: "var(--black)",
          marginBottom: "0.6rem",
          fontWeight: 700,
        }}
      >
        apoie o projeto
      </p>
      <p
        style={{
          fontSize: "0.8rem",
          color: "var(--gray)",
          lineHeight: 1.7,
          marginBottom: "0.8rem",
          fontStyle: "italic",
        }}
      >
        <em>infinito espaço imaginário</em> é a coleção de 100 haikais originais
        que serve de base para os poemas gerados aqui todo dia. Adquira o ebook
        em PDF + EPUB e conheça o trabalho que deu origem ao três linhas.
      </p>
      <a
        href="https://pay.kiwify.com.br/N9S1PtV"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.1em",
          color: "var(--black)",
          borderBottom: "1px solid var(--black)",
          paddingBottom: "1px",
          textDecoration: "none",
        }}
      >
        adquirir por R$19,90
      </a>
    </div>
  );
}
