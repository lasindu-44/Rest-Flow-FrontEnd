import Navbar from "./components/NavBar";
import Favorite from "./Pages/Favourite";
import Home from "./Pages/Home";
import { Routes, Route } from "react-router-dom";
import "./css/App.css"
import Login from "./Pages/Login";
import SignUp from "./components/SignUpCard";
import RestaurantMenu from "./Pages/RestaurantMenu";
import Cart from "./components/Cart";
import TestTailwind from "./Pages/test";




function App() {

   
  return (
    <div>
      <Navbar></Navbar>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorite />} />
          <Route path="/SignIn" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/Menu" element={<RestaurantMenu />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/test" element={<TestTailwind />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
