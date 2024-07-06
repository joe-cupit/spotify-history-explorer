import "./artists.css";

import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom'

import { millisecondsToReadableTime } from "../assets/helper";


export function ArtistsPage(props) {

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const rank = parseInt(params.get('rank'));

  const [artistList, setArtistList] = useState(null);

  useEffect(() => {
    fetch(`/api/artists`)
      .then((response) => response.json())
      .then((data) => setArtistList(data))
  }, []);

  useEffect(() => {
    setTimeout(scrollToArtist, 100);
  }, []);


  const scrollToArtist = function () {
    const row = document.getElementById('selected-artist');
    row?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }


  function presentResults(artistList) {
    return (
      <>
      <table className="artist-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th></th>
            <th class="artist-table-name">Artist</th>
            <th>Occasions</th>
            <th>Total time</th>
          </tr>
        </thead>
        <tbody>
          {artistList.map((item, index) => {
            var id = null;
            if (rank === (index+1)) {
              id = "selected-artist";
            }
            return (
              <tr className="artist-row" id={id} key={index}>
                <td>#{index+1}</td>
                <td>
                  {item.imageURL
                   ? <img src={item.imageURL} alt={item.name} />
                   : <div className="image-placeholder"></div>
                  }
                </td>
                <td class="artist-table-name">
                  <a href={"/artist/"+item.spotifyId}>{item.name}</a>
                </td>
                <td>
                  {item.totalListeningCount}
                </td>
                <td>
                  {millisecondsToReadableTime(item.totalListeningTime)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      </>
      // TODO: Scroll to top button
    )
  }

  return (
    <>
    <h1>Top Artists</h1>
    <div className="artist-results">{artistList && presentResults(artistList)}</div>
    </>
  )
}