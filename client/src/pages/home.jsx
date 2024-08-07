import "../styles/pages/home.css"

import { useEffect, useState } from "react";
import { Link } from "react-router-dom"

import { formatMilliseconds } from "../utils/formatMilliseconds";


export function HomePage() {

  const [totalListeningTime, setTotalListeningTime] = useState(null);
  useEffect(() => {
    fetch('/api/homepage')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTotalListeningTime(data.totalTime);
      });
  }, []);


  return (
    <>
    <div>
      <h1>Spotify Stats Homepage</h1>
      <div className="homepage">
        <span>
          You've listened to Spotify for <h1>{formatMilliseconds(totalListeningTime)}</h1> total<br/>
        </span>

        <TopSection type={'artist'} />
        <TopSection type={'album'} />
        <TopSection type={'track'} />


        {/* Thats {timeToDaysWeeksYears(totalListeningTime).map((time, index) => {
          return (<p>{time}</p>)
        })} */}
      </div>      
    </div>

    </>
  );
}


function TopSection({ type }) {

  const [topArtists, setTopArtists] = useState(null);
  useEffect(() => {
    fetch(`/api/${type}/toplist/6`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTopArtists(data);
      });
  }, [type]);

  return (
    <div className={"homepage-top-section"}>
      <span>
        <h2>{"Top "+capitalise(type)+"s"}</h2>
        <br/>
        {"Your top "+type+"s of all time"}
      </span>
      {/* <div className={type === "track" ? "homepage-top-cards homepage-top-cards--track" : "homepage-top-cards"}> */}
      <div className="homepage-top-cards">
        {topArtists && topArtists.map((artist, index) => {
          return <ResultCard key={index} item={artist} type={type} />
        })}
        <Link to={`/${type}s`} className="homepage-top-card-viewmore">
          <h2>View all...</h2>
        </Link>
      </div>
    </div>
  )
}


function ResultCard({ item, type }) {
  return (
    <Link to={item && `/${type}/${item.spotifyId}`} className={type === "artist" ? "homepage-top-card homepage-top-card--artist" : "homepage-top-card"}>
      <div className="homepage-top-card-underlay"></div>

      <div className="homepage-top-card-overlay">
        <div className={type==="artist" ? "homepage-top-card-image homepage-artist-image" : "homepage-top-card-image"}>
          {<img src={item.imageURL} alt={item.name} />}
        </div>

        <span className="homepage-top-card-name">
          {item?.name}
        </span>
        {item?.artistNames && 
        <>
          <span className="homepage-top-card-secondary">
            {item?.artistNames?.[0]}
          </span>
        </>
        }
      </div>
    </Link>
  )
}


function capitalise(string) {
  return string[0].toUpperCase() + string.slice(1)
}
