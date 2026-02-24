import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Status from "./pages/Status";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container animate-fade-in">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/status" element={<Status />} />
        </Routes>
      </main>
    </div>
  );
}