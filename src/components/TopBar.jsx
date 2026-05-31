import { topBenefits } from '../data/mockData'

function TopBar() {
  return (
    <div className="topbar">
      <div className="container topbar__inner">
        {topBenefits.map((text) => (
          <span key={text} className="topbar__item">
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}

export default TopBar
