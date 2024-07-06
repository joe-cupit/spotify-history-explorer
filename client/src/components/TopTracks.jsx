import "./TopTracks.css"

import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { TrackCard } from "./TrackCard";


export function TopTracks({ artistId , limit }) {

  const [topTracks, setTopTracks] = useState(null);

  useEffect(() => {
    fetch(`/api/artist/${artistId}/toptracks/${limit}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTopTracks(data);
      });
  }, [artistId, limit]);


  return (
    <>
    <div className="TopTracks">
      <h1>Top tracks:</h1>
      {topTracks && topTracks.map((item, index) => {
        return (
          <TrackCard
            imageURL={item.imageURL}
            id={item.spotifyId}
            name={item.name}
            listenCount={item.totalListeningCount}
            listenTime={item.totalListeningTime}
            maxTime={topTracks[0].totalListeningTime}

            key={index}
          />
        )
      })}
      {limit ? <Link to={"/artist/"+artistId+"/toptracks"} className="TrackCard-ViewAll">view all...</Link> : null}
    </div>
    </>
  )
}