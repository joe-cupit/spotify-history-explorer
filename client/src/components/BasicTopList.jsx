import "./BasicTopList.css"

import { Link } from "react-router-dom";
import { TimeProgressBar } from "./TimeProgressBar";


export function BasicTopList({ type, limit, topList }) {

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

                key={index}
              />
            )
            })
          : [...Array(limit)].map((_, i) => <ItemCard key={i} />)
        }
      </ul>

      {/* <div className="view-all">
        {limit ? <Link to={`/${type}s/all`}>view more...</Link> : null}
      </div> */}
    </div>
    </>
  )
}


function ItemCard({ item, type, longestListen }) {
  return (
    <li>

      {item ?
      <>
        <span className="top-list-stats">
          <div className="top-list-image">
            <img src={item.imageURL} alt={item.name} />
          </div>

          <span>
            <Link to={`/${type}/${item.spotifyId}`}>{item.name}</Link>
            <br/>
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
