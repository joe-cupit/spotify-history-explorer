
import { TimeProgressBar } from "./TimeProgressBar"

import { Link } from "react-router-dom"


export function TrackCard({ imageURL, id, name, listenCount, listenTime, maxTime}) {

  return (
    <>
    <div className="TrackCard">
      <img src={imageURL} alt={name} />

      <Link to={"/track/"+id} className="TrackCard-Name">
        {name}
      </Link>

      <div className="Progress">
        <TimeProgressBar time={listenTime} maxTime={maxTime} />
      </div>

    </div>
    </>
  )
}