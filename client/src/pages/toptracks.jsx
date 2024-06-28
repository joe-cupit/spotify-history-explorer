import { useParams } from "react-router-dom";

import { TopTracks } from "../components/TopTracks";


export function TopTracksPage() {
  const {id} = useParams();

  return (
    <>
      <TopTracks artistId={id} limit={0} />
    </>
  )
}