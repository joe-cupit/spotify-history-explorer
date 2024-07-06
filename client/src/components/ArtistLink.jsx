import { Link } from "react-router-dom"


export function ArtistLink(props) {

    return (
        <>
        <Link to={`/artist/${props.id}`}>{props.name}</Link>
        </>
    )
}