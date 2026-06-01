function AboutSection() {
  return (
    <section id="sobre" className="lp-about">
      <div className="lp-container lp-about__grid">
        <div className="lp-about__content">
          <p className="lp-eyebrow">Sobre a marca</p>
          <h2>Moda que veste origens</h2>
          <p className="lp-about__lead">
            TerraEstilo nasce da união entre elegância, origem e autenticidade. Uma moda
            que honra suas raízes e traduz o estilo do sul do Brasil com sofisticação e
            propósito.
          </p>
          <p>
            Cada coleção é pensada como uma narrativa editorial — tecidos naturais,
            silhuetas atemporais e uma estética que celebra a identidade regional sem
            perder o refinamento contemporâneo.
          </p>
          <a href="#contato" className="lp-btn lp-btn--primary">Conheça nossas coleções</a>
        </div>

        <div className="lp-about__visual">
          <img
            src="/images/brand/brand-board-reference.png"
            alt="Painel de identidade visual TerraEstilo"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}

export default AboutSection
