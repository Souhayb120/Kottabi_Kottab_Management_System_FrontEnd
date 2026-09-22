import { Navigate } from "react-router-dom";
import AuthService from "../services/AuthService";

const RoleGuard = ({ roles, children }) => {
  const role = AuthService.getRawRole();

  if (!roles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleGuard;