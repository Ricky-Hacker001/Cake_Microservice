import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">

      <div className="admin-dashboard-header">

        <h1>Admin Dashboard</h1>

        <p>
          Manage cakes and customer orders.
        </p>

      </div>


      <div className="admin-dashboard-cards">

        {/* Cake Management */}

        <div className="admin-dashboard-card">

          <div className="admin-card-icon">
            🍰
          </div>

          <h2>
            Manage Cakes
          </h2>

          <p>
            Add new cakes, update existing cakes,
            and remove cakes from the catalog.
          </p>

          <button
            onClick={() =>
              navigate("/admin/cakes")
            }
          >
            Manage Cakes
          </button>

        </div>


        {/* Order Management */}

        <div className="admin-dashboard-card">

          <div className="admin-card-icon">
            📦
          </div>

          <h2>
            Manage Orders
          </h2>

          <p>
            View customer orders and update
            their order status.
          </p>

          <button
            onClick={() =>
              navigate("/admin/orders")
            }
          >
            Manage Orders
          </button>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;