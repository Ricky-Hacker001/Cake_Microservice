import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, VITE_API_BASE_URL } from "../services/api";


function CakeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [cake, setCake] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [quantity, setQuantity] = useState(1);
    const [addingToBasket, setAddingToBasket] = useState(false);
    const [basketError, setBasketError] = useState("");
    const [basketSuccess, setBasketSuccess] = useState("");

    const [averageRating, setAverageRating] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);
    const [ratings, setRatings] = useState([]);

    const [ratingLoading, setRatingLoading] = useState(true);
    const [ratingError, setRatingError] = useState("");

    const [customerName, setCustomerName] = useState("");
    const [ratingValue, setRatingValue] = useState(5);
    const [review, setReview] = useState("");

    const [submittingRating, setSubmittingRating] = useState(false);
    const [ratingSuccess, setRatingSuccess] = useState("");
    const [ratingSubmitError, setRatingSubmitError] = useState("");

    useEffect(() => {
        fetchCake();
    }, [id]);

    const fetchCake = async () => {
        try {
        setLoading(true);

        const response = await api.get(`/cakes/${id}`);

        setCake(response.data);
        setError("");
        } catch (err) {
        console.error(err);

        if (err.response?.status === 404) {
            setError("Cake not found.");
        } else {
            setError("Unable to load cake details.");
        }
        } finally {
        setLoading(false);
        }
    };

    const handleAddToBasket = async () => {
  try {
    setAddingToBasket(true);
    setBasketError("");
    setBasketSuccess("");

    const basketId = localStorage.getItem("basketId");

    const body = {
      cakeId: id,
      quantity: quantity,
    };

    if (basketId) {
      body.basketId = basketId;
    }

    const response = await api.post(
      "/baskets/items",
      body
    );

    console.log("Basket response:", response.data);

    localStorage.setItem(
      "basketId",
      response.data.basketId
    );

    setBasketSuccess(
      "Cake added to basket successfully!"
    );
    

    navigate(`/basket/${response.data.basketId}`);

  } catch (err) {
    console.error(err);

    setBasketError(
      err.response?.data?.message ||
        "Unable to add cake to basket."
    );
  } finally {
    setAddingToBasket(false);
  }
};

useEffect(() => {
  if (id) {
    fetchRatings();
    fetchAverageRating();
  }
}, [id]);

const fetchRatings = async () => {
  try {
    setRatingLoading(true);
    setRatingError("");

    const response = await api.get(
      `/ratings/cake/${id}`
    );

    console.log("Ratings response:", response.data);

    setRatings(response.data.ratings || []);
    setTotalRatings(response.data.totalRatings || 0);

  } catch (err) {
    console.error("Ratings error:", err);

    setRatingError(
      err.response?.data?.message ||
        "Unable to load reviews."
    );
  } finally {
    setRatingLoading(false);
  }
};


const fetchAverageRating = async () => {
  try {

    const response = await api.get(
      `/ratings/cake/${id}/average`
    );

    console.log(
      "Average rating response:",
      response.data
    );

    setAverageRating(
      response.data.averageRating || 0
    );

    setTotalRatings(
      response.data.totalRatings || 0
    );

  } catch (err) {
    console.error(
      "Average rating error:",
      err
    );
  }
};

const handleSubmitRating = async (event) => {
  event.preventDefault();

  try {

    setSubmittingRating(true);

    setRatingSuccess("");
    setRatingSubmitError("");

    const response = await api.post(
      "/ratings",
      {
        cakeId: id,
        customerName,
        rating: Number(ratingValue),
        review,
      }
    );

    console.log(
      "Rating submitted:",
      response.data
    );

    setRatingSuccess(
      "Review submitted successfully!"
    );

    // Clear form
    setCustomerName("");
    setRatingValue(5);
    setReview("");

    // Refresh reviews and average
    await fetchRatings();
    await fetchAverageRating();

  } catch (err) {

    console.error(
      "Rating submission error:",
      err
    );

    console.error(
      "Backend response:",
      err.response?.data
    );

    if (
      err.response?.data?.errors &&
      Array.isArray(err.response.data.errors)
    ) {

      setRatingSubmitError(
        err.response.data.errors[0].msg
      );

    } else {

      setRatingSubmitError(
        err.response?.data?.message ||
          "Unable to submit review."
      );

    }

  } finally {

    setSubmittingRating(false);

  }
};



    if (loading) {
        return <h2>Loading cake details...</h2>;
    }

    if (error) {
        return (
        <div className="cake-details-page">
            <h2>{error}</h2>

            <button onClick={() => navigate("/")}>
            Back to Cakes
            </button>
        </div>
        );
    }

    if (!cake) {
        return <h2>Cake not found.</h2>;
    }

        return (
  <div className="cake-details-page">

    {/* Back Button */}

    <button onClick={() => navigate("/")}>
      ← Back to Cakes
    </button>


    {/* Cake Details */}

    <div className="cake-details">

      {/* Cake Image */}

      <div className="cake-details-image-container">

        {cake.imageUrl && (
          <img
            src={`${VITE_API_BASE_URL}${cake.imageUrl}`}
            alt={cake.name}
            className="cake-details-image"
          />
        )}

      </div>


      {/* Cake Information */}

      <div className="cake-details-info">

        <h1>{cake.name}</h1>

        <p className="cake-description">
          {cake.description}
        </p>

        <p>
          <strong>Category:</strong>{" "}
          {cake.category}
        </p>

        <p className="cake-price">
          ₹{cake.price}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {cake.availability
            ? "Available"
            : "Unavailable"}
        </p>


        {/* Quantity + Basket */}

        {cake.availability && (
          <>

            <div className="quantity-section">

              <strong>Quantity:</strong>

              <div className="quantity-controls">

                <button
                  onClick={() =>
                    setQuantity((previous) =>
                      Math.max(1, previous - 1)
                    )
                  }
                  disabled={quantity === 1}
                >
                  -
                </button>

                <span>{quantity}</span>

                <button
                  onClick={() =>
                    setQuantity(
                      (previous) => previous + 1
                    )
                  }
                >
                  +
                </button>

              </div>

            </div>


            <button
              className="add-to-basket"
              onClick={handleAddToBasket}
              disabled={addingToBasket}
            >
              {addingToBasket
                ? "Adding..."
                : "Add to Basket"}
            </button>


            {basketSuccess && (
              <p className="basket-success">
                {basketSuccess}
              </p>
            )}


            {basketError && (
              <p className="basket-error">
                {basketError}
              </p>
            )}

          </>
        )}

      </div>

    </div>


    {/* Ratings & Reviews */}

    <div className="ratings-section">

      {/* Ratings Header */}

      <div className="ratings-header">

        <h2>
          Ratings & Reviews
        </h2>


        <div className="average-rating">

          <span className="average-number">

            {averageRating > 0
              ? averageRating.toFixed(1)
              : "No ratings"}

          </span>


          {averageRating > 0 && (
            <span className="stars">

              {"★".repeat(
                Math.round(averageRating)
              )}

              {"☆".repeat(
                5 - Math.round(averageRating)
              )}

            </span>
          )}


          <span className="rating-count">

            {totalRatings}{" "}

            {totalRatings === 1
              ? "rating"
              : "ratings"}

          </span>

        </div>

      </div>


      {/* Submit Review */}

      <div className="review-form-card">

        <h3>
          Write a Review
        </h3>


        <form onSubmit={handleSubmitRating}>

          {/* Customer Name */}

          <div className="form-group">

            <label>
              Your Name
            </label>

            <input
              type="text"
              value={customerName}
              onChange={(event) =>
                setCustomerName(
                  event.target.value
                )
              }
              placeholder="Enter your name"
              required
            />

          </div>


          {/* Rating */}

          <div className="form-group">

            <label>
              Rating
            </label>

            <select
              value={ratingValue}
              onChange={(event) =>
                setRatingValue(
                  event.target.value
                )
              }
            >

              <option value="5">
                5 - Excellent
              </option>

              <option value="4">
                4 - Very Good
              </option>

              <option value="3">
                3 - Good
              </option>

              <option value="2">
                2 - Fair
              </option>

              <option value="1">
                1 - Poor
              </option>

            </select>

          </div>


          {/* Review */}

          <div className="form-group">

            <label>
              Review
            </label>

            <textarea
              value={review}
              onChange={(event) =>
                setReview(
                  event.target.value
                )
              }
              placeholder="Share your experience..."
              rows="4"
              required
            />

          </div>


          {/* Submit Button */}

          <button
            type="submit"
            disabled={submittingRating}
          >
            {submittingRating
              ? "Submitting..."
              : "Submit Review"}
          </button>

        </form>


        {/* Success Message */}

        {ratingSuccess && (
          <p className="rating-success">
            {ratingSuccess}
          </p>
        )}


        {/* Error Message */}

        {ratingSubmitError && (
          <p className="rating-error">
            {ratingSubmitError}
          </p>
        )}

      </div>


      {/* Existing Reviews */}

      <div className="reviews-list">

        <h3>
          Customer Reviews
        </h3>


        {ratingLoading ? (

          <p>
            Loading reviews...
          </p>

        ) : ratingError ? (

          <p className="rating-error">
            {ratingError}
          </p>

        ) : ratings.length === 0 ? (

          <p className="no-reviews">
            No reviews yet. Be the first to
            review this cake!
          </p>

        ) : (

          ratings.map((item) => (

            <div
              className="review-card"
              key={item._id}
            >

              <div className="review-header">

                <strong>
                  {item.customerName}
                </strong>


                <span className="review-stars">

                  {"★".repeat(item.rating)}

                  {"☆".repeat(
                    5 - item.rating
                  )}

                </span>

              </div>


              <p className="review-text">
                {item.review}
              </p>

            </div>

          ))

        )}

      </div>

    </div>

  </div>
); 
}

export default CakeDetails;