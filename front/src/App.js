import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CreateItemPage from "./pages/CreateItemPage";
import SearchPage from "./pages/SearchPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<CreateItemPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
