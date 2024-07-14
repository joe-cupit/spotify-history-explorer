import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { StatsHeader } from "../../components/StatsTitle";
import { BasicTopList } from "../../components/BasicTopList";


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
        imageURL={showData && showData.imageURL}
        name={showData && showData.name}
        listened_ms={showData && showData.totalListeningTime}
        rank={showData && showData.rank}
      />

      <h1>Top Episodes</h1>
      <BasicTopList
        type={"episode"}
        limit={5}
        topList={showData && showData.topEpisodes}
      />

    </>
  )
}