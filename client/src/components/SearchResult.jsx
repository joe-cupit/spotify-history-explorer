import { Link } from "react-router-dom"


export function SearchResult(props) {

  return (
      <>
      <Link to={`/${props.type}/${props.id}`}>{props.name}</Link>
      </>
  )
}