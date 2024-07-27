import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { StatsHeader } from "../../components/StatsTitle";
import { BasicTopList } from "../../components/BasicTopList";

import { formatMilliseconds } from "../../utils/formatMilliseconds";


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
        imageURL={artistData?.imageURL}
        name={artistData?.name}
        listened_ms={artistData?.totalListeningTime}
        rank={artistData?.totalListeningTime>0 && artistData?.rank}
      />

      {artistData?.totalListeningTime > 0
      ? <>
        <h3 style={{marginBottom: '5px'}}>First listened to:</h3>
        <span>
          {artistData?.firstListenDate &&
            <>
              <b>'{artistData?.firstListenTrack?.name}'</b> on <b>{new Date(artistData?.firstListenDate).toLocaleDateString()}</b> at <b>{new Date(artistData?.firstListenDate).toLocaleTimeString()}</b>
            </>
          }
        </span>

        <h3 style={{marginBottom: '5px'}}>Most listened on:</h3>
        <span>
          {artistData?.mostListen &&
            <>
              <b>{new Date(artistData?.mostListen?.date).toLocaleDateString()}</b> when you listened <b>{artistData?.mostListen?.count}</b> times for <b>{formatMilliseconds(artistData?.mostListen?.time)}</b>
            </>
          }
        </span>

        <h1>Top Tracks</h1>
        <BasicTopList
          link={"track"}
          type={"artist"}
          topList={artistData?.topTracks}
        />
        </>
      : <>
        <h1>You've never listened to this artist.</h1>
        </>
      }
    </>
  )
}