import "./App.css";

import { Routes, Route } from 'react-router-dom';

import { Navbar } from "./components/Navbar";

import { HomePage } from "./pages/home";
import { SearchPage } from "./pages/search";

import { ArtistPage } from "./pages/artist";
import { ArtistsPage } from "./pages/artists";

import { TrackPage } from "./pages/track";
import { TracksPage } from "./pages/tracks";

import { AlbumsPage } from "./pages/albums";
import { ShowsPage } from "./pages/shows";

import { NotFoundPage } from "./pages/notfound";



function App() {

  return (
    <>
      <Navbar />
      <main className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/artist" element={<SearchPage searchType='artist' />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />

          <Route path="/track" element={<SearchPage searchType='track' />} />
          <Route path="/tracks" element={<TracksPage />} />
          <Route path="/track/:id" element={<TrackPage />} />

          <Route path="/albums" element={<AlbumsPage />} />

          <Route path="/shows" element={<ShowsPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

    </>
  )
}

export default App;
