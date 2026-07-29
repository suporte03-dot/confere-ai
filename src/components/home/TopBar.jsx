import { topBarMessages } from '../../data/homeData'
import PreviewControls from '../PreviewControls'

const ICONS = {
  truck: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M1 13h13V6H1v7zm13 0h4.5L22 16.5V13h-8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M1 13v5h2.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="6.5" cy="18.5" r="1.8" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="18.5" r="1.8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  tag: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 12.5V5h7.5L21 15.5 12.5 24 3 14.5v-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="9" r="1.4" fill="currentColor" />
    </svg>
  ),
  phone: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M19.5 16.3c-1.2 0-2.3-.2-3.4-.6-.4-.1-.8 0-1.1.3l-1.5 1.5a13.6 13.6 0 0 1-5.9-5.9l1.5-1.5c.3-.3.4-.7.3-1.1-.4-1.1-.6-2.2-.6-3.4 0-.6-.4-1.1-1-1.1H5.1c-.6 0-1.1.5-1.1 1.1C4 15.2 9.8 21 17 21c.6 0 1.1-.5 1.1-1.1v-2.5c0-.6-.5-1.1-1.1-1.1h.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

function TopBar({ previewMode, setPreviewMode, showPreviewControls = true }) {
  return (
    <div className="top-bar">
      <div className="container top-bar__inner">
        <div className="top-bar__messages">
          {topBarMessages.map((message) => {
            const content = (
              <>
                <span className="top-bar__icon">{ICONS[message.icon]}</span>
                <span className="top-bar__text">{message.text}</span>
              </>
            )

            if (message.href) {
              return (
                <a
                  key={message.id}
                  href={message.href}
                  className="top-bar__item top-bar__item--link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              )
            }

            return (
              <span key={message.id} className="top-bar__item">
                {content}
              </span>
            )
          })}
        </div>
      </div>
      {showPreviewControls && previewMode != null && setPreviewMode && (
        <PreviewControls previewMode={previewMode} setPreviewMode={setPreviewMode} />
      )}
    </div>
  )
}

export default TopBar
