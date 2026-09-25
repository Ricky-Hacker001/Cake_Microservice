import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, VITE_API_BASE_URL } from "../../services/api";

function EditCake() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    availability: true,
    imageUrl: "",
  });

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // =========================
  // Get cake
  // =========================

  useEffect(() => {
    fetchCake();
  }, [id]);


  const fetchCake = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/cakes/${id}`);

      const cake = response.data;

      setFormData({
        name: cake.name || "",
        description: cake.description || "",
        category: cake.category || "",
        price: cake.price || "",
        availability: cake.availability,
        imageUrl: cake.imageUrl || "",
      });

    } catch (err) {

      console.error(
        "Fetch cake error:",
        err
      );

      if (err.response?.status === 404) {

        setError("Cake not found.");

      } else {

        setError(
          err.response?.data?.message ||
            "Unable to load cake."
        );
      }

    } finally {

      setLoading(false);

    }
  };


  // =========================
  // Handle text fields
  // =========================

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // =========================
  // Handle availability
  // =========================

  const handleAvailabilityChange = (event) => {

    setFormData((previous) => ({
      ...previous,
      availability:
        event.target.value === "true",
    }));

  };


  // =========================
  // Handle image
  // =========================

  const handleImageChange = (event) => {

    const selectedImage =
      event.target.files[0];

    setImage(selectedImage || null);

  };


  // =========================
  // Update cake
  // =========================

  const handleSubmit = async (event) => {

    event.preventDefault();

    try {

      setUpdating(true);
      setError("");
      setSuccess("");


      const data = new FormData();

      data.append(
        "name",
        formData.name
      );

      data.append(
        "description",
        formData.description
      );

      data.append(
        "category",
        formData.category
      );

      data.append(
        "price",
        formData.price
      );

      data.append(
        "availability",
        formData.availability
      );


      // Only send image if
      // admin selected a new image

      if (image) {

        data.append(
          "image",
          image
        );

      }


      const response = await api.put(
        `/cakes/${id}`,
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );


      console.log(
        "Updated cake:",
        response.data
      );


      setSuccess(
        "Cake updated successfully!"
      );


      setTimeout(() => {

        navigate("/admin/cakes");

      }, 1000);


    } catch (err) {

      console.error(
        "Update cake error:",
        err
      );


      if (err.response?.data?.errors) {

        setError(
          err.response.data.errors
            .map(
              (item) => item.msg
            )
            .join(", ")
        );

      } else {

        setError(
          err.response?.data?.message ||
            "Unable to update cake."
        );

      }

    } finally {

      setUpdating(false);

    }

  };


  // =========================
  // Loading
  // =========================

  if (loading) {

    return (
      <div className="admin-page">

        <h2>
          Loading cake...
        </h2>

      </div>
    );

  }


  // =========================
  // Cake not found
  // =========================

  if (error && !formData.name) {

    return (
      <div className="admin-page">

        <h1>
          Edit Cake
        </h1>

        <p className="admin-form-error">
          {error}
        </p>

        <button
          onClick={() =>
            navigate("/admin/cakes")
          }
        >
          Back to Cakes
        </button>

      </div>
    );

  }


  // =========================
  // Edit form
  // =========================

  return (
    <div className="admin-page">


      {/* Header */}

      <div className="admin-form-header">

        <div>

          <h1>
            Edit Cake
          </h1>

          <p>
            Update the cake information.
          </p>

        </div>


        <button
          type="button"
          onClick={() =>
            navigate("/admin/cakes")
          }
        >
          ← Back to Cakes
        </button>

      </div>


      {/* Form */}

      <form
        className="admin-cake-form"
        onSubmit={handleSubmit}
      >


        {/* Name */}

        <div className="form-group">

          <label htmlFor="name">
            Cake Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />

        </div>


        {/* Description */}

        <div className="form-group">

          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />

        </div>


        {/* Category */}

        <div className="form-group">

          <label htmlFor="category">
            Category
          </label>

          <input
            id="category"
            name="category"
            type="text"
            value={formData.category}
            onChange={handleChange}
            required
          />

        </div>


        {/* Price */}

        <div className="form-group">

          <label htmlFor="price">
            Price
          </label>

          <input
            id="price"
            name="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
          />

        </div>


        {/* Availability */}

        <div className="form-group">

          <label htmlFor="availability">
            Availability
          </label>

          <select
            id="availability"
            name="availability"
            value={String(
              formData.availability
            )}
            onChange={
              handleAvailabilityChange
            }
          >

            <option value="true">
              Available
            </option>

            <option value="false">
              Unavailable
            </option>

          </select>

        </div>


        {/* Current Image */}

        {formData.imageUrl && (

          <div className="form-group">

            <label>
              Current Image
            </label>

            <img
              src={`${VITE_API_BASE_URL}${formData.imageUrl}`}
              alt={formData.name}
              className="admin-edit-image"
            />

          </div>

        )}


        {/* Replace Image */}

        <div className="form-group">

          <label htmlFor="image">
            Replace Image
          </label>

          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />


          {image && (

            <p className="selected-file">

              Selected:
              {" "}
              {image.name}

            </p>

          )}

        </div>


        {/* Error */}

        {error && (

          <div className="admin-form-error">

            {error}

          </div>

        )}


        {/* Success */}

        {success && (

          <div className="admin-form-success">

            {success}

          </div>

        )}


        {/* Buttons */}

        <div className="admin-form-actions">

          <button
            type="button"
            onClick={() =>
              navigate("/admin/cakes")
            }
            disabled={updating}
          >
            Cancel
          </button>


          <button
            type="submit"
            className="admin-primary-button"
            disabled={updating}
          >

            {updating
              ? "Updating..."
              : "Update Cake"}

          </button>

        </div>


      </form>

    </div>
  );
}

export default EditCake;