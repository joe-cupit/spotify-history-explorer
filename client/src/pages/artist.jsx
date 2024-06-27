import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { millisecondsToReadableTime } from "../assets/helper";


export function ArtistPage() {
  const {id} = useParams();

  const [artistData, setArtistData] = useState(null);

  useEffect(() => {
    fetch(`/api/artist/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setArtistData(data);
      });
  }, [id]);

  return (
    <>
    {artistData && <img src={artistData.spotify.images[1].url} alt="Artist" />}
    <h1>{!artistData ? "Loading artist..." : artistData.spotify.name}</h1>
    <p>{artistData && `Followers: ${artistData.spotify.followers.total.toLocaleString()}`}</p>
    <p>{artistData && `Listened for: ${millisecondsToReadableTime(artistData.mongodb.totalListeningTime)}`}</p>
    <p>
      {artistData &&
        `Listened on ${artistData.mongodb.totalListeningCount} occasions
        (skipped ${artistData.mongodb.skippedCount} times)`
      }
    </p>
    </>
  )
}