import "./App.css";

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { NotFoundPage } from "./pages/notfound";
import { HomePage } from "./pages/home";
import { ArtistPage } from "./pages/artist";
import { TrackPage } from "./pages/track";


function App() {

  return (
    <>
    <main className="App-header">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/track/:id" element={<TrackPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>      
    </main>

    </>
  )
}

export default App;
