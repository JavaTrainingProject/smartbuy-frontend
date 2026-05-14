import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { getAllProducts, getProductsByCategory, createProduct} from "../services/productService";

import "../styles/product.css";

function ProductPage() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [successMsg, setSuccessMsg] = useState("");

 
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 5;

  
  const [formData, setFormData] = useState({
    categoryId: "",
    subCategoryId: "",
    productName: "",
    productDescription: "",
    price: "",
  });

  const [imageFile, setImageFile] = useState(null);

  
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubCategories(); 
  }, [page]);

 
  const fetchProducts = async () => {
    try {

      const res = await getAllProducts(page, size);

      const data = res.data?.data;

      setProducts(data?.content || []);
      setTotalPages(data?.totalPages || 0);

    } catch (err) {
      console.log("PRODUCT ERROR:", err);
    }
  };

 
 const fetchCategories = async () => {

  try {

    const res = await axiosInstance.get(
      "/admin/categories/active?page=0&size=100"
    );

    console.log("CATEGORY RESPONSE:", res.data);

    let list = [];

    if (Array.isArray(res.data)) {
      list = res.data;
    }
    else if (Array.isArray(res.data.data)) {
      list = res.data.data;
    }
    else if (Array.isArray(res.data.data?.content)) {
      list = res.data.data.content;
    }

    console.log("FINAL CATEGORY LIST:", list);

    setCategories(list);

  } catch (err) {

    console.log("CATEGORY ERROR:", err);

    setCategories([]);
  }
};

  
  const fetchSubCategories = async () => {

    try {

      
      const res = await axiosInstance.get("/subcategory");

      console.log("SUBCATEGORY RESPONSE:", res.data);

      let list = [];

      if (Array.isArray(res.data)) {
        list = res.data;
      }
      else if (Array.isArray(res.data.data)) {
        list = res.data.data;
      }
      else if (Array.isArray(res.data.data?.content)) {
        list = res.data.data.content;
      }
      else if (Array.isArray(res.data.content)) {
        list = res.data.content;
      }

      console.log("FINAL SUBCATEGORY LIST:", list);

      setSubCategories(list);

    } catch (err) {

      console.log("SUBCATEGORY ERROR:", err);

      setSubCategories([]);
    }
  };

  
  const openAddModal = () => {

    setShowModal(true);

    setFormData({
      categoryId: "",
      subCategoryId: "",
      productName: "",
      productDescription: "",
      price: "",
    });

    setImageFile(null);
  };

  
  const handleSubmit = async (e) => {

    e.preventDefault();

    const productObj = {

      categoryId: Number(formData.categoryId),

      subCategoryId: Number(formData.subCategoryId),

      product_name: formData.productName,

      product_description: formData.productDescription,

      product_price: Number(formData.price),

      quantity: 1,
    };

    const form = new FormData();

    form.append("product", JSON.stringify(productObj));

    if (imageFile) {
      form.append("images", imageFile);
    }

    try {

      await createProduct(form);

      setSuccessMsg("Product added successfully!");

      setShowModal(false);

      fetchProducts();

      setTimeout(() => {
        setSuccessMsg("");
      }, 2000);

    } catch (err) {

      console.log("SUBMIT ERROR:", err);
    }
  };

  
  return (

    <div className="category-container">

     
      {successMsg && (
        <div className="success-popup">
          {successMsg}
        </div>
      )}

      
      <div className="header">

        <h2>Products</h2>

        <button
          className="add-btn"
          onClick={openAddModal}
        >
          + Add Product
        </button>

      </div>

      
      <div
        style={{
          height: "400px",
          background: "#f8fafc",
          borderRadius: "12px",
          border: "1px dashed #cbd5e1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#64748b",
          fontSize: "18px",
          marginTop: "20px",
        }}
      >
        Product page content will come here
      </div>

     
      {showModal && (

        <div className="modal">

          <div className="modal-content">

            <h3>Add Product</h3>

            <form onSubmit={handleSubmit}>

            
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categoryId: e.target.value,
                  })
                }
                required
              >
                <option value="">
                  Select Category
                </option>

                {categories.map((c, index) => (
                  <option
                    key={c.id || index}
                    value={c.id}
                  >
                    {c.categoryName}
                  </option>
                ))}
              </select>

           
              <select
                value={formData.subCategoryId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subCategoryId: e.target.value,
                  })
                }
                required
              >
                <option value="">
                  Select SubCategory
                </option>

                {subCategories.map((s, index) => (

                  <option
                    key={
                      s.id ||
                      s.subCategoryId ||
                      s.sub_category_id ||
                      index
                    }
                    value={
                      s.id ||
                      s.subCategoryId ||
                      s.sub_category_id
                    }
                  >
                    {
                      s.subCategoryName ||
                      s.sub_category_name ||
                      s.name
                    }
                  </option>

                ))}
              </select>

             
              <input
                type="text"
                placeholder="Product Name"
                value={formData.productName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    productName: e.target.value,
                  })
                }
                required
              />

              <textarea
                placeholder="Description"
                value={formData.productDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    productDescription: e.target.value,
                  })
                }
              />

            
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: e.target.value,
                  })
                }
                required
              />

        
              <input
                type="file"
                onChange={(e) =>
                  setImageFile(e.target.files[0])
                }
              />

        
              <div className="modal-actions">

                <button type="submit">
                  Save
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default ProductPage;
