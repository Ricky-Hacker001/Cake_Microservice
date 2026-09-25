import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders");

      console.log("Orders response:", response.data);

      setOrders(response.data);
    } catch (err) {
      console.error("Orders error:", err);
      console.error(
        "Backend response:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading orders...</h2>;
  }

  if (error) {
    return (
      <div className="orders-page">
        <h2>{error}</h2>

        <button onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="orders-page">

      <div className="orders-header">

        <div>
          <h1>Orders</h1>

          <p>
            View orders and their
            current status.
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>

      </div>

      {orders.length === 0 ? (

        <div className="empty-orders">

          <h2>No orders yet</h2>

          <p>
            Users haven't placed any orders yet.
          </p>

          <button
            onClick={() => navigate("/")}
          >
            Start Shopping
          </button>

        </div>

      ) : (

        <div className="orders-list">

          {orders.map((order) => (

            <div
              className="order-list-card"
              key={order._id}
            >

              <div className="order-list-info">

                <p className="order-label">
                  Order ID
                </p>

                <h3>
                  #{order._id}
                </h3>

                <p>
                  <strong>Customer:</strong>{" "}
                  {order.customerName}
                </p>

              </div>


              <div className="order-list-total">

                <p className="order-label">
                  Total
                </p>

                <strong>
                  ₹{order.totalPrice}
                </strong>

              </div>


              <div className="order-list-status">

                <p className="order-label">
                  Status
                </p>

                <span
                  className={`order-status-badge ${order.status?.toLowerCase()}`}
                >
                  {order.status}
                </span>

              </div>


              <div className="order-list-action">

                <button
                  onClick={() =>
                    navigate(`/order/${order._id}`)
                  }
                >
                  View Order →
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Orders;