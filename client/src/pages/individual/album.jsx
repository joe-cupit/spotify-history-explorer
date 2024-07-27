import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { StatsHeader } from "../../components/StatsTitle";
import { BasicTopList } from "../../components/BasicTopList";

import { formatMilliseconds } from "../../utils/formatMilliseconds";


export function AlbumPage() {
  const {id} = useParams();

  const [albumData, setAlbumData] = useState(null);
  useEffect(() => {
    fetch(`/api/album/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAlbumData(data);
      });
  }, [id]);

  return (
    <>
      <StatsHeader
        imageURL={albumData?.imageURL}
        name={albumData?.name}
        listened_ms={albumData?.totalListeningTime}
        artistIds={albumData?.artistIds}
        artistNames={albumData?.artistNames}
      />

      {albumData?.totalListeningTime > 0
      ? <>
        <h3 style={{marginBottom: '5px'}}>First listened to:</h3>
        <span>
          {albumData &&
            <>
              <b>'{albumData.firstListenTrack.name}'</b> on <b>{new Date(albumData.firstListenDate).toLocaleDateString()}</b> at <b>{new Date(albumData.firstListenDate).toLocaleTimeString()}</b>
            </>
          }
        </span>

        <h3 style={{marginBottom: '5px'}}>Most listened on:</h3>
        <span>
          {albumData &&
            <>
              <b>{new Date(albumData.mostListen.date).toLocaleDateString()}</b> when you listened <b>{albumData.mostListen.count}</b> times for <b>{formatMilliseconds(albumData.mostListen.time)}</b>
            </>
          }
        </span>

        <BasicTopList
          link={"track"}
          type={"album"}
          topList={albumData && albumData.tracks}
        />        
        </>
      : <>
        <h1>You've never listened to this album.</h1>
        </>
      }

    </>
  )
}