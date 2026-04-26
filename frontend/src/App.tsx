import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Verify from "./pages/Verify";
import MyDiploma from "./pages/MyDiploma";
import Issuer from "./pages/Issuer";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="verify" element={<Verify />} />
        <Route path="my-diploma" element={<MyDiploma />} />
        <Route path="issuer" element={<Issuer />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}
