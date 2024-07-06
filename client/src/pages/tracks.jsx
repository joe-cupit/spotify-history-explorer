import { BasicTopList } from "../components/BasicTopList"


export function TracksPage() {

  return (
    <>
      <h1>Your Top Tracks</h1>
      <BasicTopList type={"track"} limit={5} />
    </>
  )
}