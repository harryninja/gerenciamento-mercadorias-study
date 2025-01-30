import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../../src/auth/AuthService";

const PrivateRoute = () => {
  return getToken() ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
