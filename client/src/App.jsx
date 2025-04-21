import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

// Pages
import Menu from "./pages/Menu";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Map from "./pages/Map";
import Report from './pages/Report';
import SuccessfullyCreated from "./pages/SuccessfullyCreated";

// Components
import Header from "./components/Header";
import FooterCom from "./components/Footer";
import Search from "./components/Search";

function AppWrapper() {
  const location = useLocation();
  const [mapState, setMapState] = useState("off");

  useEffect(() => {
    if (location.pathname === "/map") {
      setMapState("on");
      localStorage.setItem("mapState", "on");
    } else {
      setMapState("off");
      localStorage.setItem("mapState", "off"); // <-- ensure it's stored!
    }
  }, [location.pathname]);

  return (
    <>
      <Header />
      <Search />
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/map"
          element={
            <Map mapState={localStorage.getItem("mapState") || "off"} />
          }
        />
        <Route path="/report" element={<Report />} />
        <Route path="/successfullyCreated" element={<SuccessfullyCreated />} />
      </Routes>
      <FooterCom />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
