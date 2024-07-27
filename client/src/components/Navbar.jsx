import "../styles/components/Navbar.css";

import { useState } from "react";
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom"

import { useSpotifySearch } from "../hooks/useSpotifySearch";


export function Navbar() {

  const [searchTerm, setSearchTerm] = useState("");
  const searchResults = useSpotifySearch(searchTerm);

  const navigate = useNavigate()

  const clickSearch = (e) => {
    e.preventDefault();
    navigate('/search?term='+searchTerm);
    setSearchTerm('');
  }

  const toggleSearchResults = (display) => {
    const resultsDiv = document.getElementById("nav-search-results");
    setTimeout(() => {resultsDiv.style.display = display}, 100);
  }

  const searchResultClicked = () => {
    setSearchTerm('');
  }


  const toggleDarkMode = () => {
    if (document.body.className) {
      document.body.className = "";
      document.getElementById('light-dark-button-sun').style.display = 'block';
      document.getElementById('light-dark-button-moon').style.display = 'none';
    } else {
      document.body.className = "light-mode";
      document.getElementById('light-dark-button-sun').style.display = 'none';
      document.getElementById('light-dark-button-moon').style.display = 'block';
    }
  }


  return (
    <nav className="nav">
      <span className="nav-left">
        <Link to={'/'} className="nav-title">Spotify History</Link>
        <ul>
          <CustomLink to={'/artists'}>Artists</CustomLink>
          <CustomLink to={'/albums'}>Albums</CustomLink>
          <CustomLink to={'/tracks'}>Tracks</CustomLink>
          <CustomLink to={'/shows'}>Shows</CustomLink>
        </ul>
      </span>

      <span className="nav-right">
        <form
          className="nav-search-container"
          onSubmit={(e) => {
            e.preventDefault();
            e.target.children[0].blur();
            clickSearch(e);
          }}
        >
          <input
            type="search"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => toggleSearchResults("block")}
            onBlur={() => toggleSearchResults("none")}
          />
          <div id="nav-search-results" style={{display: "none"}}>
            {searchTerm &&
              <div className="nav-search-results">
                <NavSearchResults searchResults={searchResults} onClick={searchResultClicked} />
            </div>
            }
          </div>
        </form>

        <button
          to={"/search?term="+searchTerm}
          className="nav-search-button"
          onClick={(e) => {clickSearch(e);}}
        >Search</button>

        <span className="light-dark-button" onClick={() => toggleDarkMode()}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" strokeWidth="2" stroke="currentColor" id="light-dark-button-sun">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" strokeWidth="2" stroke="currentColor" id="light-dark-button-moon" style={{display: 'none'}}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
          </svg>
        </span> 
      </span>
    </nav>
  )
}


function CustomLink( {to , children, ...props } ) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch( {path: resolvedPath.pathname} );

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>{children}</Link>
    </li>
  )
}


function NavSearchResults({ searchResults, onClick }) {
  return (
    <>
      {searchResults ?
      <>
        <SearchResult item={searchResults?.artists.items[0]} onClick={onClick} />
        <SearchResult item={searchResults?.tracks.items[0]} onClick={onClick} />
        <SearchResult item={searchResults?.albums.items[0]} onClick={onClick} />
        <SearchResult item={searchResults?.shows.items[0]} onClick={onClick} />
      </>
      : "searching..."
      }  
    </>

  )
}


function SearchResult({ item, onClick }) {
  let imageURL = null;
  let secondaryText = null;

  switch (item?.type) {
    case "artist":
      imageURL = item?.images[0]?.url;
      break;
    case "album":
      imageURL = item?.images[0]?.url;
      secondaryText = item?.artists[0].name;
      break;
    case "track":
      imageURL = item?.album.images[0]?.url;
      secondaryText = item?.artists[0].name;
      break;
    case "show":
      imageURL = item?.images[0]?.url;
      break;
    default:
      imageURL = null
  }

  if (item?.type === "track") {
    imageURL = item?.album.images[0]?.url;
  }
  else {
    imageURL = item?.images[0]?.url;
  }

  return (
    <Link
      to={"/"+item.type+"/"+item.id}
      className="nav-search-result"
      onClick={onClick}
    >
      <div className="nav-search-result-img">
        <img src={imageURL} alt={item.name} />
      </div>
      
      <div className="nav-search-result-text">
        <span className="nav-search-result-text-primary">
          <span className="nav-search-result-text-name">{item.name}</span>
          {secondaryText &&
            <span className="nav-search-result-text-secondary">
              &nbsp;•&nbsp;{secondaryText}
            </span>
          }
        </span>
        <span className="nav-search-result-text-secondary">
          {item.type}
        </span>
      </div>
    </Link>
  )
}
