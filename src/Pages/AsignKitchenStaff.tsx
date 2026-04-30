import React, { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BackendURL } from "../Services/BackendURL";

import "../css/AsignUsers.css";

export default function RestaurantUserAssign() {
  const location = useLocation();
  const navigate = useNavigate();

  const restaurant = location.state;

  //console.log(restaurant); //
  const restaurantName = restaurant.name;

  interface SystemUsers {
    id: number;
    email: string;
  }

  const [systemusers, setUers] = useState<SystemUsers[]>([]);
  const [userName, setUserName] = useState("");
  const [selectedUser, setSelectedUser] = useState<SystemUsers | null>(null);
  const [message, setMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    FetchSystemUsers();
  }, []);

  const FetchSystemUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(BackendURL+"/api/User/GetUsers", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        //alert("Unauthorized");
        // e.g. redirect to login
        navigate("/SignIn");
        return;
      }

      if (!response.ok) {
        alert("Failed to fetch Users");
      }

      const data = await response.json();
      console.log("Fetched Users:", data);
      setUers(data);
      setUers(data);
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Fetch users completed");
    }
  };

  const filteredUsers = useMemo(() => {
    if (!userName.trim()) return [];

    return systemusers.filter((user: SystemUsers) =>
      user.email.toLowerCase().includes(userName.toLowerCase()),
    );
  }, [userName]);

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setUserName(value);
    setSelectedUser(null);
    setMessage("");
    setShowSuggestions(true);
  };

  const handleSelectUser = (user: any) => {
    console.log("selected Item", user);
    setUserName(user.email);
    setSelectedUser(user);
    setShowSuggestions(false);
    setMessage("");
  };

  const handleAssign =async (selecteduser: any) => {
    if (!userName.trim()) {
      setMessage("Please enter a user name.");
      return;
    }

    if (!selectedUser) {
      setMessage("Please select a valid user from the suggestions.");
      return;
    }
    const token = localStorage.getItem("token"); // your JWT

    try {
      const response = await fetch(
        BackendURL+"/api/User/AsigntotheStaff?UserId=" +
          selectedUser.id +
          "&RestId=" +
          restaurant.id,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        },
      );

      // Handle unauthorized
      if (response.status === 401) {
        console.log("Unauthorized - not logged in or token invalid");
        navigate("/SignIn");
        return;
      }

      // Handle forbidden
      if (response.status === 403) {
        console.log("Forbidden - not an admin");
        Swal.fire("Error", "Access denied", "error");
        return;
      }

      // Handle other errors
      if (!response.ok) {
        Swal.fire("Error", "Staff Assign Failed", "error");
        return;
      }

      // Success
      Swal.fire("Success", "Successfully assigned.", "success");

      setUserName("");
      setSelectedUser(null);
      setMessage("");
      setShowSuggestions(false);
    } catch (error) {
      console.error("Request failed:", error);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <div className="rua-shell">
      <div className="rua-card">
        <h1 className="rua-topTitle">{restaurantName}</h1>
        <p className="rua-subText">
          Assign a user to this restaurant by typing the user name and selecting
          the correct suggestion.
        </p>

        <div className="rua-fieldWrap">
          <label className="rua-labelText">User Name</label>
          <input
            type="text"
            className="rua-inputBox"
            placeholder="Type user name here"
            value={userName}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
          />

          {showSuggestions && userName.trim() && (
            <div className="rua-suggestPanel">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    className="rua-suggestItem"
                    onClick={() => handleSelectUser(user)}
                  >
                    {user.email}
                  </button>
                ))
              ) : (
                <div className="rua-emptyState">No matching users found.</div>
              )}
            </div>
          )}

          {selectedUser && (
            <div className="rua-selectedBadge">
              Selected: {selectedUser.email}
            </div>
          )}
        </div>

        <button
          className="rua-actionBtn"
          onClick={() => handleAssign(selectedUser)}
        >
          Assign User
        </button>

        {message && <div className="rua-messageBox">{message}</div>}
      </div>
    </div>
  );
}
