import { VITE_API_BASE_URL } from "../services/api";

function CakeCard({ cake, onView }) {
  return (
    <div className="cake-card">

      {cake.imageUrl && (
        <img
          src={`${VITE_API_BASE_URL}${cake.imageUrl}`}
          alt={cake.name}
          className="cake-image"
        />
      )}

      <div className="cake-info">
        <h3>{cake.name}</h3>

        <p>{cake.description}</p>

        <p>
          <strong>Category:</strong> {cake.category}
        </p>

        <p>
          <strong>Price:</strong> ₹{cake.price}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {cake.availability ? "Available" : "Unavailable"}
        </p>

        <button onClick={() => onView(cake._id)}>
          View Cake
        </button>
      </div>

    </div>
  );
}

export default CakeCard;