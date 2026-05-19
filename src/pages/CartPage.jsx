import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import UserNavbar from "../components/UserNavbar";
import ConfirmModal from "../components/ConfirmModal";
import "../styles/CartPage.css";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const navigate = useNavigate();

  const showPopup = (msg, type) => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => setMessage(""), 2500);
  };

  const fetchCart = async () => {
    try {
      const res = await axiosInstance.get("/cart");
      setCart(res.data?.data || []);
    } catch (err) {
      showPopup("Failed to fetch cart", "error");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQty = async (item, type) => {
    const newQty = type === "inc" ? item.quantity + 1 : item.quantity - 1;

    if (newQty < 1) {
      showPopup("Quantity cannot be less than 1", "error");
      return;
    }

    try {
      await axiosInstance.put(`/cart/${item.id}`, {
        quantity: newQty,
      });

      fetchCart();
      showPopup("Quantity updated", "success");
    } catch (err) {
      showPopup("Update failed", "error");
    }
  };

  const removeItem = async (id) => {
    try {
      await axiosInstance.delete(`/cart/${id}`);
      fetchCart();
      showPopup("Item removed", "success");
    } catch (err) {
      showPopup("Remove failed", "error");
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      showPopup("Cart is empty", "error");
      return;
    }

    try {
      await axiosInstance.post("/orders", {
        address: "Hyderabad",
        cartItemIds: cart.map((i) => i.id),
      });

      setShowConfirm(false);
      showPopup("Order placed", "success");

      setTimeout(() => navigate("/user/orders"), 1500);
    } catch (err) {
      showPopup("Order failed", "error");
    }
  };

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="cart-page">
      <div className="cart-layout">
        <UserNavbar />

        <div className="cart-main">
          <h2 className="cart-title">My Cart</h2>

          {message && (
            <div className={`popup ${messageType}`}>
              {message}
            </div>
          )}

          {cart.length === 0 ? (
            <div className="empty">Cart is empty</div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className="cart-card">
                  <img src={item.imageUrl} className="cart-img" />

                  <div className="cart-info">
                    <h3>{item.productName}</h3>
                    <p className="sub">{item.subCategoryName}</p>

                    <p className="desc">{item.productDescription}</p>

                    <p className="price">₹ {item.price}</p>
                  </div>

                  <div className="qty">
                    <button onClick={() => updateQty(item, "dec")}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item, "inc")}>+</button>
                  </div>

                  <div className="total">
                    ₹ {item.price * item.quantity}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="summary">
                <h3>Total: ₹ {total}</h3>

                <button
                  className="place-order-btn"
                  onClick={() => setShowConfirm(true)}
                >
                  Place Order
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmModal
        show={showConfirm}
        message="Confirm order?"
        onYes={placeOrder}
        onNo={() => setShowConfirm(false)}
      />
    </div>
  );
}