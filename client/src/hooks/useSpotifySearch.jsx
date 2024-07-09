import { useState, useEffect } from "react";

export const useSpotifySearch = (searchTerm) => {
  const [searchResults, setSearchResults] = useState(null);

  const typeString = 'artist+album+track+show'

  useEffect(() => {
    setSearchResults(null);

    if (searchTerm) {
      const timeOutId = setTimeout(() => {
        setSearchResults(null);
        fetch(`/api/search/${typeString}/${searchTerm}/5`)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setSearchResults(data);
          });
      }, 200)
      return () => clearTimeout(timeOutId);
    }

  }, [searchTerm]);

  return [searchResults, setSearchResults];
}
