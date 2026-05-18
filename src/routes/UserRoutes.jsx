import { Routes, Route } from "react-router-dom";
import UserLayout from "../layout/UserLayout";
import UserDashboard from "../pages/UserDashboard";
import ProtectedRoute from "./ProtectedRoute";
import UserProfile from "../pages/UserProfile";
import WishlistPage from "../pages/WishlistPage";
import CartPage from "../pages/CartPage";
import OrderPage from "../pages/OrderPage";
function UserRoutes() {
  return (
    <Routes>
       <Route  element={
        <ProtectedRoute allowedRoles={["USER"]}>
          <UserLayout/>
        </ProtectedRoute>
      }
      >
      <Route index element={<UserDashboard />} />
      <Route path="profile" element={<UserProfile />} />
      <Route path="wishlist" element={<WishlistPage />} />
       <Route path="/cart" element={<CartPage/>} />
      <Route path="/orders" element={<OrderPage/>} />

        </Route>
    </Routes>
  );
}

export default UserRoutes;