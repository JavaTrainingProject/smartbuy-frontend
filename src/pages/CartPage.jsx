import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

import Header from "../components/Header";
import Footer from "../components/Footer";
import UserNavbar from "../components/UserNavbar";
import ConfirmModal from "../components/ConfirmModal";

import "../styles/CartPage.css";

export default function CartPage() {

  const [cart, setCart] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  // ================= FETCH CART =================
  const fetchCart = async () => {
    try {
      const res = await axiosInstance.get("/cart");
      setCart(res.data?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ================= UPDATE QUANTITY =================
  const updateQty = async (item, type) => {

    const newQty =
      type === "inc"
        ? item.quantity + 1
        : item.quantity - 1;

    if (newQty < 1) return;

    try {

      await axiosInstance.put(`/cart/${item.id}`, {
        quantity: newQty,
      });

      fetchCart();

    } catch (err) {
      console.log(err);
    }
  };

  // ================= REMOVE ITEM =================
  const removeItem = async (id) => {

    try {

      await axiosInstance.delete(`/cart/${id}`);
      fetchCart();

    } catch (err) {
      console.log(err);
    }
  };

  // ================= PLACE ORDER =================
  const placeOrder = async () => {

    try {

      await axiosInstance.post("/orders", {
        address: "Default Address",
      });

      setShowConfirm(false);
      setCart([]);

      setSuccessMessage("Order placed successfully!");

      setTimeout(() => {
        setSuccessMessage("");
        navigate("/orders");
      }, 1200);

    } catch (err) {

      console.log(err);
      setSuccessMessage("Order failed!");

    }
  };

  // ================= TOTAL =================
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (

    <div className="cart-page">

      <Header />

      <div className="cart-layout">

        <UserNavbar />

        <div className="cart-main">

          <h2>🛒 My Cart</h2>

          {successMessage && (
            <div className="success-msg">
              {successMessage}
            </div>
          )}

          {cart.length === 0 ? (

            <div className="empty-cart">
              Your cart is empty
            </div>

          ) : (

            <>
              {cart.map((item) => (

                <div key={item.id} className="cart-card">

                  {/* IMAGE */}
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="cart-image"
                  />

                  {/* PRODUCT INFO */}
                  <div className="cart-info">

                    <h3>{item.productName}</h3>

                    <p className="price">
                      ₹ {item.price}
                    </p>

                  </div>

                  {/* QUANTITY */}
                  <div className="qty-box">

                    <button
                      onClick={() => updateQty(item, "dec")}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => updateQty(item, "inc")}
                    >
                      +
                    </button>

                  </div>

                  {/* TOTAL */}
                  <div className="item-total">
                    ₹ {item.price * item.quantity}
                  </div>

                  {/* REMOVE */}
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>

                </div>
              ))}

              {/* SUMMARY */}
              <div className="cart-summary">

                <h3>Total: ₹ {total}</h3>

                <button
                  className="order-btn"
                  onClick={() => setShowConfirm(true)}
                >
                  Place Order
                </button>

              </div>
            </>
          )}

        </div>
      </div>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        show={showConfirm}
        message="Are you sure you want to place the order?"
        onYes={placeOrder}
        onNo={() => setShowConfirm(false)}
      />

      <Footer />

    </div>
  );
}