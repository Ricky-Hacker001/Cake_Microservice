import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const basketId = localStorage.getItem("basketId");

  const handleBasketClick = () => {
    if (basketId) {
      navigate(`/basket/${basketId}`);
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="navbar">

      <div
        className="navbar-brand"
        onClick={() => navigate("/")}
      >
        Cake Delight
      </div>

      <div className="navbar-links">

        <button
          onClick={() => navigate("/")}
        >
          Home
        </button>

        <button
          onClick={handleBasketClick}
        >
          🛒 Basket
        </button>

        <button
          onClick={() => navigate("/orders")}
        >
          📦 Orders
        </button>
        <button
            onClick={() => navigate("/notifications")}
        >
            🔔 Notifications
        </button>

      </div>

    </nav>
  );
}

export default Navbar;