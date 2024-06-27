import "./StatsTitle.css"

import { millisecondsToReadableTime } from "../assets/helper";


export function StatsHeader({ imageURL, name, listened_ms }) {

  return (
    <>

    <div className="Stats-title">
      <img src={imageURL} alt={name} />
      <div className="Stats-main">
        <span className="Stats-title-name">{name}</span>
        <div className="Stats-title-timeDiv">
          Listened for<br/>
          <span className="Stats-title-time">{millisecondsToReadableTime(listened_ms)}</span>
        </div>
      </div>
    </div>

    </>
  )
}