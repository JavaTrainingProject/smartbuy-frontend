import { useEffect, useState } from "react";
import "../styles/UserBoard.css";
import "../styles/UserDashboard.css";

import { useNavigate } from "react-router-dom";

import Toast from "../components/Toast";

import {
  getAllProducts,
  getProductsByCategory
} from "../services/productService";

import {
  getActiveCategories,
  getSubCategoriesByCategory
} from "../services/categoryService";

import { addToWishlist } from "../services/wishlistService";

import axiosInstance from "../services/axiosInstance";
 
function UserDashboard() {
  const [products, setProducts] = useState([]);
 
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  const [subCategories, setSubCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: ""
  });

  const [showDropdown, setShowDropdown] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [page, setPage] = useState(0);
 
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(false);

  const size = 6;

  const navigate = useNavigate();
 
  useEffect(() => {
    fetchProducts();
    fetchCategories();

  }, [page]);

  const showToast = (message, type) => {

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

      setLoading(true);

      const res =
        await getAllProducts(page, size);

      let productData =
        res?.data?.data?.content || [];

      productData = productData.sort(
        (a, b) => b.id - a.id
      );

      const total =
        res?.data?.data?.totalPages || 0;

      setProducts(productData);
 
      setFilteredProducts(productData);
 
      setTotalPages(total);
    } catch (err) {

      console.error(
        "PRODUCT ERROR:",
        err
      );

    } finally {

      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {

      const res =
        await getActiveCategories();

      setCategories(res || []);
    } catch (err) {

      console.error(
        "CATEGORY ERROR:",
        err
      );
    }
  };

  const handleCategoryClick =
    async (category) => {

      setLoading(true);

      try {

        setSelectedCategory(category);

        setSelectedSubCategory(null);

        const categoryName =
          category.categoryName ||
          category.category_name;

        const finalProducts =
          await getProductsByCategory(
            categoryName
          );

        setFilteredProducts(finalProducts);

        setTotalPages(
          Math.ceil(
            finalProducts.length / size
          )
        );

        const categoryId =
          category.id ||
          category.category_id;

        const subRes =
          await getSubCategoriesByCategory(
            categoryId
          );

        let subList = [];

        if (Array.isArray(subRes.data)) {

          subList = subRes.data;

        } else if (
          Array.isArray(subRes.data.data)
        ) {

          subList = subRes.data.data;

        } else if (
          Array.isArray(
            subRes.data.data?.content
          )
        ) {

          subList =
            subRes.data.data.content;
        }

        setSubCategories(subList);

        setPage(0);

      } catch (error) {

        console.log(
          "CATEGORY FILTER ERROR:",
          error
        );

        setFilteredProducts([]);

        setSubCategories([]);

      } finally {

        setLoading(false);

        setShowDropdown(false);
      }
    };
const handleSubCategoryClick =
  async (subCategory) => {

    setLoading(true);

    try {

      setSelectedSubCategory(subCategory);

      const subCategoryId =
        subCategory.subCategoryId ||
        subCategory.id ||
        subCategory.sub_category_id;

      console.log(
        "SUBCATEGORY ID:",
        subCategoryId
      );

      const categoryName =
        selectedCategory.categoryName ||
        selectedCategory.category_name;

      const categoryProducts =
        await getProductsByCategory(
          categoryName
        );

      console.log(
        "CATEGORY PRODUCTS:",
        categoryProducts
      );

      const filteredProducts =
        categoryProducts.filter(
          (product) => {

            return Number(
              product.subCategoryId
            ) === Number(subCategoryId);
          }
        );

      console.log(
        "FILTERED PRODUCTS:",
        filteredProducts
      );

      setFilteredProducts(
        filteredProducts
      );

      setTotalPages(
        Math.ceil(
          filteredProducts.length / size
        )
      );

      setPage(0);

    } catch (error) {

      console.log(
        "SUBCATEGORY ERROR:",
        error
      );

      setFilteredProducts([]);

    } finally {

      setLoading(false);
    }
  };

  const handleSearch = async (value) => {

    setSearchTerm(value);

    try {

      setLoading(true);

      const res =
        await getAllProducts(0, 1000);

      let allProducts =
        res?.data?.data?.content || [];

      if (value.trim() === "") {

        setFilteredProducts(allProducts);

        setTotalPages(
          Math.ceil(
            allProducts.length / size
          )
        );

        setLoading(false);

        return;
      }

      const filtered =
        allProducts.filter((product) => {

          const productName =
            product?.name
              ?.toString()
              .toLowerCase()
              .trim() || "";

          const searchValue =
            value
              .toLowerCase()
              .trim();

          return productName.includes(
            searchValue
          );
        });

      setFilteredProducts(filtered);

      setPage(0);

      setTotalPages(
        Math.ceil(
          filtered.length / size
        )
      );

    } catch (error) {

      console.log(
        "SEARCH ERROR:",
        error
      );

      setFilteredProducts([]);

    } finally {

      setLoading(false);
    }
  };

  const addToCart =
    async (product) => {

      try {

        await axiosInstance.post(
          "/cart/add",
          {
            productId: product.id,
            quantity: 1,
          }
        );

        navigate("/user/cart");

      } catch (err) {

        console.log(
          "ADD CART ERROR:",
          err
        );
      }
    };

  const handleWishlist =
    async (productId) => {

      try {

        const response =
          await addToWishlist(
            productId
          );

        showToast(
          response,
          "success"
        );

      } catch (error) {

        console.log(error);

        showToast(
          "Failed to add product to wishlist",
          "error"
        );
      }
    };

  return (
    <div className="dashboard-container">

      <div className="top-controls">

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

              <div
                className="category-card"
                onClick={async () => {

                  await fetchProducts();

                  setSelectedCategory(null);
 
                  setSelectedSubCategory(null);
 
                  setSubCategories([]);
 
                  setSearchTerm("");
 
                  setShowDropdown(false);
 
                  setPage(0);
                }}
              >
                All Products
              </div>

              {categories.map((cat) => (
                <div
                  key={
                    cat.id || cat.category_id
                  }
                  className="category-card"
                  onClick={() =>
                    handleCategoryClick(cat)
                  }
                >

                  {
                    cat.categoryName ||
                    cat.category_name
                  }

                </div>
              ))}
            </div>
          )}
        </div>

        <div className="products-heading">
          <h1>Products</h1>
        </div>

        <div className="search-box">


<input
  type="text"
  placeholder="Search products..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(searchTerm);
    }
  }}
  className="search-input"
/>

        </div>

     </div>

      <div className="products-section">

        {selectedCategory && (
          <h2 className="category-title">

            {
              selectedCategory.categoryName ||
              selectedCategory.category_name
            }

          </h2>
        )}

        {subCategories.length > 0 && (
          <div className="subcategory-container">
            <button
              className={
                selectedSubCategory === null
                  ? "subcategory-btn active-sub-btn"
                  : "subcategory-btn"
              }
              onClick={async () => {
                const categoryName =
                  selectedCategory.categoryName ||
                  selectedCategory.category_name;

            
                const allCategoryProducts =
  await getProductsByCategory(
    categoryName
  );

setFilteredProducts(
  allCategoryProducts
);

setTotalPages(
  Math.ceil(
    allCategoryProducts.length / size
  )
);

                setSelectedSubCategory(null);

                setPage(0);
              }}
            >
              All
            </button>

            {subCategories.map((sub) => (
              <button
                key={
                  sub.id ||
                  sub.subCategoryId ||
                  sub.sub_category_id
                }
                className={
                  selectedSubCategory === sub
                    ? "subcategory-btn active-sub-btn"
                    : "subcategory-btn"
                }
                onClick={() =>
                  handleSubCategoryClick(sub)
                  handleSubCategoryClick(sub)
                }
              >

                {
                  sub.subCategoryName ||
                  sub.sub_category_name
                }

              </button>
            ))}
          </div>
        )}

        {loading ? (

          <div className="loader-container">

            <div className="loader"></div>

          </div>

        ) : filteredProducts.length > 0 ? (

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
                      Array.isArray(product.imageUrls) &&
                      product.imageUrls.length > 0
                        ? product.imageUrls[0]
                        : "https://via.placeholder.com/300"
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
                        🛒 Add Cart
                      </button>

                      <button
                        className="wishlist-btn"
                        onClick={(e) => {

                          e.stopPropagation();

                          handleWishlist(
                            product.id
                          );
                        }}
                      >
                        ❤️ Wishlist
                        ❤️ Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (

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

                <button
                  className="page-btn active-page"
                >
                  {page + 1}
                </button>

                <button
                  disabled={
                    page + 1 >= totalPages
                  }
                  onClick={() =>
                    setPage(page + 1)
                  }
                  className="page-btn"
                >
                  Next
                </button>

              </div>

            )}

          </>
        ) : (
          <div className="empty-container">
            <h2 className="empty-text">
              Products Not Found
            </h2>
          </div>
        )}
      </div>

      {toast.show && (

        <Toast
          message={toast.message}
          type={toast.type}
        />

      )}

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
 
            <img
              src={
                Array.isArray(selectedProduct.imageUrls) &&
                selectedProduct.imageUrls.length > 0
                  ? selectedProduct.imageUrls[currentImageIndex]
                  : "https://via.placeholder.com/300"
              }
              alt={selectedProduct.name}
              className="modal-product-img"
            />

            {selectedProduct.imageUrls &&
              selectedProduct.imageUrls.length > 1 && (

              <>

                <button
                  className="slider-arrow left-arrow"
                  onClick={() =>

                    setCurrentImageIndex(

                      currentImageIndex === 0
                        ? selectedProduct.imageUrls.length - 1
                        : currentImageIndex - 1
                    )
                  }
                >
                  ❮
                </button>

                <button
                  className="slider-arrow right-arrow"
                  onClick={() =>

                    setCurrentImageIndex(

                      currentImageIndex ===
                      selectedProduct.imageUrls.length - 1
                        ? 0
                        : currentImageIndex + 1
                    )
                  }
                >
                  ❯
                </button>

                <div className="slider-dots">

                  {selectedProduct.imageUrls.map(
                    (_, index) => (

                    <span
                      key={index}
                      className={
                        currentImageIndex === index
                          ? "dot active-dot"
                          : "dot"
                      }
                      onClick={() =>
                        setCurrentImageIndex(index)
                      }
                    ></span>

                  ))}

                </div>

              </>

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

              <div className="modal-actions">

                <button
                  className="cart-btn"
                  onClick={() =>
                    addToCart(
                      selectedProduct
                    )
                  }
                >
                  🛒 Add Cart
                </button>

                <button
                  className="wishlist-btn"
                  onClick={() =>
                    handleWishlist(
                      selectedProduct.id
                    )
                  }
                >
                  ❤️ Wishlist
                </button>

              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
 
export default UserDashboard;






