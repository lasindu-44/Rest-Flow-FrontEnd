import { useState } from "react";
import "../css/SignUp.css";
import { useNavigate } from "react-router-dom";
export default function SignUp() {
  const navigate = useNavigate();

  interface FormData {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone: string; // changed to string
    password: string;
    isRestaurantOwner: boolean;
  }

  const [errors, setErrors] = useState<any>({});

  const [inputs, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    isRestaurantOwner: false,
  });

  const registerUser = async () => {
    try {
      const response = await fetch("https://localhost:7169/api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Success:", data);
        alert(data.message);
        navigate("/SignIn");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    // If no errors → submit
    if (Object.keys(validationErrors).length === 0) {
      console.log("Form submitted:", inputs);
      registerUser();
    }
  };

  const validate = () => {
    const newErrors: any = {};

    if (!inputs.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!inputs.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!inputs.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!inputs.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!inputs.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!inputs.password.trim()) {
      newErrors.password = "Password is required";
    } else if (inputs.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  // ✅ handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign Up</h2>
        <p className="auth-subtitle">Create your account to get started.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="auth-input"
            value={inputs.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <span className="error-text">{errors.firstName}</span>
          )}
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="auth-input"
            value={inputs.lastName}
            onChange={handleChange}
          />
          {errors.lastName && (
            <span className="error-text">{errors.lastName}</span>
          )}
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="auth-input"
            value={inputs.username}
            onChange={handleChange}
          />
          {errors.username && (
            <span className="error-text">{errors.username}</span>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="auth-input"
            value={inputs.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            className="auth-input"
            value={inputs.phone}
            onChange={handleChange}
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="auth-input"
            value={inputs.password}
            onChange={handleChange}
          />
          {errors.password && (
            <span className="error-text">{errors.password}</span>
          )}
          {/* ✅ Checkbox */}
          <div className="checkbox-group">
            <input
              type="checkbox"
              name="isRestaurantOwner"
              checked={inputs.isRestaurantOwner}
              onChange={handleChange}
            />
            <label>I am a Restaurant Owner</label>
          </div>
          {errors.isRestaurantOwner && (
            <span className="error-text">{errors.isRestaurantOwner}</span>
          )}
          <button type="submit" className="auth-button">
            Create Account
          </button>
          <div className="divider">
            {" "}
            <span>OR</span>{" "}
          </div>{" "}
          <button className="google-button"> Continue with Google </button>{" "}
          <p className="auth-footer">
            {" "}
            Already have an account? <a href="/SignIn ">Sign In</a>{" "}
          </p>
        </form>
      </div>
    </div>
  );
}
