import { useState } from "react";
import "../css/RestaurantMenu.css";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  portion: string;
}

interface MenuCategory {
  category: string;
  items: MenuItem[];
}

function RestaurantMenu() {
  const navigate = useNavigate();
  const restaurantName = "Spice Garden Restaurant";

  const menuData: MenuCategory[] = [
    {
      category: "Starters",
      items: [
        {
          id: 1,
          name: "Chicken Spring Rolls",
          description:
            "Crispy golden rolls filled with seasoned chicken and vegetables.",
          price: 850,
          portion: "4 pcs",
        },
        {
          id: 2,
          name: "Garlic Bread",
          description: "Toasted bread with garlic butter and herbs.",
          price: 600,
          portion: "6 slices",
        },
        {
          id: 3,
          name: "Garlic Bread",
          description: "Toasted bread with garlic butter and herbs.",
          price: 600,
          portion: "6 slices",
        },
        {
          id: 4,
          name: "Garlic Bread",
          description: "Toasted bread with garlic butter and herbs.",
          price: 600,
          portion: "6 slices",
        },
        {
          id: 5,
          name: "Garlic Bread",
          description: "Toasted bread with garlic butter and herbs.",
          price: 600,
          portion: "6 slices",
        },
        {
          id: 6,
          name: "Garlic Bread",
          description: "Toasted bread with garlic butter and herbs.",
          price: 600,
          portion: "6 slices",
        },
      ],
    },
    {
      category: "Main Course",
      items: [
        {
          id: 3,
          name: "Grilled Chicken Burger",
          description:
            "Juicy grilled chicken burger with lettuce, tomato, and special sauce.",
          price: 1450,
          portion: "1 serving",
        },
        {
          id: 4,
          name: "Seafood Pasta",
          description: "Creamy pasta with prawns, squid, and herbs.",
          price: 1950,
          portion: "1 plate",
        },
        {
          id: 5,
          name: "Chicken Fried Rice",
          description:
            "Wok-tossed fried rice with chicken, egg, and vegetables.",
          price: 1250,
          portion: "1 plate",
        },
      ],
    },
    {
      category: "Desserts",
      items: [
        {
          id: 6,
          name: "Chocolate Lava Cake",
          description: "Warm chocolate cake with a soft molten center.",
          price: 950,
          portion: "1 piece",
        },
        {
          id: 7,
          name: "Vanilla Ice Cream",
          description: "Classic creamy vanilla ice cream served chilled.",
          price: 500,
          portion: "2 scoops",
        },
      ],
    },
    {
      category: "Beverages",
      items: [
        {
          id: 8,
          name: "Fresh Lime Juice",
          description: "Refreshing lime juice served cold.",
          price: 450,
          portion: "300ml",
        },
        {
          id: 9,
          name: "Iced Coffee",
          description: "Cold brewed coffee with milk and ice.",
          price: 700,
          portion: "350ml",
        },
      ],
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>(
    menuData[0].category,
  );
  const [cart, setCart] = useState<MenuItem[]>([]);

  const selectedMenu = menuData.find(
    (menu) => menu.category === selectedCategory,
  );

  const handleAddToCart = (item: MenuItem) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  return (
    <div className="restaurant-menu-page">
      <div className="restaurant-menu-wrapper">
        <div className="restaurant-menu-header">
          <h1>{restaurantName}</h1>
          <p>Explore our delicious menu and add your favourites to cart.</p>
        </div>

        <div className="category-tabs">
          {menuData.map((menu) => (
            <button
              key={menu.category}
              className={`category-tab ${selectedCategory === menu.category ? "active" : ""}`}
              onClick={() => setSelectedCategory(menu.category)}
            >
              {menu.category}
            </button>
          ))}
        </div>

        <div className="menu-items-grid">
          {selectedMenu?.items.map((item) => (
            <div className="menu-card" key={item.id}>
              <div className="menu-card-content">
                <div className="menu-card-top">
                  <h3>{item.name}</h3>
                  <span className="menu-price">
                    Rs. {item.price.toLocaleString()}
                  </span>
                </div>

                <p className="menu-description">{item.description}</p>

                <div className="menu-meta">
                  <span className="portion-badge">{item.portion}</span>
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
