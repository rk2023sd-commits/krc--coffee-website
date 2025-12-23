import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminNavbar() {
  const { logout } = useAuth();

  return (
    <nav>
      <Link to="/admin/dashboard">Dashboard</Link> |{" "}
      <Link to="/admin/products">Products</Link> |{" "}
      <Link to="/admin/orders">Orders</Link> |{" "}
      <button onClick={logout}>Logout</button>
    </nav>
  );
}
