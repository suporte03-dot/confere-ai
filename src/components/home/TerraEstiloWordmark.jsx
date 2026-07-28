/**
 * Nome da marca — "Terra & Estilo" em script dourado.
 */
function TerraEstiloWordmark({ variant = 'on-dark', className = '' }) {
  const rootClass = ['te-wordmark', `te-wordmark--${variant}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={rootClass}>
      <span className="te-wordmark__terra">Terra</span>
      <span className="te-wordmark__amp" aria-hidden="true">
        {' '}
        &{' '}
      </span>
      <span className="te-wordmark__estilo">Estilo</span>
    </span>
  )
}

export default TerraEstiloWordmark
