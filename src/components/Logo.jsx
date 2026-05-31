function Logo({ size = 'md' }) {
  return (
    <span className={`logo logo--${size}`}>
      <span className="logo__mark" aria-hidden="true">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="10" fill="#1F4D2B" />
          <path d="M18 8c-4 0-7 2.5-7 6 0 2.2 1.2 4 3 5.2V26h8v-6.8c1.8-1.2 3-3 3-5.2 0-3.5-3-6-7-6z" fill="#C8923E" fillOpacity="0.9" />
          <path d="M14 26h8" stroke="#FAF7F0" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="26" cy="10" r="3" fill="#C8923E" />
        </svg>
      </span>
      <span className="logo__text">
        <span className="logo__terra">Terra</span>
        <span className="logo__brasil">Brasil</span>
      </span>
    </span>
  )
}

export default Logo
