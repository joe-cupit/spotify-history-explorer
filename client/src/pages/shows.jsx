import { BasicTopList } from "../components/BasicTopList"


export function ShowsPage() {

  return (
    <>
      <h1>Your Top Shows</h1>
      <BasicTopList type={"show"} limit={5} />
    </>
  )
}