import Navbar from "./components/NavBar";
import Favorite from "./Pages/Favourite";
import Home from "./Pages/Home";
import { Routes, Route, useLocation } from "react-router-dom";
import "./css/App.css"
import Login from "./Pages/Login";
import SignUp from "./components/SignUpCard";
import RestaurantMenu from "./Pages/RestaurantMenu";
import Cart from "./components/Cart";
import TestTailwind from "./Pages/test";
import FoodOrderAdminMasterUI from "./Pages/MenuManagment";
import RestaurantUserAssign from "./Pages/AsignKitchenStaff";

import MenuItemsTable from "./Pages/MenuItem";




function App() {
  const location = useLocation();
console.log("Current path:", location.pathname);
  const hideNavbarRoutes = ["/signin", "/signup"];
   
  return (
    <div>
      {!hideNavbarRoutes.includes(location.pathname.toLocaleLowerCase()) && <Navbar></Navbar>}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorite />} />
          <Route path="/SignIn" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/Menu" element={<RestaurantMenu />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/test" element={<TestTailwind />} />
          <Route path="/MenuManagement/:restaurantId" element={<FoodOrderAdminMasterUI />} />
          <Route path="/MenuItem/:categoryId/:restaurantId" element={<MenuItemsTable />} />
          <Route path="/AsignStaff" element={<RestaurantUserAssign />} />


        </Routes>
      </main>
    </div>
  );
}

export default App;
