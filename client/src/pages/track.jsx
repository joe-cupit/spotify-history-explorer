import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

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
    {trackData && trackData.status === 200 && <img src={trackData.album.images[1].url} alt="Album cover" />}
    <h1>{!trackData ? "Loading track..." : trackData.status === 200 ? trackData.name : `${trackData.status} - ${trackData.message}`}</h1>
    <p>{trackData && trackData.status === 200 && fomatDuration(trackData.duration_ms)}</p>

    <p>
      {trackData && trackData.status === 200 && "by"} 
      {trackData && trackData.status === 200
        && trackData.artists.map((artist) => {
        return (<ArtistLink id={artist.id} name={artist.name} />)
        })}
    </p>
    </>
  )
}