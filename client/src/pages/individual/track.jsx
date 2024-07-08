import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { StatsHeader } from "../../components/StatsTitle";


export function TrackPage() {
  const {id} = useParams();

  const [trackData, setTrackData] = useState(null);
  useEffect(() => {
    fetch(`/api/track/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTrackData(data);
      });
  }, [id]);

  return (
    <>
      <StatsHeader
        imageURL={trackData && trackData.imageURL}
        name={trackData && trackData.name}
        listened_ms={trackData && trackData.totalListeningTime}
        artistIds={trackData && trackData.artists}
      />
    </>
  )
}