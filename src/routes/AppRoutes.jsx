
import { Routes, Route } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import VerifyOtp from "../pages/VerifyOtp";

function AppRoutes() {

  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
    
     

    </Routes>
  );
}

export default AppRoutes;