import { useMemo, useState, useEffect } from "react";
import "../css/Cart.css";
import { BackendURL } from "../Services/BackendURL";
import { useNavigate } from "react-router-dom";

interface cart {
  subtotal: number;
  items: CartItem[];
}

interface CartItem {
  id: number;
  cartId: number;
  restaurantId: number;
  restaurantName: string;
  foodCategoryId: number;
  foodCategoryName: string;
  foodItemId: number;
  foodItemName: string;
  quantity: number;
  unitPrice: number;
  imagePreview: string;
}
/*test*/
function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<cart>({ subtotal: 0, items: [] });

  useEffect(() => {
    fetchCartforUser();
  }, []);

  const fetchCartforUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        BackendURL + "/api/Cart/GetUserCart",

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
        alert("Failed to fetch Cart");
      }

      const data = await response.json();
      console.log("Fetched Cart:", data);
      setCart(data);
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Fetch cart completed");
    }
  };

  const ChangeQuntityoftheCartItem = async (item: CartItem, increaseQty: boolean) => {
  try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        BackendURL + "/api/Cart/ChangeQuntityoftheCartItem?CartItemId=" + item.id + "&increaseQty=" + increaseQty,

        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          }
         
        },
      );

      if (response.status === 401) {
        navigate("/SignIn");
        return;
      }

      if (!response.ok) {
        alert("Failed to update Cart");
      }

     if (response.ok) {
        fetchCartforUser();
      }
     
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Fetch cart completed");
    }
  };

  const increaseQty = async (item:CartItem) => {
    await ChangeQuntityoftheCartItem(item, true);
  };
  

  const decreaseQty = async(item: CartItem) => {
    await ChangeQuntityoftheCartItem(item, false);
  };

  const removeItem = async (item: CartItem) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        BackendURL + "/api/Cart/RemoveCartItem?CartItemId=" + item.id,

        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          }
         
        },
      );

      if (response.status === 401) {
        navigate("/SignIn");
        return;
      }

      if (!response.ok) {
        alert("Failed to update Cart");
      }

     if (response.ok) {
        fetchCartforUser();
      }
     
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Fetch cart completed");
    }
  };



  return (
    <div className="cart-page">
      <div className="cart-wrapper">
        <div className="cart-header">
          <h1>Your Cart</h1>
          <p>Review your order before checkout.</p>
        </div>

        <div className="cart-layout">
          <div className="cart-items-section">
            {cart == null ? (
              <div className="cart-empty">
                <h2>Your cart is empty</h2>
                <p>Add some delicious items from the menu.</p>
              </div>
            ) : (
              cart.items.map((item) => (
                <div className="cart-item-card" key={item.id}>
                  <div className="cart-item-image">
                    <img src={item.imagePreview} alt={item.foodItemName} />
                  </div>

                  <div className="cart-item-details">
                    <div className="cart-item-top">
                      <div>
                        <h3>{item.foodItemName}</h3>
                        <p className="cart-item-portion">
                          {item.foodCategoryName}
                        </p>
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item)}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="cart-item-bottom">
                      <span className="cart-item-price">
                        Rs. {item.unitPrice.toFixed(2)}
                      </span>

                      <div className="quantity-control">
                        <button onClick={() => decreaseQty(item)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increaseQty(item)}>+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="cart-summary-card">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs. {cart.subtotal.toLocaleString()}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total-row">
              <span>Total</span>
              <span>Rs. {cart.subtotal.toString()}</span>
            </div>

            <button className="checkout-btn" disabled={cart.items.length === 0}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
