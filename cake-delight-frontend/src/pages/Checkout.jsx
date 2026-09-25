import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";

function Checkout() {
  const { basketId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [orderId, setOrderId] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCheckout = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Frontend phone validation
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(formData.phone)) {
      setError(
        "Phone number must be a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/orders/checkout", {
  basketId,
  customerName: formData.customerName,
  email: formData.email,
  address: formData.address,
  phone: formData.phone,
});

console.log("Checkout response:", response.data);

const orderId = response.data.orderId;
localStorage.setItem(
  "customerEmail",
  formData.email
);

localStorage.removeItem("basketId");

navigate(`/order/${orderId}`);

    } catch (err) {
      console.error("Checkout error:", err);
      console.error(
        "Backend response:",
        err.response?.data
      );

      // Handle express-validator errors
      if (
        err.response?.data?.errors &&
        Array.isArray(err.response.data.errors)
      ) {
        const firstError =
          err.response.data.errors[0];

        setError(firstError.msg);
      } else {
        setError(
          err.response?.data?.message ||
          "Unable to place order. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // SUCCESS SCREEN
  if (success) {
    return (
      <div className="checkout-page">

        <div className="order-success">

          <h1>Order Placed Successfully! 🎉</h1>

          <p>
            Your order has been placed successfully.
          </p>

          <p>
            <strong>Order ID:</strong>{" "}
            {orderId}
          </p>

          <button
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="checkout-page">

      <h1>Checkout</h1>

      <p>
        Please enter your details to place your order.
      </p>

      <form
        className="checkout-form"
        onSubmit={handleCheckout}
      >

        <div className="form-group">

          <label htmlFor="customerName">
            Customer Name
          </label>

          <input
            id="customerName"
            name="customerName"
            type="text"
            value={formData.customerName}
            onChange={handleChange}
            required
          />

        </div>

        <div className="form-group">

          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

        </div>

        <div className="form-group">

          <label htmlFor="phone">
            Phone
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            maxLength={10}
            placeholder="9876543210"
            required
          />

        </div>

        <div className="form-group">

          <label htmlFor="address">
            Address
          </label>

          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />

        </div>

        {error && (
          <p className="checkout-error">
            {error}
          </p>
        )}

        <div className="checkout-actions">

          <button
            type="button"
            onClick={() =>
              navigate(`/basket/${basketId}`)
            }
            disabled={loading}
          >
            Back to Basket
          </button>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Placing Order..."
              : "Place Order"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default Checkout;