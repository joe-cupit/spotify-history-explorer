import "./BasicTopList.css"

import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { TimeProgressBar } from "./TimeProgressBar";


export function BasicTopList({ type, limit }) {

  const [topList, setTopList] = useState(null);

  useEffect(() => {
    fetch(`/api/toplist/${type}/${limit}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTopList(data);
      });
  }, [type, limit]);


  return (
    <>
    <div className="top-list">
      <ul>
        {topList
          ? topList.map((item, index) => {
            return (
              <ArtistCard
                item={item}
                type={type}
                longestListen={topList[0].totalListeningTime}

                key={index}
              />
            )
            })
          : ""
        }
      </ul>
    </div>
    <span>
      {limit ? <Link to={`/${type}s/all`} className="view-all">view more...</Link> : null}
    </span>
    </>
  )
}


function ArtistCard({ item, type, longestListen }) {
  return (
    <>
    <li>
      <span className="top-list-stats">
        <img src={item.imageURL} alt={item.name} />

        <span>
          <Link to={`/${type}/${item.spotifyId}`}>{item.name}</Link>
          <br/>
          <span>
            {item.totalListeningCount} total listens 
            ({item.skippedCount} skipped)
          </span>
        </span>
      </span>

      <TimeProgressBar time={item.totalListeningTime} maxTime={longestListen} />

    </li>
    </>
  )
}
