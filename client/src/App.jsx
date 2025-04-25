import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

// Pages
import Menu from "./pages/Menu";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Report from './pages/Report';
import SuccessfullyCreated from "./pages/SuccessfullyCreated";
import Profile from "./pages/Profile";
import SearchPage from "./pages/SearchPage";
import Datasheet from "./pages/Datasheet";

// Components
import Header from "./components/Header";
import FooterCom from "./components/Footer";
import Search from "./components/Search";

//Settings Navbar

//No User
import ContactSupport from './components/noType/ContactSupport';
import HelpCenter from "./components/noType/HelpCenter";
import StartHere from './components/noType/StartHere'




//Public

//User

//Admin
import SubmittedPins from "./components/adminType/SubmittedPins";
import Database from "./components/adminType/Database";
import LogPage from "./components/adminType/LogPage";
import Analytics from "./components/adminType/Analytics";



function AppWrapper({ apiKey }) {
  const location = useLocation();
  const [mapState, setMapState] = useState("off");

  useEffect(() => {
    if (location.pathname === "/datasheets") {
      setMapState("on");
      localStorage.setItem("mapState", "on");
    } else {
      setMapState("off");
      localStorage.setItem("mapState", "off");
    }
  }, [location.pathname]);

  // Log mapState whenever it changes
  useEffect(() => {
    console.log("Map State:", mapState);
  }, [mapState]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
  <Header />
  <Search />
</div>
      <div className="pt-[125px]">
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/report" element={<Report />} />
        <Route path="/successfullyCreated" element={<SuccessfullyCreated />} />
        <Route path="/search" element={<SearchPage />} />
        <Route
          path="/datasheets"
          element={<Datasheet apiKey={apiKey} mapState={mapState} />}
        />


        {/* No Account */}
        <Route path="/settings" element={<Profile />} />
        <Route path="/contactSupport" element={<ContactSupport />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/startHere" element={<StartHere />} />

        {/* Public Account */}

        {/* User Account */}

        {/* Admin Account */}
        <Route path="/database" element={<Database />} />
        <Route path="/inbox" element={<SubmittedPins />} />
        <Route path="/logs" element={<LogPage />} />
        <Route path="/analytics" element={<Analytics />} />

        



      </Routes>
      </div>
      <div className="relative bottom-0 left-0 w-full z-50 bg-white shadow">
  <FooterCom />
</div>


    </>
  );
}


export default function App() {
  const apiKey = "AIzaSyA1wOqcLSGKkhNJQYP9wH06snRuvSJvRJY";

  return (
    <BrowserRouter>
      <AppWrapper apiKey={apiKey}/>
    </BrowserRouter>
  );
}
