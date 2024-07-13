import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { StatsHeader } from "../../components/StatsTitle";

import { formatMilliseconds } from "../../utils/formatMilliseconds";


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
        imageURL={trackData?.imageURL}
        name={trackData?.name}
        listened_ms={trackData?.totalListeningTime}
        artistIds={trackData?.artistIds}
        artistNames={trackData?.artistNames}
      />

      <h1>{formatMilliseconds(trackData?.totalListeningTime)}</h1>
    </>
  )
}