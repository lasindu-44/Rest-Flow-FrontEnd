import React, { useMemo, useState, useEffect } from "react";
import "../css/MenuItem.css";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Services/SupaBase";
import { BackendURL } from "../Services/BackendURL";

export default function MenuItemsTable() {
  interface Formdata {
    id: number;
    restaurantId: number;
    categoryId: number;
    name: string;
    description: string;
    price: number;
    prepTime: string;
    available: boolean;
    image: null;
    imagePreview: string;
    categoryName: string;
    restaurantName: string;
  }

  const navigate = useNavigate();
  const { categoryId, restaurantId } = useParams();

  useEffect(() => {
    fetchfoodItems();
  }, []);

  const fetchfoodItems = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        BackendURL+"/api/FoodItem/GetAllFoodItems?RestId=" +
          restaurantId +
          "&CategoryId=" +
          categoryId,
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
        alert("Failed to fetch food items");
      }

      const data = await response.json();
      console.log("Fetched food items:", data);
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Fetch food items completed");
    }
  };

  const emptyForm: Formdata = {
    id: 0,
    restaurantId: Number(restaurantId),
    categoryId: Number(categoryId),
    name: "",
    description: "",
    price: 0,
    prepTime: "",
    available: true,
    image: null,
    imagePreview: "",
    categoryName: "",
    restaurantName: "",
  };

  const [items, setItems] = useState<Formdata[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const filtered = useMemo(() => {
    const text = search.toLowerCase().trim();

    if (!text) return items;

    return items.filter((item) => {
      return (
        item.name.toLowerCase().includes(text) ||
        item.description.toLowerCase().includes(text) ||
        String(item.id).includes(text) ||
        String(item.restaurantId).includes(text) ||
        String(item.categoryId).includes(text)
      );
    });
  }, [items, search]);

  const openAddModal = () => {
    setIsEditing(false);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setIsEditing(true);
    setFormData({
      id: item.id,
      restaurantId: Number(restaurantId),
      categoryId: Number(categoryId),
      name: item.name,
      description: item.description,
      price: Number(item.price),
      prepTime: item.prepTime,
      available: item.available,
      image: item.image,
      imagePreview: item.imagePreview,
      categoryName: item.categoryName,
      restaurantName: item.restaurantName,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(emptyForm);
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      image: file,
      imagePreview: previewUrl,
    }));
  };

  /*Save Files To supabase storage*/
  const uploadImage = async (file: any) => {
    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("RestFlow")
      .upload(fileName, file);

    if (error) {
      console.error(error);
      return null;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("RestFlow")
      .getPublicUrl(fileName);
    console.log("Image uploaded successfully to Supabase.");

    return publicUrlData.publicUrl;
  };

  const SaveFoodItem = async (updatedFormData: Formdata) => {
    try {
      const token = localStorage.getItem("token"); // your JWT

      const formDataToSend = {
        Id: updatedFormData.id,
        restaurantId: updatedFormData.restaurantId,
        categoryId: updatedFormData.categoryId,
        name: updatedFormData.name,
        description: updatedFormData.description,
        price: updatedFormData.price,
        prepTime: updatedFormData.prepTime,
        available: updatedFormData.available,
        imagePreview: updatedFormData.imagePreview, // Assuming this is the URL after upload
        categoryName: updatedFormData.categoryName,
        restaurantName: updatedFormData.restaurantName,
      };

      console.log("Sending form data to API:", formDataToSend);

      const response = await fetch(
        BackendURL+"/api/FoodItem/SaveFoodItem",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataToSend),
        },
      );

      if (!response.ok) {
        alert("Food item added Failed.");
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
        Swal.fire("Error", "access denied", "error");

        return;
      }

      if (response.ok) {
        Swal.fire("Success", "Food item added successfully.", "success");
        const data = await response.json();
        console.log(data);
        await fetchfoodItems(); // Refresh the list after adding
        setFormData(emptyForm);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isNotFromSupabase = (url: string) => {
    return !url.includes("supabase.co");
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      formData.price == 0 ||
      !formData.prepTime ||
      (!isEditing && formData.image === null) ||
      (isEditing && formData.imagePreview === null)
    ) {
      Swal.fire("Error", "Please fill in all required fields.", "error");
      return;
    }

     let updatedFormData = { ...formData };
    if (isNotFromSupabase(formData.imagePreview)) {
      console.log("This image is NOT from Supabase");
      var imageurl = await uploadImage(formData.image);
      console.log("Image URL after upload:", imageurl);
      if (imageurl) {
       /*setFormData({
          ...formData,
          imagePreview: imageurl,
        }); */
         updatedFormData.imagePreview = imageurl;
      } else {
        Swal.fire("Error", "Image upload failed. Please try again.", "error");
        return;
      }
    }

    console.log("Form Data Ready for save:", updatedFormData);

    if (!isEditing) {
      await SaveFoodItem(updatedFormData);
    } else {
      // Handle edit logic here
      await SaveFoodItem(updatedFormData);

    }

    closeModal();
  };

  const handleDelete = (id: any) => {
     Swal.fire({
           title: "Are you sure?",
           text: `Delete "${id}"?`,
           icon: "warning",
           showCancelButton: true,
           confirmButtonColor: "#e3342f",
           cancelButtonColor: "#6c757d",
           confirmButtonText: "Yes, delete it!",
         }).then((result) => {
           if (result.isConfirmed) {
             ConfirmeDelete(id);
             Swal.fire("Deleted!", "Food Item removed.", "success");
           }
         });
  };

   const ConfirmeDelete = async (id: any) => {
    const token = localStorage.getItem("token"); // your JWT

    try {
      const response = await fetch(
        BackendURL+"/api/FoodItem/DeleteFoodItem?id=" +
          id,
        {
          method: "DELETE",
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
        fetchfoodItems();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="mi-page">
        <div className="mi-container">
          <div className="mi-header-row">
            <div>
              <h1>Menu Items</h1>
              <p>Manage restaurant menu items easily in a table view.</p>
            </div>

            <button className="mi-primary-btn" onClick={openAddModal}>
              + Add New Item
            </button>
          </div>

          <div className="mi-toolbar">
            <input
              type="text"
              placeholder="Search by name, description, menu ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="mi-table-wrap">
            <table className="mi-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Menu ID</th>
                  <th>Name</th>
                  <th>Restaurant ID</th>
                  <th>Category ID</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Prep Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img
                          src={item.imagePreview}
                          alt={item.name}
                          className="mi-table-image"
                        />
                      </td>
                      <td>{item.id}</td>
                      <td className="mi-item-name">{item.name}</td>
                      <td>{item.restaurantName}</td>
                      <td>{item.categoryName}</td>
                      <td className="mi-description-cell">
                        {item.description}
                      </td>
                      <td>LKR {item.price.toFixed(2)}</td>
                      <td>{item.prepTime}</td>
                      <td>
                        <span
                          className={
                            item.available
                              ? "mi-status mi-status-yes"
                              : "mi-status mi-status-no"
                          }
                        >
                          {item.available ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td>
                        <div className="mi-action-buttons">
                          <button
                            className="mi-secondary-btn"
                            onClick={() => openEditModal(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="mi-danger-btn"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="mi-empty-cell">
                      No matching items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="mi-modal-overlay" onClick={closeModal}>
          <div className="mi-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mi-modal-header">
              <h2>{isEditing ? "Edit Menu Item" : "Add New Item"}</h2>
              <button className="mi-close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <form className="mi-form-grid" onSubmit={handleSubmit}>
              <div className="mi-form-group mi-full-width">
                <label>Food Image</label>
                <div className="mi-upload-box">
                  {formData.imagePreview ? (
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="mi-preview-image"
                    />
                  ) : (
                    <div className="mi-upload-placeholder">
                      No image selected
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <div className="mi-form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="mi-form-group">
                <label>Restaurant ID</label>
                <input
                  type="number"
                  name="restaurantId"
                  value={formData.restaurantId}
                  onChange={handleChange}
                />
              </div>

              <div className="mi-form-group">
                <label>Category ID</label>
                <input
                  type="number"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                />
              </div>

              <div className="mi-form-group">
                <label>Price (LKR)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div className="mi-form-group">
                <label>Prep Time</label>
                <input
                  type="text"
                  name="prepTime"
                  placeholder="e.g. 20 mins"
                  value={formData.prepTime}
                  onChange={handleChange}
                />
              </div>

              <div className="mi-form-group mi-full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="mi-form-group mi-full-width mi-checkbox-wrap">
                <label className="mi-checkbox-item">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                  />
                  Available
                </label>
              </div>

              <div className="mi-modal-actions mi-full-width">
                <button
                  type="button"
                  className="mi-secondary-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="mi-primary-btn">
                  {isEditing ? "Update Item" : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
