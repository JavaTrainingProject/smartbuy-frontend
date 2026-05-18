import { useEffect, useState } from "react";

import {
  getAllProducts,
  createProduct,
  updateProduct,
  softDeleteProduct,
} from "../services/productService";

import API from "../services/axiosInstance";

import { getAllSubCategories } from "../services/subCategoryService";

import "../styles/product.css";

function ProductPage() {

  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  const [subCategories, setSubCategories] = useState([]);

  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [successPopup, setSuccessPopup] = useState("");

  const [imagePreview, setImagePreview] = useState("");

  const [editingId, setEditingId] = useState(null);


  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [formData, setFormData] = useState({
    categoryId: "",
    subCategoryId: "",
    name: "",
    price: "",
    quantity: "",
    description: "",
    image: null,
  });


  useEffect(() => {

    fetchProducts();

  }, [page]);


  useEffect(() => {

    fetchCategories();

    fetchSubCategories();

  }, []);


  const fetchProducts = async () => {

    try {

      const response =
        await getAllProducts(page, 6);

      const data =
        response.data.data;


      const sortedProducts =
        data.content.sort(
          (a, b) => b.id - a.id
        );

      setProducts(sortedProducts);

      setTotalPages(
        data.totalPages
      );

    } catch (error) {

      console.log(
        "Error fetching products",
        error
      );

      setProducts([]);
    }
  };


  const fetchCategories = async () => {

    try {

      const response =
        await API.get(
          "/admin/categories?page=0&size=100"
        );

      setCategories(
        response.data.data.content || []
      );

    } catch (error) {

      console.log(error);
    }
  };


  const fetchSubCategories = async () => {

    try {

      const response =
        await getAllSubCategories();

      setSubCategories(
        response.data.data.content || []
      );

    } catch (error) {

      console.log(error);
    }
  };


  const handleChange = (e) => {

    const {
      name,
      value,
      files,
    } = e.target;


    if (name === "image") {

      const file = files[0];

      if (file) {

        setFormData({
          ...formData,
          image: file,
        });

        setImagePreview(
          URL.createObjectURL(file)
        );
      }

      return;
    }


    if (name === "categoryId") {

      const filtered =
        subCategories.filter(
          (sub) =>
            String(sub.categoryId) ===
            String(value)
        );

      setFilteredSubCategories(
        filtered
      );

      setFormData({
        ...formData,
        categoryId: value,
        subCategoryId: "",
      });

      return;
    }


    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const productData = {

        categoryId:
          formData.categoryId,

        subCategoryId:
          formData.subCategoryId,

        product_name:
          formData.name,

        product_price:
          Number(formData.price),

        quantity:
          Number(formData.quantity),

        stock:
          Number(formData.quantity),

        product_description:
          formData.description,
      };

      const data =
        new FormData();

      data.append(
        "product",
        JSON.stringify(productData)
      );


      if (formData.image) {

        data.append(
          "images",
          formData.image
        );
      }


      if (editingId) {

        await updateProduct(
          editingId,
          data
        );

        setSuccessPopup(
          "Product Updated Successfully"
        );

      } else {

        await createProduct(data);

        setSuccessPopup(
          "Product Added Successfully"
        );
      }


      fetchProducts();


      setShowModal(false);


      setEditingId(null);

      setImagePreview("");

      setFilteredSubCategories([]);

      setFormData({
        categoryId: "",
        subCategoryId: "",
        name: "",
        price: "",
        quantity: "",
        description: "",
        image: null,
      });

      setTimeout(() => {

        setSuccessPopup("");

      }, 3000);

    } catch (error) {

      console.log(
        "PRODUCT ERROR:",
        error.response?.data ||
        error.message
      );
    }
  };


  const handleEdit = (product) => {

    setEditingId(product.id);

    setFormData({

      categoryId:
        product.categoryId,

      subCategoryId:
        product.subCategoryId,

      name:
        product.name || "",

      price:
        product.price || "",

      quantity:
        product.stock ||
        product.quantity ||
        "",

      description:
        product.description || "",

      image: null,
    });

    setImagePreview(
      product.imageUrls || ""
    );

    setShowModal(true);
  };


  const handleToggle = async (product) => {

    try {


      if (product.status === "ACTIVE") {

        await API.delete(
          `/products/${product.id}/status`
        );

        setSuccessPopup(
          "Product Deactivated Successfully"
        );

      } else {


        await API.patch(
          `/products/${product.id}/status?status=ACTIVE`
        );

        setSuccessPopup(
          "Product Activated Successfully"
        );
      }

      fetchProducts();

      setTimeout(() => {

        setSuccessPopup("");

      }, 3000);

    } catch (error) {

      console.log(
        error.response?.data || error.message
      );

    }
  };

  return (

    <div className="product-page">

      <div className="product-header">

        <h2>Products</h2>

        <button
          className="add-btn"
          onClick={() => {

            setShowModal(true);

            setEditingId(null);

            setImagePreview("");

            setFilteredSubCategories([]);

            setFormData({
              categoryId: "",
              subCategoryId: "",
              name: "",
              price: "",
              quantity: "",
              description: "",
              image: null,
            });
          }}
        >
          + Add Product
        </button>

      </div>


      {successPopup && (

        <div className="success-popup">

          {successPopup}

        </div>
      )}


      {showModal && (

        <div className="modal">

          <div className="form-box">

            <div className="form-header">

              <h3>
                {editingId
                  ? "Edit Product"
                  : "Add Product"}
              </h3>

              <button
                className="close-btn"
                onClick={() =>
                  setShowModal(false)
                }
              >
                ×
              </button>

            </div>

            <form
              className="product-form"
              onSubmit={handleSubmit}
            >


              {!editingId && (

                <>


                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select Category
                    </option>

                    {categories.map((cat) => (

                      <option
                        key={cat.id}
                        value={cat.id}
                      >
                        {cat.categoryName}
                      </option>

                    ))}

                  </select>

                  <select
                    name="subCategoryId"
                    value={formData.subCategoryId}
                    onChange={handleChange}
                    disabled={
                      !formData.categoryId
                    }
                    required
                  >

                    <option value="">
                      Select SubCategory
                    </option>

                    {filteredSubCategories.map((sub) => (

                      <option
                        key={sub.id}
                        value={sub.id}
                      >
                        {sub.subCategoryName}
                      </option>

                    ))}

                  </select>

                </>
              )}


              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                required
              />


              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
              />


              <input
                type="number"
                name="quantity"
                placeholder="Stock"
                value={formData.quantity}
                onChange={handleChange}
                required
              />


              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
              />


              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />


              {imagePreview && (

                <div className="preview-box">

                  <img
                    src={imagePreview}
                    alt="Preview"
                  />

                </div>
              )}


              <div className="form-buttons">

                <button
                  type="submit"
                  className="save-btn"
                >
                  {editingId
                    ? "Update Product"
                    : "Save Product"}
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>
      )}


      <div className="product-grid">

        {products.map((product) => (

          <div
            className="product-item"
            key={product.id}
          >


            <div className="image-box">

              <img
                src={
                  product.imageUrls
                    ? product.imageUrls
                    : "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={product.name}
              />

            </div>

            <div className="action-buttons">

              <button
                className="edit-btn"
                onClick={() =>
                  handleEdit(product)
                }
              >
                Edit
              </button>

              <button
                className={`toggle-btn ${product.status === "ACTIVE"
                    ? "active"
                    : "inactive"
                  }`}
                onClick={() => handleToggle(product)}
              >
                <div className="toggle-circle"></div>
              </button>

            </div>


            <div className="product-info">

              <h4>{product.name}</h4>

              <p className="price">
                ₹ {product.price}
              </p>

              <p className="stock">
                Stock:
                {" "}
                {product.stock ||
                  product.quantity}
              </p>

              <p>
                {product.description}
              </p>

              <p>
                <strong>Category:</strong>
                {" "}
                {product.categoryName}
              </p>

              <p>
                <strong>SubCategory:</strong>
                {" "}
                {product.subCategoryName}
              </p>

            </div>

          </div>

        ))}

      </div>


      <div className="pagination">

        <button
          disabled={page === 0}
          onClick={() =>
            setPage(page - 1)
          }
        >
          Prev
        </button>

        <span>
          Page {page + 1} of {totalPages}
        </span>

        <button
          disabled={
            page + 1 >= totalPages
          }
          onClick={() =>
            setPage(page + 1)
          }
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default ProductPage;