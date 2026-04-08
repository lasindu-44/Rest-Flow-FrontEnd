import React, { useMemo, useState } from "react";
import "../css/MenuItem.css";

export default function MenuItemsTable() {
  const initialItems = [
    {
      id: 1,
      restaurantId: 101,
      categoryId: 1,
      name: "Chicken Burger",
      description: "Juicy grilled chicken burger with fresh lettuce and cheese.",
      price: 1250,
      prepTime: "20 mins",
      available: true,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      restaurantId: 101,
      categoryId: 2,
      name: "Seafood Pasta",
      description: "Creamy pasta mixed with prawns and calamari.",
      price: 2100,
      prepTime: "30 mins",
      available: true,
      image:
        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      restaurantId: 102,
      categoryId: 3,
      name: "Club Sandwich",
      description: "Toasted sandwich layered with chicken, egg, and salad.",
      price: 1450,
      prepTime: "15 mins",
      available: false,
      image:
        "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const emptyForm = {
    id: "",
    restaurantId: "101",
    categoryId: "",
    name: "",
    description: "",
    price: "",
    prepTime: "",
    available: true,
    image: "",
    imagePreview: "",
  };

  const [items, setItems] = useState(initialItems);
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

  const openEditModal = (item:any) => {
    setIsEditing(true);
    setFormData({
      id: item.id,
      restaurantId: String(item.restaurantId),
      categoryId: String(item.categoryId),
      name: item.name,
      description: item.description,
      price: String(item.price),
      prepTime: item.prepTime,
      available: item.available,
      image: item.image,
      imagePreview: item.image,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(emptyForm);
  };

  const handleChange = (e:any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e:any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      image: previewUrl,
      imagePreview: previewUrl,
    }));
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();

    const itemData = {
      id: isEditing ? Number(formData.id) : Date.now(),
      restaurantId: Number(formData.restaurantId),
      categoryId: Number(formData.categoryId),
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      prepTime: formData.prepTime,
      available: formData.available,
      image:
        formData.imagePreview ||
        "https://via.placeholder.com/150?text=Food",
    };

    if (isEditing) {
      setItems((prev) =>
        prev.map((item) => (item.id === itemData.id ? itemData : item))
      );
    } else {
      setItems((prev) => [itemData, ...prev]);
    }

    closeModal();
  };

  const handleDelete = (id:any) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    setItems((prev) => prev.filter((item) => item.id !== id));
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
                        src={item.image}
                        alt={item.name}
                        className="mi-table-image"
                      />
                    </td>
                    <td>{item.id}</td>
                    <td className="mi-item-name">{item.name}</td>
                    <td>{item.restaurantId}</td>
                    <td>{item.categoryId}</td>
                    <td className="mi-description-cell">{item.description}</td>
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
                  <div className="mi-upload-placeholder">No image selected</div>
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
                required
              />
            </div>

            <div className="mi-form-group">
              <label>Restaurant ID</label>
              <input
                type="number"
                name="restaurantId"
                value={formData.restaurantId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mi-form-group">
              <label>Category ID</label>
              <input
                type="number"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mi-form-group">
              <label>Price (LKR)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
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
                required
              />
            </div>

            <div className="mi-form-group mi-full-width">
              <label>Description</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
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


