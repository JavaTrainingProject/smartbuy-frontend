
import { Routes, Route } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import VerifyOtp from "../pages/VerifyOtp";


import CartPage from "../pages/CartPage";
import OrderPage from "../pages/OrderPage";

function AppRoutes() {

  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      
      <Route path="/cart" element={<CartPage/>} />
      <Route path="/orders" element={<OrderPage/>} />


    </Routes>
  );
}

export default AppRoutes;