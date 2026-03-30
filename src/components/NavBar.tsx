import { useState } from "react";
import { useEffect } from "react";
import {getUserRole} from "../Services/ReadToke"

import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../css/Navbar.css";



function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [operationsOpen, setOperationsOpen] = useState(false);
  const [masterFilesOpen, setMasterFilesOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
    const [role, setRole] = useState<string | null>(null);

   const location = useLocation();

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
  }, [location.pathname]);

  const closeMenu = () => {
    setMenuOpen(false);
    setOperationsOpen(false);
    setMasterFilesOpen(false);
    setDashboardOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" onClick={closeMenu}>
          RestFlow
        </Link>
      </div>

      <button
        className={`menu-toggle ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="nav-link" onClick={closeMenu}>
          Home
        </Link>

        <Link to="/favorites" className="nav-link" onClick={closeMenu}>
          Favorites
        </Link>

        {role === "SystemAdmin" && (
          <div className="dropdown-block">
            <button
              className="nav-link dropdown-btn"
              onClick={() => setOperationsOpen(!operationsOpen)}
            >
              Operations
              <span className={`arrow ${operationsOpen ? "rotate" : ""}`}>
                ▾
              </span>
            </button>

            <div className={`dropdown-panel ${operationsOpen ? "show" : ""}`}>
              <div className="submenu-block">
                <button
                  className="dropdown-item submenu-btn"
                  onClick={() => setMasterFilesOpen(!masterFilesOpen)}
                >
                  Master Files
                  <span className={`arrow ${masterFilesOpen ? "rotate" : ""}`}>
                    ▾
                  </span>
                </button>

                <div
                  className={`submenu-panel ${masterFilesOpen ? "show" : ""}`}
                >
                  <Link
                    to="/operations/master-files/movies"
                    className="dropdown-link"
                    onClick={closeMenu}
                  >
                    Add Restuarent
                  </Link>
                  <Link
                    to="/operations/master-files/genres"
                    className="dropdown-link"
                    onClick={closeMenu}
                  >
                    Create Menu
                  </Link>
                  <Link
                    to="/operations/master-files/actors"
                    className="dropdown-link"
                    onClick={closeMenu}
                  >
                    Add Kitchen Supervisor
                  </Link>
                </div>
              </div>

              <div className="submenu-block">
                <button
                  className="dropdown-item submenu-btn"
                  onClick={() => setDashboardOpen(!dashboardOpen)}
                >
                  Dashboard
                  <span className={`arrow ${dashboardOpen ? "rotate" : ""}`}>
                    ▾
                  </span>
                </button>

                <div className={`submenu-panel ${dashboardOpen ? "show" : ""}`}>
                  <Link
                    to="/operations/dashboard/admin"
                    className="dropdown-link"
                    onClick={closeMenu}
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/operations/dashboard/user"
                    className="dropdown-link"
                    onClick={closeMenu}
                  >
                    Kitchen Supervisor Dashboard
                  </Link>
                  <Link
                    to="/operations/dashboard/reports"
                    className="dropdown-link"
                    onClick={closeMenu}
                  >
                    Reports
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <Link to="/signin" className="nav-link" onClick={closeMenu}>
          SignIn
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
