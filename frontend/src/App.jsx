import { BrowserRouter, Routes, Route } from "react-router-dom";

import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Home from "./pages/Home";
import VideoPlayer from "./pages/VideoPlayer";
import Profile from "./pages/Profile";
import CreateVideo from "./pages/CreateVideo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/video/:id" element={<VideoPlayer />} />
        <Route path="/create-video" element={<CreateVideo />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;