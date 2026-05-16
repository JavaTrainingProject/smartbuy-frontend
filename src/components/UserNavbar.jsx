import { Link } from "react-router-dom";
import logo from "/assets/logo.png";

function UserNavbar() {
  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>

      <ul className="menu">
        <li><Link to="/user/"> Home</Link></li>
        <li><Link to="/wishlist"> Wishlist</Link></li>
        <li><Link to="/orders"> Orders</Link></li>
        <li><Link to="/cart">Add cart</Link></li>
      </ul>
    </div>
  );
}

export default UserNavbar;