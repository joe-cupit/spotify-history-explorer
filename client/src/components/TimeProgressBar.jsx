import "./TimeProgressBar.css"

import { millisecondsToReadableTime } from "../assets/helper";


export function TimeProgressBar({ time, maxTime }) {

  return (
    <>
      <div className="time-progress-bar">
        <div className="time-progress-background" style={{width: 100*(time / maxTime)+"%"}}></div>
        <div className="time-progress-text">{millisecondsToReadableTime(time)}</div>
      </div>
    </>
  )
}