import { topBarMessages } from '../../data/homeData'
import PreviewControls from '../PreviewControls'

function TopBar({ previewMode, setPreviewMode }) {
  return (
    <div className="top-bar">
      <div className="container top-bar__inner">
        <div className="top-bar__messages">
          {topBarMessages.map((message) => (
            <span key={message} className="top-bar__item">
              {message}
            </span>
          ))}
        </div>
        <PreviewControls previewMode={previewMode} setPreviewMode={setPreviewMode} />
      </div>
    </div>
  )
}

export default TopBar
