import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { StatsHeader } from "../../components/StatsTitle";
import { BasicTopList } from "../../components/BasicTopList";

import { formatMilliseconds } from "../../utils/formatMilliseconds";


export function ShowPage() {
  const {id} = useParams();

  const [showData, setShowData] = useState(null);
  useEffect(() => {
    fetch(`/api/show/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setShowData(data);
      });
  }, [id]);

  return (
    <>

      <StatsHeader
        imageURL={showData?.imageURL}
        name={showData?.name}
        listened_ms={showData?.totalListeningTime}
        rank={showData?.totalListeningTime>0 && showData?.rank}
      />

      {showData?.totalListeningTime > 0
      ? <>
        <h3 style={{marginBottom: '5px'}}>First listened to:</h3>
        <span>
          {showData &&
            <>
              <b>'{showData.firstListenEpisode.name}'</b> on <b>{new Date(showData.firstListenDate).toLocaleDateString()}</b> at <b>{new Date(showData.firstListenDate).toLocaleTimeString()}</b>
            </>
          }
        </span>

        <h3 style={{marginBottom: '5px'}}>Most listened on:</h3>
        <span>
          {showData &&
            <>
              <b>{new Date(showData.mostListen.date).toLocaleDateString()}</b> when you listened <b>{showData.mostListen.count}</b> times for <b>{formatMilliseconds(showData.mostListen.time)}</b>
            </>
          }
        </span>

        <h1>Top Episodes</h1>
        <BasicTopList
          link={"episode"}
          type={"show"}
          topList={showData && showData.topEpisodes}
        />
        </>
      : <>
        <h1>You've never listened to this show.</h1>
        </>
      }


    </>
  )
}