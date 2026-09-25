import { useNavigate } from "react-router-dom";

function AdminNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="admin-navbar">

      <div
        className="admin-navbar-brand"
        onClick={() => navigate("/admin")}
      >
        Cake Delight Admin
      </div>

      <div className="admin-navbar-links">

        <button
          onClick={() => navigate("/admin")}
        >
          Dashboard
        </button>

        <button
          onClick={() => navigate("/admin/cakes")}
        >
          Cakes
        </button>

        <button
          onClick={() => navigate("/admin/orders")}
        >
          Orders
        </button>

        <button
          onClick={() => navigate("/")}
        >
          Customer Site
        </button>

      </div>

    </nav>
  );
}

export default AdminNavbar;