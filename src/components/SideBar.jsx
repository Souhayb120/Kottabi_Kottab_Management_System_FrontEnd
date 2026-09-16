import { NavLink, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { toast } from "react-toastify";

function Sidebar() {
  const navigate = useNavigate();

  const handleClick = () => {
    AuthService.logout();
    toast.info("you just logged out !!")
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-title">LogiTrack</div>
        <div className="brand-sub">Livraison Systems</div>
      </div>

      <div className="container_side_bar">
        <ul className="nav-list">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <svg
                className="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 13h8V3H3z" />
                <path d="M13 21h8v-6h-8z" />
                <path d="M13 11h8V3h-8z" />
                <path d="M3 21h8v-4H3z" />
              </svg>
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/clients"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <svg
                className="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3-6 8-6s8 2 8 6" />
              </svg>
              Clients
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/produits"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <svg
                className="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 7l9-4 9 4-9 4-9-4z" />
                <path d="M3 7v10l9 4 9-4V7" />
                <path d="M12 11v10" />
              </svg>
              Produits
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/commandes"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <svg
                className="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
                <path d="M3 4h2l2.5 11h11l2-8H7" />
              </svg>
              Commandes
            </NavLink>
          </li>

       

          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <svg
                className="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8h.01" />
                <path d="M12 12v5" />
              </svg>
              About
            </NavLink>
          </li>
        </ul>

        <div className="dex">
          <svg
            className="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <path d="M10 17l5-5-5-5" />
            <path d="M15 12H3" />
          </svg>

          <button onClick={handleClick}>Logout</button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;