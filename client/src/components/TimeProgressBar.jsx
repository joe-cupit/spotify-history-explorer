import "../styles/components/TimeProgressBar.css"

import { formatMilliseconds } from "../utils/formatMilliseconds";


export function TimeProgressBar({ time, maxTime }) {

  return (
    <>
      <div className="time-progress-bar">
        <div className="time-progress-background" style={{width: 100*(time / maxTime)+"%"}}>
          <div></div>
        </div>
        <div className="time-progress-text">{formatMilliseconds(time)}</div>
      </div>
    </>
  )
}