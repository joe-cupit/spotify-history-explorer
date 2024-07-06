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
    {artistData &&
      <>
        <StatsHeader
          imageURL={artistData.imageURL}
          name={artistData.name}
          listened_ms={artistData.totalListeningTime}
          id={id}
        />

        <h1>Top Tracks</h1>
        <BasicTopList type={"track"} limit={5} />
      </>
    }
    </>
  )
}