import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import CakeCard from "../components/CakeCard";

function Home() {
  const navigate = useNavigate();

  const [cakes, setCakes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    availability: "",
  });

  useEffect(() => {
    fetchCakes();
  }, []);

  const fetchCakes = async (filterValues = filters) => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (filterValues.name.trim()) {
        params.name = filterValues.name.trim();
      }

      if (filterValues.category.trim()) {
        params.category = filterValues.category.trim();
      }

      if (filterValues.minPrice !== "") {
        params.minPrice = filterValues.minPrice;
      }

      if (filterValues.maxPrice !== "") {
        params.maxPrice = filterValues.maxPrice;
      }

      if (filterValues.availability !== "") {
        params.availability = filterValues.availability;
      }

      const response = await api.get("/cakes", {
        params,
      });

      console.log("Cake response:", response.data);

      setCakes(response.data);

    } catch (err) {
      console.error("Cake fetch error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load cakes."
      );

    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSearch = (event) => {
    event.preventDefault();

    fetchCakes(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      name: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      availability: "",
    };

    setFilters(clearedFilters);

    fetchCakes(clearedFilters);
  };

  const handleViewCake = (cakeId) => {
    navigate(`/cakes/${cakeId}`);
  };

  return (
    <div className="home-page">

      <div className="home-header">

        <h1>Cake Delight</h1>

        <p>
          Find your perfect cake.
        </p>

      </div>


      {/* Filters */}

      <form
        className="cake-filters"
        onSubmit={handleSearch}
      >

        <div className="filter-group">

          <label htmlFor="name">
            Cake Name
          </label>

          <input
            id="name"
            type="text"
            name="name"
            placeholder="Search cakes..."
            value={filters.name}
            onChange={handleFilterChange}
          />

        </div>


        <div className="filter-group">

          <label htmlFor="category">
            Category
          </label>

          <input
            id="category"
            type="text"
            name="category"
            placeholder="e.g. Chocolate"
            value={filters.category}
            onChange={handleFilterChange}
          />

        </div>


        <div className="filter-group">

          <label htmlFor="minPrice">
            Min Price
          </label>

          <input
            id="minPrice"
            type="number"
            name="minPrice"
            placeholder="₹ Min"
            min="0"
            value={filters.minPrice}
            onChange={handleFilterChange}
          />

        </div>


        <div className="filter-group">

          <label htmlFor="maxPrice">
            Max Price
          </label>

          <input
            id="maxPrice"
            type="number"
            name="maxPrice"
            placeholder="₹ Max"
            min="0"
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />

        </div>


        <div className="filter-group">

          <label htmlFor="availability">
            Availability
          </label>

          <select
            id="availability"
            name="availability"
            value={filters.availability}
            onChange={handleFilterChange}
          >

            <option value="">
              All
            </option>

            <option value="true">
              Available
            </option>

            <option value="false">
              Unavailable
            </option>

          </select>

        </div>


        <div className="filter-buttons">

          <button type="submit">
            Search
          </button>

          <button
            type="button"
            onClick={handleClearFilters}
          >
            Clear
          </button>

        </div>

      </form>


      {/* Results */}

      {loading && (
        <h2>Loading cakes...</h2>
      )}

      {!loading && error && (
        <h2>{error}</h2>
      )}

      {!loading && !error && (

        <>

          <div className="cake-results-header">

            <h2>
              Cakes
            </h2>

            <span>
              {cakes.length} cake
              {cakes.length !== 1 ? "s" : ""}
              found
            </span>

          </div>


          <div className="cake-grid">

            {cakes.length === 0 ? (

              <div className="no-cakes">

                <h3>
                  No cakes found
                </h3>

                <p>
                  Try changing your filters.
                </p>

              </div>

            ) : (

              cakes.map((cake) => (

                <CakeCard
                  key={cake._id}
                  cake={cake}
                  onView={handleViewCake}
                />

              ))

            )}

          </div>

        </>

      )}

    </div>
  );
}

export default Home;