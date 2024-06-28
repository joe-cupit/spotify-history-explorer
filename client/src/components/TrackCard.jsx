
import { ListenTimeProgress } from "./ListenTimeProgress"


export function TrackCard({ imageURL, id, name, listenCount, listenTime, maxTime}) {

  return (
    <>
    <div className="TrackCard">
      <img src={imageURL} alt={name} />

      <a href={"/track/"+id} className="TrackCard-Name">
        {name}
      </a>

      <div className="Progress">
        <ListenTimeProgress time={listenTime} maxTime={maxTime} />
      </div>

    </div>
    </>
  )
}