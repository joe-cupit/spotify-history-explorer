import "../styles/components/BasicTopList.css"

import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { TimeProgressBar } from "./TimeProgressBar";

import spotifyLogo from "../assets/spotifyLogo.png"


export function BasicTopList({ link, type, topList }) {

  const [limit, setLimit] = useState(5);

  const [serachParams, setSearchParams] = useSearchParams();
  const rank = parseInt(serachParams.get('rank'));

  useEffect(() => {
    if (rank) {
      setLimit((Math.ceil(rank/5))*5);
    } else {
      setLimit(5);
    }
  }, [rank, link, type])

  useEffect(() => {
    setTimeout(scrollTo, 100);
  }, [type]);

  useEffect(() => {
    if (topList && type === 'album') {
      setLimit(topList?.length)
    }
  }, [topList, type]);


  let longestListen = 0;
  if (topList) {
    Object.values(topList).map(k => {
      longestListen = Math.max(longestListen, k.totalListeningTime);
      return 0;
    })
  }


  const changeLimit = function(change) {
    setLimit(limit+change);

    serachParams.delete('rank');
    setSearchParams(serachParams);

    setTimeout(scrollTo, 50);
  }

  const scrollTo = function () {
    const element = document.getElementById("view-more");
    element?.scrollIntoView({
      behavior: 'smooth',
    });
  }


  return (
    <>
    <div className="top-list">
      <ul>{topList
        ? topList.slice(0, limit).map((item, index) => {
          return (
            <ItemCard
              item={item}
              link={link}
              type={type}
              longestListen={longestListen}
              active={(rank === (index+1))}

              onClick={() => {setSearchParams({'rank': index+1})}}

              key={index}
            />
          )
          })
        : [...Array(limit)].map((_, i) => <ItemCard key={i} />)
      }</ul>
      {topList && type !== 'album' &&
        <div className="view-control">
          <span id="view-less" onClick={() => {changeLimit(-5)}} style={limit > 5 ? {} : {visibility: 'hidden'}}>
            view less
          </span>
          <span id="view-more" onClick={() => {changeLimit(+5)}} style={limit <= topList?.length ? {} : {visibility: 'hidden'}}>
            view more
          </span>
        </div>
      }

    </div>
    </>
  )
}


function ItemCard({ item, link, type, longestListen, active, onClick }) {
  
  return (
    <li className={ active ? "top-list-card selected-item" : "top-list-card" }>

      {item ?
      <>
        <span className="top-list-stats">
          {type !== 'album' &&
          <Link
            to={`https://open.spotify.com/${link}/${item.spotifyId}`}
            target="_blank"
            className="top-list-image-link">
              <img className="spotify-logo-img" loading="lazy" src={spotifyLogo} alt='Spotify Logo' />
              <div className="top-list-image">
                <img loading="lazy" src={item.imageURL} alt={item.name} />
              </div>
          </Link>            
          }


          <span>
            <Link to={`/${link}/${item.spotifyId}`}>
              <h1 onClick={onClick}>{item.name}</h1>
            </Link>
            {['album', 'track'].includes(link) && type === 'overview' &&
            <>
              <span className="top-list-to-hide">&nbsp;•&nbsp;</span>
              <h3>
                <Link to={`/artist/${item.artistIds?.[0]}`}>
                  {item.artistNames?.[0]}
                </Link>
              </h3>
            </>
              }
            <br className="top-list-to-hide"/>

            <span className="top-list-card-extra-stats top-list-to-hide">
              {item.totalListeningCount} total listen{item.totalListeningCount !== 1 && "s"} ({item.skippedCount} skipped)
            </span>
          </span>
        </span>

        <TimeProgressBar time={item.totalListeningTime} maxTime={longestListen} />
      </>
      :
      <>
        <span className="top-list-stats">
          <div className="top-list-image"></div>
        </span>
      </>
      }
      
    </li>
  )
}
