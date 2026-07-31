import nossaSenhoraImage from '../../assets/santa.png'

function DecorativeBottomBand() {
  return (
    <div className="hero-band" aria-hidden="true">
      <div className="hero-band__curve">
        <div className="hero-band__pattern" />
        <div className="hero-band__gold-edge" />
        <img
          src={nossaSenhoraImage}
          alt=""
          className="hero-band__aparecida"
          width={80}
          height={108}
          decoding="async"
        />
      </div>
    </div>
  )
}

export default DecorativeBottomBand
