import "./artists.css"

import { useEffect, useState } from "react";
import { Routes, Route } from 'react-router-dom';

import { BasicTopList } from "../components/BasicTopList"


export function ArtistsPage() {

  return (
    <>
      <div className="artist-page-container">
        <Routes>
          <Route path="/" element={<BasicPage />} />
          <Route path="/all" element={<AllPage />} />
        </Routes>      
      </div>
    </>
  )
}


function BasicPage() {
  const limit = 5;

  const [topList, setTopList] = useState(null);

  useEffect(() => {
    fetch(`/api/toplist/artist/${limit}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTopList(data);
      });
  }, []);

  return (
    <>
      <div className="top-artists">
        <h1>Your Top Artists</h1>
        <BasicTopList
          type={"artist"}
          limit={limit}
          topList={topList}
        />
      </div>
      <div className="other-stats">
        <h1>Other Stats</h1>
        <p>Top artist: asd;fkjlaei</p>
      </div>
    </>
  )
}


function AllPage() {
  const limit = 100;

  const [topList, setTopList] = useState(null);

  useEffect(() => {
    fetch(`/api/toplist/artist/${limit}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTopList(data);
      });
  }, []);

  return (
    <div className="top-artists">
      <h1>Your Top Artists</h1>
      <BasicTopList
          type={"artist"}
          limit={limit}
          topList={topList}
        />
    </div>
  )
}
