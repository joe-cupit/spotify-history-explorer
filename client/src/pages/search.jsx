import { useEffect, useState } from "react";

import { SearchResult } from "../components/SearchResult";


export function SearchPage({searchType}) {

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    if (searchTerm) {
      const timeOutId = setTimeout(() => {
        fetch(`/api/search/${searchType}/${searchTerm}`)
        .then((response) => response.json())
        .then((data) => setSearchResults(data));
      }, 200);
      return () => clearTimeout(timeOutId);
    } else {
      setSearchResults(null);
    }
  }, [searchTerm, searchType]);

  function presentResults(resultList) {
    return (
      <>
      {resultList.map((item, index) => {
        return (<SearchResult type={searchType} id={item.id} name={item.name} key={index} />)
      })}
      </>
    )
  }

  return (
    <>
    <h1>Search for {searchType}</h1>
    <input type="text" placeholder={searchType + " name"} onChange={(e) => setSearchTerm(e.target.value)}></input>
    {searchResults && presentResults(searchResults)}
    </>
  )
}