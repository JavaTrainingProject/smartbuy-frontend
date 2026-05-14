import { useEffect, useState } from "react";
import "../styles/UserBoard.css";
import "../styles/UserDashboard.css";
import {
  getAllProducts,
  getProductsByCategory
} from "../services/productService";
import { getActiveCategories } from "../services/categoryService";

function UserDashboard() {

  const [products, setProducts] = useState([]);

  const [filteredProducts, setFilteredProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [showDropdown, setShowDropdown] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {

    fetchProducts();

    fetchCategories();

  }, []);

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
  // SEARCH FILTER
  const handleSearch = (value) => {

    setSearchTerm(value);

    let filtered = products;

    // CATEGORY FILTER
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

    // SEARCH FILTER
    filtered = filtered.filter(

      (product) =>

        product.name
          ?.toLowerCase()
          .includes(
            value.toLowerCase()
          )
    );

    setFilteredProducts(filtered);
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

                    <button className="cart-btn">

                      Add Cart

                    </button>

                    <button className="wishlist-btn">

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

    </div>
  );
}

export default UserDashboard;