import "./search.css"

import { useSessionStorage } from "../hooks/useSessionStorage";
import { useSpotifySearch } from "../hooks/useSpotifySearch";

import { Link } from "react-router-dom"


export function SearchPage() {

  const [searchTerm, setSearchTerm] = useSessionStorage("search-term", "");
  const [filters, setFilters] = useSessionStorage("filters", {
    "artist": true, "album": true, "track": true, "show": false
  });
  const [searchResults, setSearchResults] = useSpotifySearch(searchTerm);

  const typeList = ["artist", "album", "track", "show"];

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: !filters[e.target.name]
    })
  }

  return (
    <>
    <div className="search-page">
      <div className="search-page-filters">
        <h3>Filters</h3>
        {typeList.map((name, index) => {
          return (
            <label key={index}>
              <input
                type="checkbox"
                name={name}
                checked={filters[name]}
                onChange={handleFilterChange}
              />
              {capitalise(name)+"s"}
            </label>
          )
        })}
      </div>
      <div className="search-page-search">
        <div className="search-page-header">
          <input
            type="search"
            placeholder={"Search Spotify"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}>
          </input>
        </div>
        {searchTerm &&
          <SearchPageResults filters={filters} searchResults={searchResults} />
        }
      </div>
    </div>

    </>
  )
}


function SearchPageResults({ filters, searchResults }) {
  return (
    <div className="search-page-results">
      {Object.keys(filters).filter(t => filters[t]).map((name, index) => {
        return (<>
          <h1>{capitalise(name)+'s'}</h1>
          <div className="search-page-results-section">
            {searchResults?.[name+'s'] ?
              <>
              {searchResults?.[name+'s'].items.length > 0 ?
                searchResults?.[name+'s'].items.map((item, index) => {
                  return (<SearchResult item={item} type={name} key={index} />)
                })
              : <span className="search-page-noresults">No results</span>
              }
              </>
            : Array(5).fill().map((item, index) => {
                return (<SearchResult item={null} key={index} />)
              })
            }
          </div>
        </>)
      })}
    </div>
  )
}


function SearchResult({ item, type }) {
  if (item) {
    var imageURL = null;
    if (type === 'track') {
      imageURL = item.album.images[0]?.url;
    } else {
      imageURL = item.images[0]?.url;
    }    
  }

  return (
    <Link to={item && `/${type}/${item.id}`} className="search-page-result">

      <div className="search-page-result-image">
        {item && <img src={imageURL} alt={item.name} />}
      </div>

      <span className="search-page-result-name">
        {item?.name}
      </span>

    </Link>
  )
}


function capitalise(string) {
  return string[0].toUpperCase() + string.slice(1)
}
