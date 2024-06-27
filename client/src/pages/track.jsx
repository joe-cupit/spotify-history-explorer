import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { millisecondsToReadableTime } from "../assets/helper";

import { ArtistLink } from "../components/ArtistLink";


export function TrackPage() {
  const {id} = useParams();

  const [trackData, setTrackData] = useState(null);

  useEffect(() => {
    fetch(`/api/track/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setTrackData(data);
        console.log(data);
      });
  }, [id]);

  function fomatDuration(duration_ms) {
    return new Date(duration_ms).toLocaleTimeString().substring(3);
  }

  return (
    <>
    {trackData && <img src={trackData.spotify.album.images[1].url} alt="Album cover" />}
    <h1>{!trackData ? "Loading track..." : trackData.spotify.name}</h1>
    <p>{trackData && fomatDuration(trackData.spotify.duration_ms)}</p>

    <p>
      {trackData && "by"} 
      {trackData && trackData.spotify.artists.map((artist, index) => {
        return (<ArtistLink id={artist.id} name={artist.name} key={index} />)
      })}
    </p>

    <p>{trackData && `Listened for: ${millisecondsToReadableTime(trackData.mongodb.totalListeningTime)}`}</p>
    <p>
      {trackData &&
        `Listened on ${trackData.mongodb.totalListeningCount} occasions
        (skipped ${trackData.mongodb.skippedCount} times)`
      }
    </p>
    </>
  )
}