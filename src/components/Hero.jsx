function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="container hero__grid">
        <div className="hero__content">
          <span className="hero__label">Nova coleção TerraBrasil</span>
          <h1 className="hero__title">Estilo brasileiro para todos os momentos</h1>
          <p className="hero__subtitle">
            Roupas, calçados e acessórios com qualidade, conforto e personalidade para o
            seu dia a dia.
          </p>
          <div className="hero__actions">
            <a href="#produtos" className="btn btn--primary">Comprar agora</a>
            <a href="#produtos" className="btn btn--outline">Ver novidades</a>
          </div>
          <div className="hero__chips">
            <span>Coleção Campo &amp; Cidade</span>
            <span>Peças exclusivas</span>
            <span>Envio para todo Brasil</span>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="hero__card hero__card--main">
            <div className="hero__card-bg" />
            <p>Coleção Horizonte</p>
            <strong>Moda lifestyle premium</strong>
          </div>
          <div className="hero__card hero__card--float hero__card--1">
            <span>12x sem juros</span>
          </div>
          <div className="hero__card hero__card--float hero__card--2">
            <span>Frete grátis +R$499</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
