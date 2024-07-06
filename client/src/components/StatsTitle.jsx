import "./StatsTitle.css";

import { useEffect, useState } from "react";

import { millisecondsToReadableTime } from "../assets/helper";
import { Link } from "react-router-dom";

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

    <div className="stats-title">

      <img src={imageURL} alt={name} />

      <span className="stats-title-content">
        <h1>{name}</h1>

        <span className="stats-title-about">
          <span>Listened for <br /> {millisecondsToReadableTime(listened_ms)}</span>

          <span>
            {artistRank
              ? <Link to={"/artists?rank="+artistRank} className="stats-title-rank">
                  <RankBadge rank={artistRank} />
                </Link>
              : null
            }
          </span>
        </span>

      </span>

    </div>

    </>
  )
}