import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// import { millisecondsToReadableTime } from "../assets/helper";

// import { ArtistLink } from "../components/ArtistLink";
import { StatsHeader } from "../components/StatsTitle";


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

/*   function fomatDuration(duration_ms) {
    return new Date(duration_ms).toLocaleTimeString().substring(3);
  } */

  return (
    <>
    {trackData &&
      <StatsHeader
        imageURL={trackData.imageURL}
        name={trackData.name}
        listened_ms={trackData.totalListeningTime}
        artistIds={trackData.artists}
      />
    }
    </>
  )
}