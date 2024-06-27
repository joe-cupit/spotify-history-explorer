import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";


export function ArtistPage() {
  const {id} = useParams();

  const [artistData, setArtistData] = useState(null);

  useEffect(() => {
    fetch(`/api/artist/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setArtistData(data);
        console.log(data);
      });
  }, [id]);

  return (
    <>
    {artistData && artistData.status === 200 && <img src={artistData.images[1].url} alt="Artist" />}
    <h1>{!artistData ? "Loading artist..." : artistData.status === 200 ? artistData.name : `${artistData.status} - ${artistData.message}`}</h1>
    <p>{artistData && artistData.status === 200 && `Followers: ${artistData.followers.total.toLocaleString()}`}</p>
    </>
  )
}