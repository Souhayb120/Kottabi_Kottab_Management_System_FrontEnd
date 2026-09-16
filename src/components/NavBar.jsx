import "../index.css";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const token = localStorage.getItem("token");

  const decoded = jwtDecode(token);
  const role = decoded.role;

  return (
    <div className="topbar">
      <ul className="flex justify-center">
        <li><h1>{`${decoded.sub} `}</h1>{role}</li>
      </ul>
    </div>
  );
}

export default Navbar;
