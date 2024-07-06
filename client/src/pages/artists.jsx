import { BasicTopList } from "../components/BasicTopList"


export function ArtistsPage() {

  return (
    <>
      <h1>Your Top Artists</h1>
      <BasicTopList type={"artist"} limit={8} />
    </>
  )
}