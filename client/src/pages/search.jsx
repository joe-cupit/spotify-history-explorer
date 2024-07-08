import "./search.css"

import { useEffect, useState } from "react";

import { Link } from "react-router-dom"


export function SearchPage() {

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const typeList = ['artist', 'album', 'track', 'show'];

  useEffect(() => {
    const typeString = getTypeString();
    if (searchTerm) {
      const timeOutId = setTimeout(() => {
        fetch(`/api/search/${typeString}/${searchTerm}/5`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data)
            setSearchResults(data)
          });
      }, 200);
      return () => clearTimeout(timeOutId);
    } else {
      setSearchResults(null);
    }
  }, [searchTerm]);


  function getTypeString() {
    var activeTypeList = [];
    for (let type of typeList) {
      let active = document.querySelector(`#checkbox-${type}`).checked;
      if (active) {
        activeTypeList.push(type);
      }
    }
    return activeTypeList.join('+');
  }

  function presentResults(resultList, type) {
    return (
      <>
      <div className="search-page-results-section">
        {resultList.map((item, index) => {
          return (<SearchResult item={item} type={type} key={index} />)
        })}        
      </div>

      </>
    )
  }


  return (
    <>
    <div className="search-page">
      <div className="search-page-filters">
        <h3>Filters</h3>
        {typeList.map((name, index) => {
          return <CheckBox key={index} name={name} id={'checkbox-'+name} />
        })}
      </div>
      <div className="search-page-search">
        <div className="search-page-header">
          <input
            type="search"
            placeholder={"Search Spotify"}
            onChange={(e) => setSearchTerm(e.target.value)}>
          </input>
        </div>
        <div className="search-page-results">
          results for '{searchTerm}'...
          {searchResults && typeList.map((type, index) => {
            if (type+'s' in searchResults) {
              return (
                <div key={index}>
                  <h3>{capitalise(type)+'s'}</h3>
                  {presentResults(searchResults[type+'s'].items, type)}
                </div>
              )
            } else return null
          })}
        </div>
      </div>
    </div>

    </>
  )
}


function SearchResult({ item, type }) {
  console.log(item)

  var imageURL = null;
  if (type === 'track') {
    imageURL = item.album.images[0].url;
  } else {
    imageURL = item.images[0].url;
  }

  return (
      <>
      <Link to={`/${type}/${item.id}`}>
        <div className="search-page-result">
          <div className="search-page-result-image">
            <img src={imageURL} alt={item.name} />
          </div>
          <span className="search-page-result-name">
            {item.name}
          </span>
          
        </div>
      </Link>
      </>
  )
}


function CheckBox({ name, id }) {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
  }

  return (
    <label>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
      />
      {capitalise(name)+"s"}
    </label>
  )
}


function capitalise(string) {
  return string[0].toUpperCase() + string.slice(1)
}
