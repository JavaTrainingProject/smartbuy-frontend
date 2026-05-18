import { useEffect, useState } from "react";

import axiosInstance from "../services/axiosInstance";

import {
  createSubCategory,
  getActiveCategories,
  getAllSubCategories,
  updateSubCategory,
} from "../services/subCategoryService";

import "../styles/subcategory.css";

function SubCategoryPage() {

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [successMsg, setSuccessMsg] = useState("");


  const [nameError, setNameError] = useState("");

  const size = 10;

  
  const [formData, setFormData] = useState({
    categoryId: "",
    subCategoryName: "",
    status: "ACTIVE",
  });

 
  const fetchCategories = async () => {

    try {

      const response = await getActiveCategories();

      const data = response.data?.data;

      const list =
        Array.isArray(data)
          ? data
          : data?.content || [];

      setCategories(list);

    } catch (error) {

      console.log("CATEGORY ERROR:", error);
    }
  };

 
  const fetchSubCategories = async () => {

  try {

    const response =
      await getAllSubCategories(page, size);

    console.log(response.data);

    const data = response.data.data;

    setSubCategories(data.content || []);

    setTotalPages(data.totalPages || 1);

  } catch (error) {

    console.log(error);

    setSubCategories([]);
  }
};

  useEffect(() => {

    fetchCategories();
    fetchSubCategories();

  }, [page]);

  const handleChange = (e) => {

    setNameError("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 
  const resetForm = () => {

    setFormData({
      categoryId: "",
      subCategoryName: "",
      status: "ACTIVE",
    });

    setNameError("");

    setEditingId(null);

    setShowModal(false);
  };

 
  const handleSubmit = async (e) => {

    e.preventDefault();

    const payload = {
      categoryId: Number(formData.categoryId),
      subCategoryName: formData.subCategoryName,
      status: formData.status,
    };

    console.log("PAYLOAD:", payload);

    try {

  
      if (editingId) {

        await updateSubCategory(editingId, payload);

        setSuccessMsg(
          "SubCategory updated successfully!"
        );
      }

     
      else {

        await createSubCategory(payload);

        setSuccessMsg(
          "SubCategory added successfully!"
        );
      }

      fetchSubCategories();

      resetForm();

      setTimeout(() => {
        setSuccessMsg("");
      }, 2000);

    } catch (error) {

      const errorMsg =
        error.response?.data?.message ||
        error.response?.data ||
        "Something went wrong";

      console.log("Submit error:", errorMsg);

      if (
        errorMsg.toLowerCase().includes("already")
      ) {
        setNameError(
          "SubCategory already exists"
        );
      }
    }
  };

 
  const handleEdit = (item) => {

    setEditingId(item.id);

    setFormData({
      categoryId: item.categoryId || "",
      subCategoryName: item.subCategoryName || "",
      status: item.status || "ACTIVE",
    });

    setShowModal(true);
  };

  
  const toggleStatus = async (item) => {

    try {

      const newStatus =
        item.status === "ACTIVE"
          ? "INACTIVE"
          : "ACTIVE";

      console.log("NEW STATUS:", newStatus);

      await axiosInstance.put(
        `/subcategory/${item.id}`,
        {
          subCategoryName: item.subCategoryName,
          categoryId: item.categoryId,
          status: newStatus,
        }
      );

      fetchSubCategories();

    } catch (error) {

      console.log(
        "TOGGLE ERROR:",
        error.response?.data || error.message
      );
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

        <h2>SubCategories</h2>

        <button
          className="add-btn"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          + Add SubCategory
        </button>

      </div>

      
      <table className="category-table">

        <thead>

          <tr>
            <th>S.No</th>
            <th>Category</th>
            <th>SubCategory</th>

            <th style={{ textAlign: "right" }}>
              Actions
            </th>
          </tr>

        </thead>

        <tbody>

          {subCategories.length === 0 ? (

            <tr>
              <td
                colSpan="4"
                style={{ textAlign: "center" }}
              >
                No Data Found
              </td>
            </tr>

          ) : (

            subCategories.map((item, index) => (

              <tr key={item.id}>

                <td>
                  {page * size + index + 1}
                </td>

                <td>{item.categoryName}</td>

                <td>{item.subCategoryName}</td>

                <td>

                  <div className="actions-container">

                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                  
                    <button
                      className={`toggle-btn ${
                        item.status === "ACTIVE"
                          ? "active"
                          : "inactive"
                      }`}
                      onClick={() => toggleStatus(item)}
                    >
                      <div className="toggle-circle"></div>
                    </button>

                  </div>

                </td>

              </tr>
            ))
          )}

        </tbody>

      </table>

      
      <div className="pagination">

        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span>
          Page {page + 1} of {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>

      </div>

      {showModal && (

        <div className="modal">

          <div className="modal-content">

            <h3>
              {editingId
                ? "Edit SubCategory"
                : "Add SubCategory"}
            </h3>

            <form onSubmit={handleSubmit}>

            
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

           
              <input
                type="text"
                name="subCategoryName"
                placeholder="Enter SubCategory Name"
                value={formData.subCategoryName}
                onChange={handleChange}
                required
              />

             
              {nameError && (
                <p className="error-text">
                  {nameError}
                </p>
              )}

             
              <div className="modal-actions">

                <button type="submit">
                  {editingId ? "Update" : "Save"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
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

export default SubCategoryPage;