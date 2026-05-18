import { Link } from "react-router-dom";
import logo from "/assets/logo.png";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <div className="sidebar">

      
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>

      
      <ul className="menu">

        <li><Link to="/user/">Home</Link></li>
        <li><Link to="/wishlist">Wishlist</Link></li>

        <li><Link to="/user">Home</Link></li>
        <li><Link to="/user/wishlist">Wishlist</Link></li>
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/cart">Add Cart</Link></li>
      </ul>

    </div>
  );
}

export default Navbar;