import { useEffect, useState } from "react";
import '../styles/Category.css';
import API from "../services/axiosInstance";

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
   const [error, setError] = useState("");
   const [successMessage, setSuccessMessage] = useState("");



  const fetchCategories = async () => {
    try {
      const res = await API.get(`/admin/categories?page=${page}&size=5&sortBy=id&direction=asc`);

      console.log("API RESPONSE:", res.data);

      setCategories(
        res.data?.data?.content || res.data?.data || []
      );
      const pageData = res.data.data;
      setTotalPages(pageData.totalPages);

    } catch (err) {
      console.error("Error fetching:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      if (editId) {
        await API.put(`/admin/categories/${editId}`, {
          categoryName: name.trim(),
        });
         setSuccessMessage("Category updated successfully");
      } else {
        await API.post("/admin/categories", {
          categoryName: name.trim(),
        });
        setSuccessMessage("Category added successfully");
      }

      fetchCategories();
      setName("");
      setEditId(null);
      setShowModal(false);

      setTimeout(() => {
  setSuccessMessage("");
}, 3000);

    } catch (err) {

  console.log("FULL ERROR:", err);

  const message =
    err.response?.data?.message ||
    "Category name already exists";
    setError(message);
}
  };


  const handleEdit = (cat) => {
    setError("");
    setName(cat.categoryName);
    setStatus(cat.status);
    setEditId(cat.id);
    setShowModal(true);
  };



  const handleToggle = async (cat) => {
    try {
      if (cat.status === "ACTIVE") {

        await API.delete(
          `/admin/categories/${cat.id}`
        );

      } else {

        await API.put(
          `/admin/categories/${cat.id}`,
          {
            status: "ACTIVE"
          }
        );

      }

      fetchCategories();

    } catch (error) {

      console.error(
        "Toggle failed",
        error.response?.data || error.message
      );

    }
  };

  const handleAddClick = () => {
    setError("");
    setName("");
    setStatus("ACTIVE");
    setEditId(null);
    setShowModal(true);
  };

  return (
    <div className="category-container">

      <div className="header">
        <h2>Categories</h2>
        <button className="add-btn" onClick={handleAddClick}>
          + Add Category
        </button>
      </div>
      {successMessage && (
  <div className="success-toast">
    {successMessage}
  </div>
)}

      <table className="category-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                No categories found
              </td>
            </tr>
          ) : (
            categories.map((cat, index) => (
              <tr key={cat.id}>
                <td>{page * 5 + index + 1}</td>

                <td>{cat.categoryName}</td>

                <td>
                  <div className="actions-container">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="edit-btn"
                    >
                      Edit
                    </button>

                    <div className="status-container">

                      <button
                        className={`toggle-btn ${cat.status === "ACTIVE"
                          ? "active"
                          : "inactive"
                          }`}
                        onClick={() => handleToggle(cat)}
                      >
                        <div className="toggle-circle"></div>
                      </button>


                    </div>
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
          disabled={page + 1 === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editId ? "Edit Category" : "Add Category"}</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter category name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                required
              />
              {error && <p className="error-text">{error}</p>}

              <div className="modal-actions">
                <button type="submit">
                  {editId ? "Update" : "Add"}
                </button>
                <button type="button" onClick={() => setShowModal(false)}>
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

export default CategoryPage;