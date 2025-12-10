import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import DrawRoom from "./pages/DrawRoom.jsx";

//main app component that handles routing between home and draw room pages
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:roomId" element={<DrawRoom />} />
    </Routes>
  );
}

export default App;
