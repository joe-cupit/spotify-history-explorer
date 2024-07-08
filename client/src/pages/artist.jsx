import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// import { millisecondsToReadableTime } from "../assets/helper";

import { StatsHeader } from "../components/StatsTitle";
import { BasicTopList } from "../components/BasicTopList"


export function ArtistPage() {
  const {id} = useParams();

  const [artistData, setArtistData] = useState(null);
  useEffect(() => {
    fetch(`/api/artist/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setArtistData(data);
      });
  }, [id]);

  return (
    <>

      <StatsHeader
        imageURL={artistData && artistData.imageURL}
        name={artistData && artistData.name}
        listened_ms={artistData && artistData.totalListeningTime}
        rank={artistData && artistData.rank}
      />

      <h1>Top Tracks</h1>
      <BasicTopList
        type={"track"}
        limit={5}
        topList={artistData && artistData.topTracks}
      />

    </>
  )
}