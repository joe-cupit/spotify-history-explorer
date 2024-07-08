import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { StatsHeader } from "../../components/StatsTitle";


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
        imageURL={albumData && albumData.imageURL}
        name={albumData && albumData.name}
        listened_ms={albumData && albumData.totalListeningTime}
        artistIds={albumData && albumData.artists}
      />
    </>
  )
}