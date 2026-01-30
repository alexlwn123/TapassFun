import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NostrProvider } from "./context/NostrContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { TokenDetailPage } from "./pages/TokenDetailPage";
import { MintPage } from "./pages/MintPage";

function App() {
  return (
    <NostrProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/token/:id" element={<TokenDetailPage />} />
            <Route path="/mint" element={<MintPage />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </NostrProvider>
  );
}

export default App;
