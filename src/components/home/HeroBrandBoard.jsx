function HeroBrandBoard({ logoSrc }) {
  return (
    <figure className="hero-brand-board">
      <div className="hero-brand-board__ring">
        <img
          src={logoSrc}
          alt="Terra & Estilo — A marca do agro brasileiro"
          className="hero-brand-board__logo-img"
          width={512}
          height={512}
          decoding="async"
          fetchPriority="high"
        />
      </div>
    </figure>
  )
}

export default HeroBrandBoard
