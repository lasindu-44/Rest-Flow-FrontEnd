import { useMemo, useState,useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Tag,
  Search,
  X,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BackendURL } from "../Services/BackendURL";


import "../css/MenuManagment.css";

export default function FoodOrderAdminMasterUI() {

  
  const { restaurantId }  = useParams();

  interface CategoryForm {
  categoryId: number;
  restaurantId: number;
  resturantName: string;
  categoryName: string;
  description: string;
  displayOrder: number; // could be number if you prefer
  isActive: boolean;
}

 

  useEffect(() => {
    fetchCategories();
  }, []);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        BackendURL+"/api/FoodCategories/GetAllFoodCategories?RestId=" + restaurantId,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 401) {
        //alert("Unauthorized");
        // e.g. redirect to login
        navigate("/SignIn");
        return;
      }

      if (!response.ok) {
        alert("Failed to fetch categories");
      }

      const data = await response.json();
      console.log("Fetched categories:", data);
      setCategories(data);
      console.log("Categories state updated:", categories);
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Fetch categories completed");
    }
  };

  const emptyCategoryForm: CategoryForm = {
    categoryId: 0,
    restaurantId: restaurantId ? parseInt(restaurantId) : 0,
    resturantName: "",
    categoryName: "",
    description: "",
    displayOrder: 0,
    isActive: true,
  };

  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);

  const [categoryQuery, setCategoryQuery] = useState("");

  const [showModal, setShowModal] = useState(false);

  const handlechange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setCategoryForm({
      ...categoryForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const filteredCategories = useMemo(() => {
    return categories
      .filter((category:any) => {
        const q = categoryQuery.trim().toLowerCase();
        if (!q) return true;
        return (
          category.categoryName.toLowerCase().includes(q) ||
          category.description.toLowerCase().includes(q)
        );
      })
      .sort((a:any, b:any) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [categories, categoryQuery]);

  const resetCategoryForm = () => {
    setCategoryForm(emptyCategoryForm);
    setShowModal(true);
  };

  const SaveCategory = async () => {
    try {
      const token = localStorage.getItem("token");

     console.log("jason body:", JSON.stringify(categoryForm));

      const response = await fetch(
        BackendURL+"/api/FoodCategories/SaveCategory",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            
          },
          body: JSON.stringify(categoryForm),
        },
      );

      if (response.status === 401) {
        //alert("Unauthorized");
        navigate("/SignIn");
        return;
      }

      if (!response.ok) {
        Swal.fire(
          "Error",
          "Failed to save category. Please try again.",
          "error",
        );
        return;
      }

      const data = await response.json();
      console.log("Saved category:", data);
      Swal.fire("Success", "Category saved successfully!", "success");
      fetchCategories();
      setShowModal(false);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const EditeCategory = async () => {
    try {
      const token = localStorage.getItem("token");

     console.log("jason body:", JSON.stringify(categoryForm));

      const response = await fetch(
        BackendURL+"/api/FoodCategories/SaveCategory",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            
          },
          body: JSON.stringify(categoryForm),
        },
      );

      if (response.status === 401) {
        //alert("Unauthorized");
        navigate("/SignIn");
        return;
      }

      if (!response.ok) {
        Swal.fire(
          "Error",
          "Failed to Update category. Please try again.",
          "error",
        );
        return;
      }

      const data = await response.json();
      console.log("Saved category:", data);
      Swal.fire("Success", "Category Updated successfully!", "success");
      fetchCategories();
      setShowModal(false);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const handleCategorySubmit = async (e: any) => {
    e.preventDefault();

    if (!categoryForm.categoryName.trim()) {
      Swal.fire(
        "Error",
        "Please enter a category name.",
        "error"
      );
      return;
    }
    if (!categoryForm.restaurantId || categoryForm.restaurantId == 0) {
      Swal.fire(
        "Error",
        "Please select a restaurant.",
        "error"
      );
      return;
    }
    if (!categoryForm.displayOrder || categoryForm.displayOrder == 0) {
      Swal.fire(
        "Error",
        "Please enter a valid display order number.",
        "error",
      );
      return;
    }
    if (!categoryForm.description) {
      Swal.fire(
        "Error",
        "Please enter a category description.",
        "error"
      );
      return;
    }

    console.log("Submitting category form:", categoryForm);
    if(categoryForm.categoryId && categoryForm.categoryId > 0){
      await EditeCategory();
    } else {
      await SaveCategory();
    }
    resetCategoryForm();
    setShowModal(false);

  };

  const editCategory = async (category: any) => {
    setCategoryForm({
      categoryId: category.categoryId,
      restaurantId: category.restaurantId,
      categoryName: category.categoryName,
      description: category.description ,
      displayOrder: category.displayOrder || 0,
      isActive: category.isActive,
      resturantName: category.resturantName || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowModal(true);
    
  };

  const deleteCategory = (categoryId: number) => {
     Swal.fire({
        title: "Are you sure?",
        text: `Delete "${categoryId}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e3342f",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          ConfirmeDelete(categoryId);
          Swal.fire("Deleted!", "Category removed.", "success");
        }
      });

    if (categoryForm.categoryId === categoryId) resetCategoryForm();
  };

    const ConfirmeDelete = async (id: any) => {
    const token = localStorage.getItem("token"); // your JWT

    try {
      const response = await fetch(
        BackendURL+"/api/FoodCategories/DeactivateFoodCategory?id=" +
          id,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        alert("Category Deactivated Faild.");
      }
      // 👇 Handle unauthorized cases
      if (response.status === 401) {
        console.log("Unauthorized - not logged in or token invalid");
        // e.g. redirect to login
        navigate("/SignIn");
        return;
      }

      if (response.status === 403) {
        console.log("Forbidden - not an admin");
        // e.g. show "access denied"
        alert("access denied");
        return;
      }

      if (response.ok) {
        
        const data = await response.json();
        console.log(data);
        fetchCategories();
      }
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <div className="mm-admin-master-page">
      <div className="mm-admin-shell">
        <section className="mm-hero-card">
          <div className="mm-hero-copy">
            <h1>Menu Master Management</h1>
            <p>
              A clean and mobile responsive admin component to manage food
              categories and menu items with quick add, edit, delete, search,
              and status controls.
            </p>
          </div>

          <div className="mm-stats-grid">
            <div className="mm-stat-box">
              <span>Total Categories</span>
              <strong>{categories.length}</strong>
            </div>
            <div className="mm-add-new-category">
              <button
                className="mm-btn mm-btn-primary"
                type="button"
                onClick={resetCategoryForm}
              >
                <Plus size={18} /> Add New Category
              </button>
            </div>
          </div>
        </section>

        {showModal && (
          <div className="mm-modal-overlay">
            <div className="mm-modal-content">
              <section className="mm-form-grid">
                <div className="mm-panel">
                  <div className="mm-panel-header">
                    <div className="mm-panel-title">
                      <div className="mm-icon-badge">
                        <Tag size={20} />
                      </div>

                      <div>
                        <h2>
                          {categoryForm.categoryId
                            ? "Edit Category"
                            : "Add Menu Category"}
                        </h2>
                        <p>
                          Create and organize categories for each restaurant
                          menu.
                        </p>
                      </div>
                    </div>

                    <button onClick={() => setShowModal(false)}>X</button>
                  </div>

                  <form className="mm-form" onSubmit={handleCategorySubmit}>
                    <div className="mm-field-grid">
                      <div className="mm-field">
                        <label>Restaurant ID</label>
                        <input
                          type="number"
                          name="restaurantId"
                          value={categoryForm.restaurantId}
                          onChange={handlechange}
                          placeholder="Enter restaurant ID"
                          
                        />
                      </div>

                      <div className="mm-field">
                        <label>Display Order</label>
                        <input
                          type="number"
                          name="displayOrder"
                          value={categoryForm.displayOrder}
                          onChange={handlechange}
                          placeholder="Example: 1"
                       
                        />
                      </div>

                      <div className="mm-field mm-field-full">
                        <label>Category Name</label>
                        <input
                          type="text"
                          name="categoryName"
                          value={categoryForm.categoryName}
                          onChange={handlechange}
                          placeholder="Enter category name"
                          
                        />
                      </div>

                      <div className="mm-field mm-field-full">
                        <label>Description</label>
                        <textarea
                          name="description"
                          value={categoryForm.description}
                          onChange={handlechange}
                          placeholder="Add a short category description"
                          
                        />
                      </div>
                    </div>

                    <div className="mm-switch-row">
                      <label className="mm-switch">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={categoryForm.isActive}
                          onChange={handlechange}
                        />
                        Active category
                      </label>
                    </div>

                    <div className="mm-button-row">
                      <button className="mm-btn mm-btn-primary" type="submit">
                        <Plus size={18} />{" "}
                        {categoryForm.categoryId
                          ? "Update Category"
                          : "Save Category"}
                      </button>
                      <button
                        className="mm-btn mm-btn-secondary"
                        type="button"
                        onClick={resetCategoryForm}
                      >
                        <X size={18} /> Clear
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            </div>
          </div>
        )}

        <section>
          <div className="mm-section-header">
            <div>
              <h3>Menu Categories</h3>
              <p>Search, review, and manage category records.</p>
            </div>

            <div className="mm-toolbar">
              <div className="mm-search-box">
                <Search size={18} className="mm-search-icon" />
                <input
                  type="text"
                  placeholder="Search categories"
                  value={categoryQuery}
                  onChange={(e) => setCategoryQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {filteredCategories.length ? (
            <div className="mm-list-grid">
              {filteredCategories.map((category:any) => (
                <article className="mm-list-card" key={category.categoryId}>
                  <div className="mm-card-top">
                    <div>
                      <h4>{category.categoryName}</h4>
                      <p>
                        {category.description || "No description added yet."}
                      </p>
                    </div>

                    <div className="mm-pill-row">
                      <span
                        className={`mm-pill ${category.isActive ? "mm-pill-success" : "mm-pill-warn"}`}
                      >
                        <CheckCircle2 size={14} />{" "}
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="mm-meta-grid">
                    <div className="mm-meta-box">
                      <span>Category ID</span>
                      {category.categoryName}
                    </div>
                    <div className="mm-meta-box">
                      <span>Restaurant ID</span>
                      {category.resturantName}
                    </div>
                    <div className="mm-meta-box">
                      <span>Display Order</span>
                      {category.displayOrder ?? "-"}
                    </div>
                   
                  </div>

                  <div className="mm-card-actions">
                    <button
                      className="mm-action-btn mm-action-btn-primary"
                      onClick={() => editCategory(category)}
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    <button
                      className="mm-action-btn"
                      onClick={() => navigate(`/MenuItem/${category.categoryId}/${category.restaurantId}`) }
                    >
                      <Eye size={16} /> View Items
                    </button>
                    <button
                      className="mm-action-btn mm-action-btn-danger"
                      onClick={() => deleteCategory(category.categoryId)}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mm-empty-state">
              <strong>No categories found</strong>
              Try adding a new category or changing your search.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
