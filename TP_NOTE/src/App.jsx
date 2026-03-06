import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Meteo from "./pages/Meteo";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meteo" element={<Meteo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
