
import { Routes, Route } from "react-router-dom";
import Home from "../chat/pages/Home.jsx"


function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default AppRouter;