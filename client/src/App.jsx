import "./App.css";

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { NotFoundPage } from "./pages/notfound";
import { HomePage } from "./pages/home";
import { SearchPage } from "./pages/search";
import { ArtistPage } from "./pages/artist";
import { TrackPage } from "./pages/track";

import { TopTracksPage } from "./pages/toptracks";


function App() {

  return (
    <>
    <main className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/artist/" element={<SearchPage searchType='artist' />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/artist/:id/toptracks" element={<TopTracksPage />} />
          <Route path="/track/" element={<SearchPage searchType='track' />} />
          <Route path="/track/:id" element={<TrackPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>      
    </main>

    </>
  )
}

export default App;
