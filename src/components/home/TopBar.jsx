import { topBarMessages } from '../../data/homeData'

function TopBar() {
  return (
    <div className="top-bar">
      <div className="container top-bar__inner">
        {topBarMessages.map((message) => (
          <span key={message} className="top-bar__item">
            {message}
          </span>
        ))}
      </div>
    </div>
  )
}

export default TopBar
