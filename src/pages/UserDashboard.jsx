


import { useEffect, useState } from "react";

import "../styles/UserBoard.css";

import { useNavigate } from "react-router-dom";

import "../styles/UserDashboard.css";
import Toast from "../components/Toast";
import {getAllProducts,getProductsByCategory} from "../services/productService";
import { getActiveCategories } from "../services/categoryService";
import { addToWishlist } from "../services/wishlistService"

import {getAllProducts, getProductsByCategory} from "../services/productService";

import { getActiveCategories} from "../services/categoryService";

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

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const size = 6;

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
  }, [page]);

  const fetchProducts = async () => {

    try {

      const res = await getAllProducts(page, size);

      console.log("ALL PRODUCTS:", res);

      const productData =
        res?.data?.data?.content || [];

      const total =
        res?.data?.data?.totalPages || 0;

      setProducts(productData);

      setFilteredProducts(productData);

      setTotalPages(total);

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

  const handleCategoryClick = async (category) => {

    setSelectedCategory(category);

    const categoryName =
      category.categoryName ||
      category.category_name;

    try {

      const filtered =
        await getProductsByCategory(
          categoryName
        );

      setFilteredProducts(filtered);

      setPage(0);

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

    setPage(0);
  };


  
const addToCart = async (product) => {
  const addToCart = async (product) => {

    try {

      const res = await axiosInstance.post(
        "/cart/add",
        {
          productId: product.id,
          quantity: 1,
        }
      );

      console.log(
        "ADD CART RESPONSE:",
        res.data
      );

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
      console.log(
        "ADD CART ERROR:",
        err
      );
    }
  };

  return (

    <div className="dashboard-container">

      {/* TOP CONTROLS */}
      <div className="top-controls">

        {/* LEFT CATEGORY */}
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

                  fetchProducts();

                  setSelectedCategory(null);

                  setSearchTerm("");

                  setShowDropdown(false);

                  setPage(0);

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

        {/* CENTER TITLE */}
        <div className="products-heading">

          <h1>
            Products
          </h1>

        </div>

        {/* RIGHT SEARCH */}
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

          <>

            <div className="products-grid">

              {filteredProducts.map((product) => (

                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => {

                    setSelectedProduct(product);

                    setCurrentImageIndex(0);

                  }}
                >

                  <img
                    src={
                      product.images?.[0] ||

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
                        onClick={(e) => {

                          e.stopPropagation();

                          addToCart(product);

                        }}
                      >
                        Add Cart
                      </button>

                    <button className="wishlist-btn" onClick={() => handleWishlist(product.id)}>

                      Wishlist

                    </button>
                      <button
                        className="wishlist-btn"
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                      >
                        Wishlist
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

            {/* PAGINATION */}
            <div className="pagination-container">

              <button
                disabled={page === 0}
                onClick={() =>
                  setPage(page - 1)
                }
                className="page-btn"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (

                <button
                  key={index}
                  onClick={() =>
                    setPage(index)
                  }
                  className={
                    page === index
                      ? "page-btn active-page"
                      : "page-btn"
                  }
                >
                  {index + 1}
                </button>

              ))}

              <button
                disabled={page + 1 === totalPages}
                onClick={() =>
                  setPage(page + 1)
                }
                className="page-btn"
              >
                Next
              </button>

            </div>

          </>

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

      {/* PRODUCT MODAL */}
      {selectedProduct && (

        <div className="product-modal-overlay">

          <div className="product-modal">

            <button
              className="close-btn"
              onClick={() => {

                setSelectedProduct(null);

                setCurrentImageIndex(0);

              }}
            >
              ✖
            </button>

            {/* PRODUCT IMAGE */}
            <img
              src={
                selectedProduct.images?.[
                  currentImageIndex
                ] ||

                selectedProduct.imageUrl ||

                "https://via.placeholder.com/300"
              }
              alt={selectedProduct.name}
              className="modal-product-img"
            />

            {/* IMAGE CONTROLS */}
            {selectedProduct.images &&
              selectedProduct.images.length > 1 && (

              <div className="image-controls">

                <button
                  className="image-btn"
                  onClick={() =>

                    setCurrentImageIndex(

                      currentImageIndex === 0

                        ? selectedProduct.images.length - 1

                        : currentImageIndex - 1
                    )
                  }
                >
                  ◀
                </button>

                <button
                  className="image-btn"
                  onClick={() =>

                    setCurrentImageIndex(

                      currentImageIndex ===
                      selectedProduct.images.length - 1

                        ? 0

                        : currentImageIndex + 1
                    )
                  }
                >
                  ▶
                </button>

              </div>

            )}

            <div className="modal-product-content">

              <h2>
                {selectedProduct.name}
              </h2>

              <p>
                {selectedProduct.description}
              </p>

              <h3>
                ₹{selectedProduct.price}
              </h3>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default UserDashboard;