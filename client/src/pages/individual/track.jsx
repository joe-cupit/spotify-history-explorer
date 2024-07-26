import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { StatsHeader } from "../../components/StatsTitle";
import { ListenChart } from "../../components/ListenChart";

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

      <h3 style={{marginBottom: '5px'}}>First listened on:</h3>
      <span>
        {trackData &&
          <>
            <b>{new Date(trackData.firstListenDate).toLocaleDateString()}</b> at <b>{new Date(trackData.firstListenDate).toLocaleTimeString()}</b>
          </>
        }
      </span>

      <h3 style={{marginBottom: '5px'}}>Most listened on:</h3>
      <span>
        {trackData &&
          <>
            <b>{new Date(trackData.mostListen.date).toLocaleDateString()}</b> when you listened <b>{trackData.mostListen.count}</b> times for <b>{formatMilliseconds(trackData.mostListen.time)}</b>
          </>
        }
      </span>

      {trackData && 
        <ListenChart id={trackData?.spotifyId} maxlen={trackData?.duration} />
      }
      
    </>
  )
}