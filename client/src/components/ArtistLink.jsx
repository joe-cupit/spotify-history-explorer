

export function ArtistLink(props) {

    return (
        <>
        <a href={`/artist/${props.id}`}>{props.name}</a>
        </>
    )
}