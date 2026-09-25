import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, VITE_API_BASE_URL } from "../../services/api";

function AdminCakes() {
  const navigate = useNavigate();

  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCakes();
  }, []);

  const fetchCakes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/cakes");

      setCakes(response.data);
    } catch (err) {
      console.error("Fetch cakes error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load cakes."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cakeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this cake?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/cakes/${cakeId}`);

      // Remove the deleted cake from the UI
      setCakes((previous) =>
        previous.filter(
          (cake) => cake._id !== cakeId
        )
      );

    } catch (err) {
      console.error(
        "Delete cake error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to delete cake."
      );
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <h2>Loading cakes...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">

        <h1>Manage Cakes</h1>

        <p className="admin-error">
          {error}
        </p>

        <button onClick={fetchCakes}>
          Try Again
        </button>

      </div>
    );
  }

  return (
    <div className="admin-page">

      <div className="admin-page-header">

        <div>
          <h1>Manage Cakes</h1>

          <p>
            Add, update and remove cakes from
            the catalog.
          </p>
        </div>

        <button
          className="admin-primary-button"
          onClick={() =>
            navigate("/admin/cakes/add")
          }
        >
          + Add Cake
        </button>

      </div>


      {cakes.length === 0 ? (

        <div className="admin-empty-state">

          <h3>
            No cakes found
          </h3>

          <p>
            Add your first cake to the catalog.
          </p>

          <button
            onClick={() =>
              navigate("/admin/cakes/add")
            }
          >
            Add Cake
          </button>

        </div>

      ) : (

        <div className="admin-cakes-grid">

          {cakes.map((cake) => (

            <div
              className="admin-cake-card"
              key={cake._id}
            >

              {cake.imageUrl && (
                <img
                  src={`${VITE_API_BASE_URL}${cake.imageUrl}`}
                  alt={cake.name}
                  className="admin-cake-image"
                />
              )}


              <div className="admin-cake-info">

                <h3>
                  {cake.name}
                </h3>

                <p>
                  {cake.description}
                </p>

                <p>
                  <strong>
                    Category:
                  </strong>{" "}
                  {cake.category}
                </p>

                <p>
                  <strong>
                    Price:
                  </strong>{" "}
                  ₹{cake.price}
                </p>

                <p>
                  <strong>
                    Status:
                  </strong>{" "}
                  {cake.availability
                    ? "Available"
                    : "Unavailable"}
                </p>


                <div className="admin-cake-actions">

                  <button
                    onClick={() =>
                      navigate(
                        `/admin/cakes/${cake._id}/edit`
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="admin-delete-button"
                    onClick={() =>
                      handleDelete(cake._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default AdminCakes;