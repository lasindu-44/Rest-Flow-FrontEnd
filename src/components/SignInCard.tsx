import { useState } from "react";

import "../css/SignIn.css";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BackendURL } from "../Services/BackendURL";
import { getUserRole } from "../Services/ReadToke";
export default function SignIn() {
  interface FormData {
    username: string;
    password: string;
  }
  const navigate = useNavigate();

  const [errors, setErrors] = useState<any>({});

  const [inputs, setForm] = useState<FormData>({
    username: "",
    password: "",
  });

  const SignIn = async () => {
    try {
      const response = await fetch(BackendURL + "/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ 1. Save token
        localStorage.setItem("token", data.token);
        localStorage.setItem("expiration", data.expiration);

        console.log("Login success:", data);

        // ✅ 2. Redirect to Home
        navigate("/");
      } else {
        alert(data.message || "Login failed");
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
      SignIn();
    }
  };

  const validate = () => {
    const newErrors: any = {};

    if (!inputs.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!inputs.password.trim()) {
      newErrors.password = "Password is required";
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
    <div className="signin-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign In</h2>
        <p className="auth-subtitle">
          Welcome back! Please enter your details.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email or Username"
            className="auth-input"
            name="username"
            value={inputs.username}
            onChange={handleChange}
          />
          {errors.username && (
            <span className="error-text">{errors.username}</span>
          )}
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

          <button type="submit" className="auth-button">
            Sign In
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>
        <GoogleOAuthProvider clientId="131207071599-l60d3hng41d5bi2fd07nash8i5jq1dk1.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const idToken = credentialResponse.credential;

                const response = await fetch(
                  BackendURL + "/api/Auth/google-login",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ idToken }),
                  },
                );

                const data = await response.json();

                if (response.ok) {
                  // ✅ 1. Save token
                  localStorage.setItem("token", data.token);
                  localStorage.setItem("expiration", data.expiration);
                  console.log("Login success:", data);
                  const userRole = await getUserRole();
                  console.log("User Role:", userRole);
                  if (userRole === "SystemAdmin") {
                    navigate("/test");
                  } else {
                    navigate("/");
                  }
                } else {
                  alert(data.message);
                }
              } catch (error) {
                console.error("Error:", error);
                alert("Something went wrong");
              }
            }}
            onError={() => console.log("Login Failed")}
          />
        </GoogleOAuthProvider>
        <p className="auth-footer">
          Don’t have an account? <a href="/SignUp">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
