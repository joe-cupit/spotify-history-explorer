

export function SearchResult(props) {

  return (
      <>
      <a href={`/${props.type}/${props.id}`}>{props.name}</a>
      </>
  )
}