// frontend/src/pages/ShoppingCart.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import { useOrders } from "../contexts/OrderContext";
import "../styles/ShoppingCart.css";
import emailjs from "@emailjs/browser";

// ────────────────────────────────────────────────────────────────────────────
type CartItem = ReturnType<typeof useCart>["cart"][number] & {
  /** optional discount (0–1).  e.g. 0.20 means 20 % off */
  discount?: number;
};

// util
const $ = (n: number) => n.toFixed(2);

// ────────────────────────────────────────────────────────────────────────────
export default function ShoppingCart() {
  const { cart, loading, removeFromCart, clearCart } = useCart();
  const { user }   = useUser();
  const { addOrder } = useOrders();
  const [msg, setMsg] = useState<string | null>(null);

  /* init EmailJS */
  useEffect(() => { emailjs.init("sLZQwIIbpMOy-EVnm"); }, []);

  /* auto-dismiss messages */
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 3000);
    return () => clearTimeout(t);
  }, [msg]);

  /* ───── helpers ───── */
  const subtotal = () =>
    cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const cardOK = () => true;               // (omitted for brevity)

  /* ───── checkout (unchanged) ───── */
  const checkout = async () => { /* … */ };

  /* ───── render ───── */
  if (loading) return <div className="shopping-cart">Loading cart…</div>;

  return (
    <div className="shopping-cart">
      <h2>Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.map((raw) => {
              const i = raw as CartItem;

              // derive original price & % off
              const pctOff = i.discount && i.discount > 0 ? i.discount : 0;
              const original = pctOff ? i.price / (1 - pctOff) : undefined;

              return (
                <li key={i.productId}>
                  <img src={i.image} alt={i.name} className="cart-item-img" />
                  <span className="cart-name">{i.name}</span>

                  {pctOff ? (
                    <>
                      <span className="cart-price-discounted">
                        ${$(i.price)}
                      </span>
                      <span className="cart-price-original">
                        ${$(original!)}
                      </span>
                      <span className="cart-discount-badge">
                        –{Math.round(pctOff * 100)}%
                      </span>
                    </>
                  ) : (
                    <span className="cart-price">${$(i.price)}</span>
                  )}

                  <span style={{ margin: "0 6px" }}>× {i.quantity}</span>

                  <button onClick={() => removeFromCart(i.productId)}>
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>

          <h3>Total: ${$(subtotal())}</h3>
          <button className="checkout-button" onClick={checkout}>
            Proceed to Checkout
          </button>
        </>
      )}

      {msg && <div className="purchase-message">{msg}</div>}
    </div>
  );
}