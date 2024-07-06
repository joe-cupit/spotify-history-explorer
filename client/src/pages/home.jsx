import React from "react";

import { Link } from "react-router-dom";


export function HomePage() {

  return (
    <>
    <h1>Spotify Stats Homepage</h1>
    <p><Link to="/artist">Search for an artist</Link> <Link to="/track">Search for an song</Link></p>
    </>
  );
}