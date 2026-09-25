import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

function AddCake() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    availability: true,
  });

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const handleAvailabilityChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      availability: event.target.value === "true",
    }));
  };


  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];

    setImage(selectedImage || null);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!image) {
        setError("Please select a cake image.");
        return;
      }

      const data = new FormData();

      data.append("name", formData.name);
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
      data.append("image", image);


      console.log("Creating cake...");

      const response = await api.post(
        "/cakes",
        data,
        {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
      );

      console.log(
        "Cake created:",
        response.data
      );

      setSuccess(
        "Cake added successfully!"
      );

      setTimeout(() => {
        navigate("/admin/cakes");
      }, 1000);

    } catch (err) {
      console.error(
        "Add cake error:",
        err
      );

      if (err.response?.data?.errors) {

        const validationErrors =
          err.response.data.errors;

        setError(
          validationErrors
            .map((item) => item.msg)
            .join(", ")
        );

      } else {

        setError(
          err.response?.data?.message ||
            "Unable to add cake."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="admin-page">

      <div className="admin-form-header">

        <div>
          <h1>
            Add Cake
          </h1>

          <p>
            Add a new cake to the catalog.
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


      <form
        className="admin-cake-form"
        onSubmit={handleSubmit}
      >

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
            placeholder="Chocolate Truffle"
            required
          />

        </div>


        <div className="form-group">

          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Rich chocolate cake with..."
            rows="4"
            required
          />

        </div>


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
            placeholder="Chocolate"
            required
          />

        </div>


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
            placeholder="850"
            required
          />

        </div>


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


        <div className="form-group">

          <label htmlFor="image">
            Cake Image
          </label>

          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />

          {image && (
            <p className="selected-file">
              Selected: {image.name}
            </p>
          )}

        </div>


        {error && (
          <div className="admin-form-error">
            {error}
          </div>
        )}


        {success && (
          <div className="admin-form-success">
            {success}
          </div>
        )}


        <div className="admin-form-actions">

          <button
            type="button"
            onClick={() =>
              navigate("/admin/cakes")
            }
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={loading}
          >
            {loading
              ? "Adding Cake..."
              : "Add Cake"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default AddCake;