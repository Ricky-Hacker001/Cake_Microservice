import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingOrderId, setUpdatingOrderId] = useState(null);


  useEffect(() => {
    fetchOrders();
  }, []);


  // =========================
  // Get all orders
  // =========================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders");

      setOrders(response.data);

    } catch (err) {

      console.error(
        "Fetch orders error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load orders."
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================
  // Update order status
  // =========================

  const handleStatusChange = async (
    orderId,
    status
  ) => {

    try {

      setUpdatingOrderId(orderId);
      setError("");

      const response = await api.patch(
        `/orders/${orderId}/status`,
        {
          status: status
        }
      );

      console.log(
        "Order status response:",
        response.data
      );


      // Update the order in local state
      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: status
              }
            : order
        )
      );

    } catch (err) {

      console.error(
        "Update order status error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to update order status."
      );

    } finally {

      setUpdatingOrderId(null);

    }
  };


  // =========================
  // Loading
  // =========================

  if (loading) {

    return (
      <div className="admin-page">

        <h2>
          Loading orders...
        </h2>

      </div>
    );

  }


  // =========================
  // Page
  // =========================

  return (
    <div className="admin-page">

      {/* Header */}

      <div className="admin-form-header">

        <div>

          <h1>
            Manage Orders
          </h1>

          <p>
            View customer orders and update
            their order status.
          </p>

        </div>


        <button
          type="button"
          onClick={() =>
            navigate("/admin")
          }
        >
          ← Admin Dashboard
        </button>

      </div>


      {/* Error */}

      {error && (

        <div className="admin-form-error">
          {error}
        </div>

      )}


      {/* No orders */}

      {orders.length === 0 ? (

        <div className="admin-empty-state">

          <h2>
            No Orders
          </h2>

          <p>
            There are currently no customer
            orders.
          </p>

        </div>

      ) : (

        <div className="admin-orders-list">

          {orders.map((order) => (

            <div
              className="admin-order-card"
              key={order._id}
            >

              {/* Order Header */}

              <div className="admin-order-header">

                <div>

                  <h2>
                    Order #{order._id}
                  </h2>

                  <p>
                    Customer:{" "}
                    <strong>
                      {order.customerName}
                    </strong>
                  </p>

                </div>


                <span
                  className={`order-status ${order.status
                    ?.toLowerCase()
                    .replace(
                      " ",
                      "-"
                    )}`}
                >
                  {order.status}
                </span>

              </div>


              {/* Customer details */}

              <div className="admin-order-customer">

                <p>
                  <strong>
                    Email:
                  </strong>{" "}
                  {order.email}
                </p>

                <p>
                  <strong>
                    Phone:
                  </strong>{" "}
                  {order.phone}
                </p>

                <p>
                  <strong>
                    Address:
                  </strong>{" "}
                  {order.address}
                </p>

              </div>


              {/* Items */}

              <div className="admin-order-items">

                <h3>
                  Items
                </h3>

                {order.items?.map(
                  (item, index) => (

                    <div
                      className="admin-order-item"
                      key={
                        item.cakeId ||
                        index
                      }
                    >

                      <span>
                        {item.name}
                      </span>

                      <span>
                        ₹{item.price}
                        {" × "}
                        {item.quantity}
                      </span>

                      <strong>
                        ₹
                        {item.price *
                          item.quantity}
                      </strong>

                    </div>

                  )
                )}

              </div>


              {/* Total */}

              <div className="admin-order-total">

                <strong>
                  Total
                </strong>

                <strong>
                  ₹{order.totalPrice}
                </strong>

              </div>


              {/* Actions */}

              <div className="admin-order-actions">

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/order/${order._id}`
                    )
                  }
                >
                  View Order
                </button>


                <label>
                  Change Status:
                </label>


                <select
                  value={order.status}
                  disabled={
                    updatingOrderId ===
                    order._id
                  }
                  onChange={(event) =>
                    handleStatusChange(
                      order._id,
                      event.target.value
                    )
                  }
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Processing">
                    Processing
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                </select>


                {updatingOrderId ===
                  order._id && (

                  <span>
                    Updating...
                  </span>

                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default AdminOrders;