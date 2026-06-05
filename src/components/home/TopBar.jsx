import { topBarMessages } from '../../data/homeData'

function TopBar() {
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
      </div>
    </div>
  )
}

export default TopBar
