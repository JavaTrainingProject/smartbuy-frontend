import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";

import Header from "../components/Header";
import Footer from "../components/Footer";
import UserNavbar from "../components/UserNavbar";

import "../styles/OrderPage.css";

export default function OrderPage() {

  const [orders, setOrders] = useState([]);

  // ================= FETCH ORDERS =================
  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const res = await axiosInstance.get("/orders");
        setOrders(res.data?.data || []);

      } catch (err) {
        console.log(err);
      }
    };

    fetchOrders();

  }, []);

  return (

    <div className="order-page">

      <Header />

      <div className="order-layout">

        {/* SIDEBAR */}
        <UserNavbar />

        {/* MAIN */}
        <div className="order-main">

          <h2>🧾 My Orders</h2>

          <div className="order-content-wrapper">

            {orders.length === 0 ? (

              <p>No orders found</p>

            ) : (

              orders.map((order) => (

                <div
                  key={order.orderId}
                  className="order-card"
                >

                  {/* TOP */}
                  <div className="order-top">

                    <h3>
                      Order Id {order.orderId}
                    </h3>

                    <span className="status">
                      {order.status}
                    </span>

                  </div>

                  {/* ITEMS */}
                  <div className="order-items">

                    {order.items.map((item, i) => (

                      <div
                        key={i}
                        className="order-item"
                      >

                        {/* IMAGE */}
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="order-image"
                        />

                        {/* INFO */}
                        <div>

                          <h4>{item.productName}</h4>

                          <p>
                            Quantity: {item.quantity}
                          </p>

                          <p>
                            ₹ {item.price}
                          </p>

                        </div>

                      </div>
                    ))}
                  </div>

                  {/* TOTAL */}
                  <div className="order-total">
                    Total: ₹ {order.totalAmount}
                  </div>

                </div>
              ))
            )}

          </div>

        </div>

      </div>

      <Footer />

    </div>
  );
}