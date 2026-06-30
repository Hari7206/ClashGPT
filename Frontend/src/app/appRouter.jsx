import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../chat/pages/Home.jsx";
import { Login } from "../auth/pages/Login.jsx";
import { Register } from "../auth/pages/Register.jsx";
import { VerifyEmail } from "../auth/pages/VerifyEmail.jsx";

import HelpSupport from "../chat/pages/HelpSupport.jsx";
import Terms from "../chat/pages/Terms.jsx";
import Privacy from "../chat/pages/Privacy.jsx";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/help-support" element={<HelpSupport />} /> 
        <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

    </Routes>
  );
}

export default AppRouter;