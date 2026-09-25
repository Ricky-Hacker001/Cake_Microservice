import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";

function Basket() {
  const { basketId } = useParams();
  const navigate = useNavigate();

  const [basket, setBasket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBasket();
  }, [basketId]);

  const fetchBasket = async () => {
    try {
      setLoading(true);
      setError("");

      if (!basketId) {
        setBasket(null);
        return;
      }

      const response = await api.get(
        `/baskets/${basketId}`
      );

      setBasket(response.data);

    } catch (err) {
      console.error(err);

      if (err.response?.status === 404) {
        localStorage.removeItem("basketId");
        setBasket(null);
      } else {
        setError("Unable to load basket.");
      }

    } finally {
      setLoading(false);
    }
  };
  

  if (loading) {
    return <h2>Loading basket...</h2>;
  }

  if (error) {
    return (
      <div className="basket-page">
        <h2>{error}</h2>

        <button onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  if (
    !basket ||
    !basket.items ||
    basket.items.length === 0
  ) {
    return (
      <div className="basket-page">
        <h1>Your Basket</h1>

        <p>Your basket is empty.</p>

        <button onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  const total = basket.items.reduce(
    (sum, item) => {
      return sum + item.price * item.quantity;
    },
    0
  );

  const removeItem = async (cakeId) => {
  try {
    await api.delete(
      `/baskets/${basketId}/items/${cakeId}`
    );

    await fetchBasket();

  } catch (err) {
    console.error(err);
    setError("Unable to remove item.");
  }
};

const updateQuantity = async (cakeId, quantity) => {
  try {
    if (quantity < 1) {
      return;
    }

    const response = await api.put(
      `/baskets/${basketId}/items/${cakeId}`,
      {
        quantity: quantity,
      }
    );

    console.log("Update basket response:", response.data);

    await fetchBasket();

  } catch (err) {
    console.error("Update basket error:", err);
    console.error("Backend response:", err.response?.data);

    setError(
      err.response?.data?.message ||
      "Unable to update basket."
    );
  }
};

  return (
    <div className="basket-page">

      <h1>Your Basket</h1>

      <div className="basket-items">

        {basket.items.map((item) => (
  <div
    className="basket-item"
    key={item.cakeId}
  >
    <div>

      <h3>{item.name}</h3>

      <p>
        Price: ₹{item.price}
      </p>

      <div className="basket-quantity">

        <button
          onClick={() =>
            updateQuantity(
              item.cakeId,
              item.quantity - 1
            )
          }
          disabled={item.quantity === 1}
        >
          -
        </button>

        <span>{item.quantity}</span>

        <button
          onClick={() =>
            updateQuantity(
              item.cakeId,
              item.quantity + 1
            )
          }
        >
          +
        </button>

      </div>

      <button
        onClick={() =>
          removeItem(item.cakeId)
        }
      >
        Remove
      </button>

    </div>

    <div>
      <strong>
        ₹{item.price * item.quantity}
      </strong>
    </div>

  </div>
))}

      </div>

      <div className="basket-summary">

        <h2>
          Total: ₹{total}
        </h2>

        <button
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>

        <button
  onClick={() =>
    navigate(`/checkout/${basketId}`)
  }
>
  Checkout
</button>

      </div>

    </div>
  );
}

export default Basket;