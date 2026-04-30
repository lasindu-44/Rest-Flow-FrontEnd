import { useState, useMemo, useEffect } from "react";
import "../css/RestaurantMenu.css";
import { useLocation, useNavigate } from "react-router-dom";
import { BackendURL } from "../Services/BackendURL";
import Swal from "sweetalert2";

interface CartItem {
  FoodItemId: number;
  RestaurantId: number;
  FoodCategoryId: number;
  UnitPrice: number;
  Quantity :number;
}

interface FoodCategory {
  categoryId: number;
  restaurantId: number;
  categoryName: string;
}
interface FoodItem {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  prepTime: string;
  available: boolean;
  imagePreview: string;
}

interface MenuCategory {
  category: FoodCategory;
  items: FoodItem[];
}

function RestaurantMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const restaurantName = "Spice Garden Restaurant";
  const [menuData, setMenuData] = useState<MenuCategory[]>([]);
  const restaurant = location.state;
  console.log("Received restaurant data:", restaurant);

  useEffect(() => {
    fetchMenuCategories();
  }, []);

  const fetchMenuCategories = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        BackendURL +
          "/api/Restaurant/fetchAllMenuItems?RestId=" +
          restaurant.id,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 401) {
        navigate("/SignIn");
        return;
      }

      if (!response.ok) {
        alert("Failed to fetch Menu Categories");
      }

      const data = await response.json();
      console.log("Fetched Menu Categories:", data);
      setMenuData(data);
      setSelectedCategory(data[0]?.category || {});
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Fetch menu categories completed");
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>(
    menuData[0]?.category || {},
  );
  const [cart, setCart] = useState<FoodItem[]>([]);

  const selectedMenu = useMemo(() => {
    const result = menuData.find(
      (menu) => menu.category.categoryId === selectedCategory.categoryId,
    );

    console.log("selectedMenu:", result);
    return result;
  }, [selectedCategory, menuData]);

  const handleAddToCart = async (item: FoodItem) => {
    console.log("Adding to cart:", item);
    const newCartItem: CartItem = {
      FoodItemId: item.id,
      RestaurantId: restaurant.id,
      FoodCategoryId: item.categoryId,
      UnitPrice: item.price,
      Quantity: 1,
    };
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(BackendURL + "/api/Cart/AddtoCart", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCartItem),
      });

      if (response.status === 401) {
        navigate("/SignIn");
        return;
      }

      if (!response.ok) {
        Swal.fire("Error", "Failed to Add to Cart", "error");
      }

      if (response.ok) {
        Swal.fire("Success", "Item added to cart!", "success");
      setCart((prevCart) => [...prevCart, item]);

      }
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Add to cart process completed");
    }
  };

  return (
    <div className="restaurant-menu-page">
      <div className="restaurant-menu-wrapper">
        <div className="restaurant-menu-header">
          <h1>{restaurant.name}</h1>
          <p>Explore our delicious menu and add your favourites to cart.</p>
        </div>

        <div className="category-tabs">
          {menuData.map((menu) => (
            <button
              key={menu.category.categoryId}
              className={`category-tab ${selectedCategory === menu.category ? "active" : ""}`}
              onClick={() => setSelectedCategory(menu.category)}
            >
              {menu.category.categoryName}
            </button>
          ))}
        </div>

        <div className="menu-items-grid">
          {selectedMenu?.items.map((item) => (
            <div className="menu-card" key={item.id}>
              {/* ✅ Image section */}
              {item.imagePreview && (
                <div className="menukk-image-wrapper">
                  <img
                    src={item.imagePreview}
                    alt={item.name}
                    className="menukk-image"
                  />
                </div>
              )}
              <div className="menu-card-content">
                <div className="menu-card-top">
                  <h3>{item.name}</h3>
                  <span className="menu-price">
                    Rs. {item.price.toLocaleString()}
                  </span>
                </div>

                <p className="menu-description">{item.description}</p>

                <div className="menu-meta">
                  <span className="portion-badge">
                    Time To Prepare: {item.prepTime}
                  </span>
                </div>

                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cart-summary">
        <div>
          <h2>Cart</h2>
          <p>{cart.length} item(s) added</p>
        </div>
        <button className="cart-view-btn" onClick={() => navigate("/cart")}>
          View Cart
        </button>
      </div>
    </div>
  );
}

export default RestaurantMenu;
