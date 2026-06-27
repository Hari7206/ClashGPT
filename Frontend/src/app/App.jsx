import { BrowserRouter } from "react-router-dom";
import AppRouter from "./AppRouter";
import { ChatProvider } from "../chat/context/chatContext.jsx";

function App() {
  return (
    <ChatProvider>
      <AppRouter />
    </ChatProvider>
  );
}

export default App;