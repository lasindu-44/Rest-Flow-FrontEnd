import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Store,
  MapPin,
  Phone,
  Mail,
  Image as ImageIcon,
  X,
  CheckCircle2,
  UserPlus,
  UtensilsCrossed,
} from "lucide-react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import "../css/Tailwind.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Services/SupaBase";
import { useEffect } from "react";
import Swal from "sweetalert2";

const emptyForm = {
  name: "",
  cuisine: "",
  email: "",
  phone: "",
  address: "",
  status: "Active",
  imageurl: "",
  openTime: "",
  closeTime: "",
  image: null,
};
function InputField({
  label,
  icon: Icon,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: any) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="input-wrapper">
        {Icon && <Icon size={16} className="input-icon" />}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="form-input"
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  icon: Icon,
  name,
  value,
  onChange,
  options,
}: any) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="input-wrapper">
        {Icon && <Icon size={16} className="input-icon" />}
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="form-input"
        >
          {options.map((option: any) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function RestaurantCard({ restaurant, onEdit, onDelete }: any) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="restaurant-card"
    >
      <div className="restaurant-card-image-wrap">
        {restaurant.imageUrl ? (
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="restaurant-card-image"
          />
        ) : (
          <div className="restaurant-card-image-empty">
            <Store size={40} />
          </div>
        )}

        <span
          className={`status-badge ${
            restaurant.isActive ? "status-active" : "status-inactive"
          }`}
        >
          {restaurant.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="restaurant-card-body">
        <div className="restaurant-card-header">
          <div>
            <h3 className="restaurant-title">{restaurant.name}</h3>
            <p className="restaurant-subtitle">{restaurant.cuisineName}</p>
          </div>
        </div>

        <div className="restaurant-info">
          <div className="info-row">
            <MapPin size={16} className="info-icon" />
            <span>{restaurant.address}</span>
          </div>
          <div className="info-row">
            <Phone size={16} className="info-icon" />
            <span>{restaurant.phone}</span>
          </div>
          <div className="info-row">
            <Mail size={16} className="info-icon" />
            <span className="truncate">{restaurant.email}</span>
          </div>
        </div>

        <div className="card-actions">
          <div className="tooltip">
            <button onClick={() => onEdit(restaurant)} className="icon-btn">
              <Edit3 size={16} />
            </button>
            <span className="tooltip-text">Edit</span>
          </div>

          <div className="tooltip">
            <button
              onClick={() => onDelete(restaurant)}
              className="icon-btn danger-icon-btn"
            >
              <Trash2 size={16} />
            </button>
            <span className="tooltip-text">Delete</span>
          </div>

          <div className="tooltip">
            <button
              onClick={() => onAddMenu(restaurant)}
              className="icon-btn success-icon-btn"
            >
              <UtensilsCrossed size={16} />
            </button>
            <span className="tooltip-text">Add Menu</span>
          </div>

          <div className="tooltip">
            <button
              onClick={() => onAddStaff(restaurant)}
              className="icon-btn info-icon-btn"
            >
              <UserPlus size={16} />
            </button>
            <span className="tooltip-text">Add Staff</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const onAddMenu = (restaurant: any) => {
  console.log("Add menu for:", restaurant);
};

const onAddStaff = (restaurant: any) => {
  console.log("Add staff for:", restaurant);
};

function RestaurantTable({ restaurants, onEdit, onDelete }: any) {
  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="restaurant-table">
          <thead>
            <tr>
              <th>Restaurant</th>
              <th>Cuisine</th>
              <th>Contact</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant: any) => (
              <tr key={restaurant.id}>
                <td>
                  <div className="table-restaurant-cell">
                    <div className="table-thumb">
                      {restaurant.imageUrl ? (
                        <img
                          src={restaurant.imageUrl}
                          alt={restaurant.name}
                          className="table-thumb-img"
                        />
                      ) : (
                        <div className="table-thumb-empty">
                          <Store size={18} />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="table-name">{restaurant.name}</p>
                      <p className="table-address">{restaurant.address}</p>
                    </div>
                  </div>
                </td>
                <td>{restaurant.cuisineName}</td>
                <td>
                  <div>
                    <p>{restaurant.phone}</p>
                    <p className="table-muted">{restaurant.email}</p>
                  </div>
                </td>
                <td>
                  <span>{restaurant.isActive ? "Active" : "Inactive"}</span>
                </td>
                <td className="text-right">
                  <div className="table-actions">
                    <div className="tooltip">
                      <button
                        onClick={() => onEdit(restaurant)}
                        className="icon-btn"
                      >
                        <Edit3 size={16} />
                      </button>
                      <span className="tooltip-text">Edit</span>
                    </div>

                    <div className="tooltip">
                      <button
                        onClick={() => onDelete(restaurant)}
                        className="icon-btn danger-icon-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                      <span className="tooltip-text">Delete</span>
                    </div>

                    <div className="tooltip">
                      <button
                        onClick={() => onAddMenu(restaurant)}
                        className="icon-btn success-icon-btn"
                      >
                        <UtensilsCrossed size={16} />
                      </button>
                      <span className="tooltip-text">Add Menu</span>
                    </div>

                    <div className="tooltip">
                      <button
                        onClick={() => onAddStaff(restaurant)}
                        className="icon-btn info-icon-btn"
                      >
                        <UserPlus size={16} />
                      </button>
                      <span className="tooltip-text">Add Staff</span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function RestaurantAdminPanel() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [viewMode, setViewMode] = useState("grid");
  const [toast, setToast] = useState("");
  const [Loading, SetLoading] = useState(false);
  const [cuisineOptions, setCuisineOptions] = useState([]);

  const fetchCuisines = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://localhost:7169/api/Restaurant/CuisineTypes",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 401) {
        alert("Unauthorized");
        // e.g. redirect to login
        navigate("/SignIn");
        return;
      }

      if (!response.ok) {
        alert("Failed to fetch cuisines");
      }

      const data = await response.json();
      console.log("Fetched cuisines:", data);
      setCuisineOptions(data);
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Fetch cuisines completed");
    }
  };

  const fetchRestaurants = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://localhost:7169/api/Restaurant/fetchRestaurants",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 401) {
        alert("Unauthorized");
        // e.g. redirect to login
        navigate("/SignIn");
        return;
      }

      if (!response.ok) {
        alert("Failed to fetch Restaurants");
      }

      const data = await response.json();
      console.log("Fetched restaurants:", data);
      setRestaurants(data);
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Fetch restaurants completed");
    }
  };

  useEffect(() => {
    fetchCuisines();
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    const test = async () => {
      try {
        console.log("Testing form data:", formData);
      } catch (error) {}
    };

    test();
  }, [formData]);

  const filteredRestaurants = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return restaurants;

    return restaurants.filter((item: any) =>
      [
        item.name,
        item.cuisineName,
        item.address,
        item.phone,
        item.email,
        item.isActive,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [restaurants, searchTerm]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (restaurant: any) => {
    setEditingId(restaurant.id);
    setFormData(restaurant);
    setFormData((prev) => ({
      ...prev,
      imageurl: restaurant.imageUrl,
      image: restaurant.image,
    }));

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleChange = (e: any) => {
    console.log("Input changed:", e.target.name, e.target.value);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      imageurl: imageUrl,
      image: file,
    }));
  };

  /*Save Files To supabase storage*/
  const uploadImage = async (file: any) => {
    if (!file && editingId) return formData.imageurl; // If no new file but we are editing, keep existing image
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    SetLoading(true);

    if (
      !formData.name ||
      !formData.cuisine ||
      !formData.phone ||
      !formData.address ||
      !formData.openTime ||
      !formData.closeTime ||
      (!editingId && !formData.image) ||
      (editingId && !formData.imageurl)
    ) {
      showToast("Please fill all required fields.");
      SetLoading(false);
      return;
    }

    console.log("Form data to submit:", formData);
    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("cuisine", formData.cuisine);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("openTime", formData.openTime);
    formDataToSend.append("closeTime", formData.closeTime);

    const imageUrl = await uploadImage(formData.image);
    if (!imageUrl) {
      alert("Image upload failed. Please try again.");
      return;
    } else {
      formDataToSend.append("imageUrl", imageUrl);
      const token = localStorage.getItem("token"); // your JWT

      if (editingId) {
        try {
          const response = await fetch(
            "https://localhost:7169/api/Restaurant/UpdateRestaurant?RestaurantId=" +
              editingId,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formDataToSend,
            },
          );

          if (!response.ok) {
            alert("Restaurant added Faild.");
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
            alert("Restaurant Updated successfully.");
            const data = await response.json();
            console.log(data);
            fetchRestaurants();
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          const response = await fetch(
            "https://localhost:7169/api/Restaurant/upload",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formDataToSend,
            },
          );

          if (!response.ok) {
            alert("Restaurant added Faild.");
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
            SetLoading(false);

            return;
          }

          if (response.ok) {
            alert("Restaurant added successfully.");
            const data = await response.json();
            console.log(data);
            fetchRestaurants();
          }
        } catch (error) {
          console.error(error);
        }
      }

      SetLoading(false);
      closeModal();

      /*setRestaurants((prev) => [newRestaurant, ...prev]);*/
    }
  };

  const handleDelete = (restaurant: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete "${restaurant.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        ConfirmeDelete(restaurant.id);
        Swal.fire("Deleted!", "Restaurant removed.", "success");
      }
    });
  };

  const ConfirmeDelete = async (id: any) => {
    const token = localStorage.getItem("token"); // your JWT

    try {
      const response = await fetch(
        "https://localhost:7169/api/Restaurant/DeactivateRestaurant?RestaurantId=" +
          id,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        alert("Restaurant Deactivated Faild.");
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
        alert("Restaurant Deactivated successfully.");
        const data = await response.json();
        console.log(data);
        fetchRestaurants();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const activeCount = restaurants.filter((r: any) => r.isActive).length;

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="stats-grid">
          <div className="hero-card">
            <div className="hero-header">
              <div className="hero-icon-box">
                <Store size={24} />
              </div>
              <div>
                <p className="hero-label">Admin Master File</p>
                <h1 className="hero-title">Restaurant Management</h1>
              </div>
            </div>
            <p className="hero-text">
              Add, view, edit, and delete restaurants from a clean responsive
              admin panel built for food ordering systems.
            </p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Total Restaurants</p>
            <h2 className="stat-value">{restaurants.length}</h2>
            <p className="stat-text">All registered restaurant records</p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Active Restaurants</p>
            <h2 className="stat-value">{activeCount}</h2>
            <p className="stat-text">Currently available on the platform</p>
          </div>
        </div>

        <div className="toolbar-card">
          <div className="toolbar">
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search restaurants, cuisine, status..."
                className="search-input"
              />
            </div>

            <div className="toolbar-actions">
              <div className="toggle-group">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`toggle-btn ${viewMode === "grid" ? "toggle-btn-active" : ""}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`toggle-btn ${viewMode === "table" ? "toggle-btn-active" : ""}`}
                >
                  Table
                </button>
              </div>

              <button onClick={openAddModal} className="btn btn-primary">
                <Plus size={16} />
                Add Restaurant
              </button>
            </div>
          </div>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div className="empty-card">
            <Store size={40} className="empty-icon" />
            <h3>No restaurants found</h3>
            <p>Try changing your search or add a new restaurant.</p>
          </div>
        ) : viewMode === "grid" ? (
          <motion.div layout className="restaurant-grid">
            <AnimatePresence>
              {filteredRestaurants.map((restaurant: any) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <RestaurantTable
            restaurants={filteredRestaurants}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              className="modal-box"
            >
              <div className="modal-header">
                <div>
                  <h2>
                    {editingId ? "Edit Restaurant" : "Add New Restaurant"}
                  </h2>
                  <p>
                    Fill the details below to{" "}
                    {editingId
                      ? "update the restaurant record"
                      : "create a new restaurant record"}
                    .
                  </p>
                </div>
                <button onClick={closeModal} className="close-btn">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="restaurant-form">
                <InputField
                  label="Restaurant Name *"
                  icon={Store}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter restaurant name"
                />

                <SelectField
                  label="Cuisine Type *"
                  icon={CheckCircle2}
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleChange}
                  options={cuisineOptions}
                />

                <InputField
                  label="Email"
                  icon={Mail}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="restaurant@email.com"
                  type="email"
                />

                <InputField
                  label="Phone Number *"
                  icon={Phone}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+94 xx xxx xxxx"
                />

                <div className="full-width">
                  <InputField
                    label="Address *"
                    icon={MapPin}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter restaurant address"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Open Time *</label>
                  <TimePicker
                    onChange={(value) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        openTime: value,
                      }))
                    }
                    value={formData.openTime}
                    disableClock={false}
                    clearIcon={null}
                    className="custom-time-picker"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Close Time *</label>
                  <TimePicker
                    onChange={(value) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        closeTime: value,
                      }))
                    }
                    value={formData.closeTime}
                    disableClock={false}
                    clearIcon={null}
                    className="custom-time-picker"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Upload Image *</label>

                  <div className="file-upload-box">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="file-input"
                    />

                    <div className="file-upload-content">
                      <ImageIcon size={24} />
                      <p>Click to upload image</p>
                    </div>
                  </div>
                </div>

                <div className="full-width">
                  <div className="image-preview-box">
                    <div className="image-preview-inner">
                      {formData.imageurl
                        ? (console.log(
                            "Displaying image preview:",
                            formData.imageurl,
                          ),
                          (
                            <img
                              src={formData.imageurl}
                              alt="Preview"
                              className="image-preview"
                            />
                          ))
                        : (console.log("No image to preview", formData.image),
                          (
                            <div className="image-placeholder">
                              <ImageIcon size={40} />
                              <p>Image preview will appear here</p>
                            </div>
                          ))}
                    </div>
                  </div>
                </div>

                <div className="form-actions full-width">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  {Loading ? (
                    <button type="submit" className="btn btn-primary" disabled>
                      Processing...
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-primary">
                      {editingId ? "Update Restaurant" : "Save Restaurant"}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="toast"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
