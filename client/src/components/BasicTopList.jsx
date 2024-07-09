import "./BasicTopList.css"

import { Link, useSearchParams } from "react-router-dom";

import { TimeProgressBar } from "./TimeProgressBar";


export function BasicTopList({ type, limit, topList, rank }) {

  const [serachParams, setSearchParams] = useSearchParams();

  rank = parseInt(rank);

  return (
    <>
    <div className="top-list">
      <ul>
        {topList
          ? topList.slice(0, limit).map((item, index) => {
            return (
              <ItemCard
                item={item}
                type={type}
                longestListen={topList[0].totalListeningTime}
                active={(rank === (index+1))}

                onClick={() => {setSearchParams({'rank': index+1})}}

                key={index}
              />
            )
            })
          : [...Array(limit)].map((_, i) => <ItemCard key={i} />)
        }
      </ul>
    </div>
    </>
  )
}


function ItemCard({ item, type, longestListen, active, onClick }) {
  
  return (
    <li className={ active ? "selected-item" : "" }>

      {item ?
      <>
        <span className="top-list-stats">
          <Link
            to={`https://open.spotify.com/${type}/${item.spotifyId}`}
            target="_blank">
              <div className="top-list-image">
                <img src={item.imageURL} alt={item.name} />
              </div>
          </Link>

          <span>
            <Link to={`/${type}/${item.spotifyId}`}>
              <h1 onClick={onClick}>{item.name}</h1>
            </Link>
            <br/>

            {/* {type === 'track' &&
            <>
              by <Link to={`/artist/${item.artists[0]}`}><h2>{item.artists[0]}</h2></Link>
              <br/>
            </>} */}

            <span>
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
