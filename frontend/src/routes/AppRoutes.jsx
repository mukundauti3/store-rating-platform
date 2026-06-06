import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import UserDashboard from "../pages/UserDashboard";
import StoreOwnerDashboard from "../pages/StoreOwnerDashboard";

function AppRoutes() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Login />;
  }

  if (role === "ADMIN") {
    return <AdminDashboard />;
  }

  if (role === "STORE_OWNER") {
    return <StoreOwnerDashboard />;
  }

  return <UserDashboard />;
}

export default AppRoutes;