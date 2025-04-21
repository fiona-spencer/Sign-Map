//Page Directory

import { BrowserRouter, Routes, Route } from "react-router-dom"

//Pages
import Menu from "./pages/Menu"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"


//Components
import Header from "./components/Header"
import FooterCom from "./components/Footer"
import Search from "./components/Search"

export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Search/>
      <Routes>
        <Route path="/" element={<Menu/>}/>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>
      </Routes>
      <FooterCom/>
    </BrowserRouter>
  )
}