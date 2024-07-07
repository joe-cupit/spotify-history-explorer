import "./artists.css"

import { BasicTopList } from "../components/BasicTopList"

import { Routes, Route } from 'react-router-dom';


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
  return (
    <>
      <div className="top-artists">
        <h1>Your Top Artists</h1>
        <BasicTopList type={"artist"} limit={8} />
      </div>
      <div className="other-stats">
        <h1>Other Stats</h1>
        <p>Top artist: asd;fkjlaei</p>
      </div>
    </>
  )
}


function AllPage() {

  return (
    <div className="top-artists">
      <h1>Your Top Artists</h1>
      <BasicTopList type={"artist"} limit={100} />      
    </div>
  )
}
