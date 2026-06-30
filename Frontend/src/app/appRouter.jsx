import { Routes, Route } from "react-router-dom";
import Home from "../chat/pages/Home.jsx";
import { Login } from "../auth/pages/Login.jsx";
import { Register } from "../auth/pages/Register.jsx";
import { VerifyEmail } from "../auth/pages/VerifyEmail.jsx";



function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={< VerifyEmail/>} />
    </Routes>
  );
}

export default AppRouter;