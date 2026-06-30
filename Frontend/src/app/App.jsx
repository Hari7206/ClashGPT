// app/App.jsx
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./AppRouter";
import { ChatProvider } from "../chat/context/chatContext.jsx";
import { AuthProvider } from "../auth/context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <AppRouter />
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App; // ✅ Make sure this export exists