import { BasicTopList } from "../components/BasicTopList"


export function AlbumsPage() {

  return (
    <>
      <h1>Your Top Albums</h1>
      <BasicTopList type={"album"} limit={5} />
    </>
  )
}