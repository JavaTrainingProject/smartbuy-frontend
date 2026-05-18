import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserDashboard.css";
import Toast from "../components/Toast";
import {getAllProducts,getProductsByCategory} from "../services/productService";
import { getActiveCategories } from "../services/categoryService";
import { addToWishlist } from "../services/wishlistService"

import axiosInstance from "../services/axiosInstance";

function UserDashboard() {

  const [products, setProducts] = useState([]);

  const [filteredProducts, setFilteredProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [showDropdown, setShowDropdown] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: ""
});

  const navigate = useNavigate();

  useEffect(() => {

    fetchProducts();

    fetchCategories();

  }, []);

  const showToast = (
    message,
    type
) => {

    setToast({
        show: true,
        message,
        type
    });

    setTimeout(() => {

        setToast({
            show: false,
            message: "",
            type: ""
        });

    }, 3000);
};

  const fetchProducts = async () => {

    try {

      const res = await getAllProducts();

      console.log("ALL PRODUCTS:", res);

      setProducts(res || []);

      setFilteredProducts(res || []);

    } catch (err) {

      console.error("PRODUCT ERROR:", err);

    }
  };

  const fetchCategories = async () => {

    try {

      const res = await getActiveCategories();

      console.log("CATEGORIES:", res);

      setCategories(res || []);

    } catch (err) {

      console.error("CATEGORY ERROR:", err);

    }
  };

  const handleCategoryClick = async (
  category
) => {

  setSelectedCategory(category);

  const categoryName =
    category.categoryName ||
    category.category_name;

  console.log(
    "SELECTED CATEGORY:",
    categoryName
  );

  try {

    const filtered =
      await getProductsByCategory(
        categoryName
      );

    console.log(
      "FILTERED PRODUCTS:",
      filtered
    );

    setFilteredProducts(filtered);

  } catch (error) {

    console.log(
      "CATEGORY FILTER ERROR:",
      error
    );

    setFilteredProducts([]);

  }

  setShowDropdown(false);
};

const handleSearch = (value) => {

  setSearchTerm(value);

  let filtered = products;

  if (selectedCategory) {

    filtered = filtered.filter(

      (product) =>

        product.categoryName
          ?.toLowerCase() ===

        (
          selectedCategory.categoryName ||

          selectedCategory.category_name
        )
          ?.toLowerCase()
    );
  }

  filtered = filtered.filter(

    (product) =>

      product.name
        ?.toLowerCase()
        .includes(value.toLowerCase())
  );

  setFilteredProducts(filtered);
};


  
const addToCart = async (product) => {

  try {

    const res = await axiosInstance.post("/cart/add", {

      productId: product.id,
      quantity: 1,

    });

    console.log("ADD CART RESPONSE:", res.data);

    navigate("/cart");

  } catch (err) {

    console.log("ADD CART ERROR:", err);

  }
};

const handleWishlist = async (productId) =>{
  try{
    const response = await addToWishlist(productId);
    showToast(response,"success");
  }
  catch(error){
    console.log(error);
    showToast("Failed to add product to wishlist","error");
  }
};

  return (

    <div className="dashboard-container">

      {/* TOP CONTROLS */}
      <div className="top-controls">

        {/* CATEGORY DROPDOWN */}
        <div className="category-panel">

          <button
            className="dropdown-btn"
            onClick={() =>
              setShowDropdown(!showDropdown)
            }
          >
            Categories ▼
          </button>

          {showDropdown && (

            <div className="dropdown-box">

              {/* ALL PRODUCTS */}
              <div
                className="category-card"
                onClick={() => {

                  setFilteredProducts(products);

                  setSelectedCategory(null);

                  setSearchTerm("");

                  setShowDropdown(false);

                }}
              >
                All Products
              </div>

              {/* CATEGORY LIST */}
              {categories.map((cat) => (

                <div
                  key={
                    cat.id ||
                    cat.category_id
                  }
                  className="category-card"
                  onClick={() =>
                    handleCategoryClick(cat)
                  }
                >

                  {cat.categoryName ||
                    cat.category_name}

                </div>

              ))}

            </div>

          )}

        </div>

        {/* SEARCH BAR */}
        <div className="search-box">

          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) =>
              handleSearch(e.target.value)
            }
            className="search-input"
          />

        </div>

      </div>

      {/* PRODUCTS SECTION */}
      <div className="products-section">

        {/* CATEGORY TITLE */}
        {selectedCategory && (

          <h2 className="category-title">

            {selectedCategory.categoryName ||

              selectedCategory.category_name}

          </h2>

        )}

        {/* PRODUCTS */}
        {filteredProducts.length > 0 ? (

          <div className="products-grid">

            {filteredProducts.map((product) => (

              <div
                key={product.id}
                className="product-card"
              >

                <img
                  src={
                    product.imageUrl ||

                    "https://via.placeholder.com/300"
                  }
                  alt={product.name}
                  className="product-img"
                />

                <div className="product-content">

                  <h3 className="product-title">

                    {product.name}

                  </h3>

                  <p className="product-description">

                    {product.description}

                  </p>

                  <h4 className="product-price">

                    ₹{product.price}

                  </h4>

                  <div className="product-actions">

                  <button
                  className="cart-btn"
                     onClick={() => addToCart(product)}
>
  Add Cart
</button>

                    <button className="wishlist-btn" onClick={() => handleWishlist(product.id)}>

                      Wishlist

                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="empty-container">

            <h2 className="empty-text">

              Products Not Found

            </h2>

          </div>

        )}

      </div>
      {
    toast.show && (

        <Toast message={toast.message} type={toast.type} />
    )
}

    </div>
  );
}

export default UserDashboard;