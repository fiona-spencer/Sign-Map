//Page Directory

import { BrowserRouter, Routes, Route } from "react-router-dom"

//Pages
import Menu from "./pages/Menu"


//Components
import Header from "./components/Header"
import Footer from "./components/Footer"

export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Menu/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}