import "./ListenTimeProgress.css"

import { millisecondsToReadableTime } from "../assets/helper";


export function ListenTimeProgress({ time, maxTime }) {

  return (
    <>
      <div className="TimeProgress-Container">
        <div className="TimeProgress-Progress" style={{width: 100*(time / maxTime)+"%"}}></div>
        <div className="TimeProgress-Text">{millisecondsToReadableTime(time)}</div>
      </div>
    </>
  )
}