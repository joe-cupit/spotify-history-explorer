import "../styles/components/StatsTitle.css";

import { formatMilliseconds } from "../utils/formatMilliseconds";
import { Link } from "react-router-dom";

import { RankBadge } from "./RankBadge";


export function StatsHeader({ imageURL, name, listened_ms, rank, artistIds, artistNames }) {

  return (
    <>

    <div className="stats-title">

      <div className="stats-title-image">
        {imageURL && <img src={imageURL} alt={name} />}
      </div>

      <span className="stats-title-content">
        {name ?
          <>
            <h1>{name}</h1>

            <span className="stats-title-about">
              {artistIds ?
                <h2>
                  by&nbsp;
                  {artistIds.map((artistId, index) => {
                    return (
                      <span key={index}>
                      <Link to={"/artist/"+artistId}>
                        {artistNames ? artistNames[index] : artistId}
                      </Link>
                      {index+1 < artistIds.length && <>,&nbsp;</>}
                      </span>
                    )
                  })}
                </h2>
               :
                <>
                  <span>Listened for <br /> {formatMilliseconds(listened_ms)}</span>

                  <span>
                    {rank
                      ? <Link to={"/artists?rank="+rank} className="stats-title-rank">
                          <RankBadge rank={rank} />
                        </Link>
                      : null
                    }
                  </span>
                </>
              }
            </span>
          </> :
          <>
            <h1>loading data...</h1>
          </>
        }
      </span>

    </div>

    </>
  )
}