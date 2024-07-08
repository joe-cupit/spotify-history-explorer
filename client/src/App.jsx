import "./App.css";

import { Routes, Route } from 'react-router-dom';

// components
import { Navbar } from "./components/Navbar";

// pages
import { HomePage } from "./pages/home";
import { SearchPage } from "./pages/search";
import { OverviewPage } from "./pages/overview";

import { ArtistPage } from "./pages/individual/artist";
import { AlbumPage } from "./pages/individual/album";
import { TrackPage } from "./pages/individual/track";
import { ShowPage } from "./pages/individual/show";

import { NotFoundPage } from "./pages/notfound";


function App() {

  return (
    <>
      <Navbar />
      <main className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/search" element={<SearchPage />} />

          <Route path="/artists" element={<OverviewPage category={"artist"} />} />
          <Route path="/artist/:id" element={<ArtistPage />} />

          <Route path="/tracks" element={<OverviewPage category={"track"} />} />
          <Route path="/track/:id" element={<TrackPage />} />

          <Route path="/albums" element={<OverviewPage category={"album"} />} />
          <Route path="/album/:id" element={<AlbumPage />} />

          <Route path="/shows" element={<OverviewPage category={"show"} />} />
          <Route path="/show/:id" element={<ShowPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

    </>
  )
}

export default App;
