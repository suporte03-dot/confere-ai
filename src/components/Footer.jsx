function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <a href="#inicio" className="logo logo--footer">
            <span className="logo__icon">C</span>
            <span className="logo__text">ConfereAI</span>
          </a>
          <p className="footer__tagline">
            Conferência inteligente para arquivos fiscais, contábeis e financeiros.
          </p>
        </div>
        <p className="footer__copy">
          © {new Date().getFullYear()} ConfereAI. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}

export default Footer
