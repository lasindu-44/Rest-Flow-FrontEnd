import { useMemo, useState } from "react";

import "../css/Cart.css";

interface CartItem {
  id: number;
  name: string;
  price: number;
  portion: string;
  image: string;
  quantity: number;
}
/*test*/
function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Chicken Spring Rolls",
      price: 850,
      portion: "4 pcs",
      image:
        "https://static.where-e.com/Sri_Lanka/Western_Province/Pizza-Hut-Kotikawatta_6b7a0b10a792a53ae21fe6cd7cd43e4d.jpg",
      quantity: 1,
    },
    {
      id: 2,
      name: "Garlic Bread",
      price: 600,
      portion: "6 slices",
      image:
        "https://static.where-e.com/Sri_Lanka/Western_Province/Pizza-Hut-Kotikawatta_6b7a0b10a792a53ae21fe6cd7cd43e4d.jpg",
      quantity: 2,
    },
    {
      id: 3,
      name: "Iced Coffee",
      price: 700,
      portion: "350ml",
      image:
        "https://static.where-e.com/Sri_Lanka/Western_Province/Pizza-Hut-Kotikawatta_6b7a0b10a792a53ae21fe6cd7cd43e4d.jpg",
      quantity: 1,
    },
  ]);

  const increaseQty = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const deliveryFee = cartItems.length > 0 ? 250 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="cart-page">
      <div className="cart-wrapper">
        <div className="cart-header">
          <h1>Your Cart</h1>
          <p>Review your order before checkout.</p>
        </div>

        <div className="cart-layout">
          <div className="cart-items-section">
            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <h2>Your cart is empty</h2>
                <p>Add some delicious items from the menu.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div className="cart-item-card" key={item.id}>
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="cart-item-details">
                    <div className="cart-item-top">
                      <div>
                        <h3>{item.name}</h3>
                        <p className="cart-item-portion">{item.portion}</p>
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="cart-item-bottom">
                      <span className="cart-item-price">
                        Rs. {item.price.toLocaleString()}
                      </span>

                      <div className="quantity-control">
                        <button onClick={() => decreaseQty(item.id)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increaseQty(item.id)}>+</button>
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
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>Rs. {deliveryFee.toLocaleString()}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total-row">
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>

            <button
              className="checkout-btn"
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;