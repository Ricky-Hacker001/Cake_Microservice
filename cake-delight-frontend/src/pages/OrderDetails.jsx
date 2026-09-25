import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/orders/${orderId}`);

      console.log("Order response:", response.data);

      setOrder(response.data);
    } catch (err) {
      console.error("Order details error:", err);
      console.error(
        "Backend response:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          "Unable to load order details."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading order...</h2>;
  }

  if (error) {
    return (
      <div className="order-details-page">
        <h2>{error}</h2>

        <button onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-page">
        <h2>Order not found.</h2>

        <button onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
  <div className="order-details-page">

    <div className="order-success-header">
      <div className="success-icon">
        ✓
      </div>

      <h1>Order Confirmed!</h1>

      <p>
        Your order has been placed successfully.
      </p>
    </div>

    <div className="order-id-card">

      <div>
        <span>Order ID</span>

        <strong>
          {order._id}
        </strong>
      </div>

      <div className="order-status">
        <span>Status</span>

        <strong>
          {order.status}
        </strong>
      </div>

    </div>

    <div className="order-content">

      {/* Customer Details */}

      <div className="customer-card">

        <h2>Customer Details</h2>

        <div className="customer-detail">

          <span>Name</span>

          <strong>
            {order.customerName}
          </strong>

        </div>

        <div className="customer-detail">

          <span>Email</span>

          <strong>
            {order.email}
          </strong>

        </div>

        <div className="customer-detail">

          <span>Phone</span>

          <strong>
            {order.phone}
          </strong>

        </div>

        <div className="customer-detail address-detail">

          <span>Delivery Address</span>

          <strong>
            {order.address}
          </strong>

        </div>

      </div>


      {/* Order Summary */}

      <div className="order-summary-card">

        <h2>Order Summary</h2>

        <div className="order-items">

          {order.items?.map((item, index) => (

            <div
              className="order-item"
              key={item.cakeId || index}
            >

              <div className="order-item-info">

                <h3>
                  {item.name}
                </h3>

                <p>
                  ₹{item.price} × {item.quantity}
                </p>

              </div>

              <strong className="item-total">
                ₹{item.price * item.quantity}
              </strong>

            </div>

          ))}

        </div>

        <div className="order-total">

          <span>Total</span>

          <strong>
            ₹{order.totalPrice}
          </strong>

        </div>

      </div>

    </div>


    <div className="order-actions">

      <button
        onClick={() => navigate("/")}
      >
        Continue Shopping
      </button>

    </div>

  </div>
);
}

export default OrderDetails;