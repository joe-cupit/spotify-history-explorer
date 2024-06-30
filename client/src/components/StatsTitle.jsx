import "./StatsTitle.css";

import { useEffect, useState } from "react";

import { millisecondsToReadableTime } from "../assets/helper";

import { RankBadge } from "./RankBadge";


export function StatsHeader({ imageURL, name, listened_ms, id }) {

  const [artistRank, setArtistRank] = useState(null);


  useEffect(() => {
    fetch(`/api/artist/${id}/rank`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setArtistRank(data.artistRank);
      });
  }, [id]);


  return (
    <>

    <div className="Stats-title">
      <img src={imageURL} alt={name} />
      <div className="Stats-main">
        <span className="Stats-title-name">{name}</span>
        <div className="Stats-title-timeDiv">
          Listened for<br/>
          <span className="Stats-title-time">{millisecondsToReadableTime(listened_ms)}</span>
          { artistRank && <a href={"/artists?rank="+artistRank} className="Stats-title-rank"><RankBadge rank={artistRank} /></a> }
        </div>
      </div>
    </div>

    </>
  )
}