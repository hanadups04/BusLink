import { useState } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { motion } from "motion/react";
// import { getUniqueOrigins, getUniqueDestinations } from "../Backend/tripsData";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [pax, setPax] = useState(1);

  //   const origins = getUniqueOrigins();
  //   const destinations = getUniqueDestinations();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(origin, destination);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      onSubmit={handleSubmit}
      className="search-bar"
    >
      <div className="search-bar-grid">
        <div className="search-bar-field">
          <div className="search-bar-field-icon search-bar-field-icon--primary">
            <MapPin style={{ width: 16, height: 16 }} />
          </div>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="search-bar-select"
          >
            <option value="">Any Origin</option>
            {/* {origins.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))} */}
          </select>
        </div>

        <div className="search-bar-field">
          <div className="search-bar-field-icon search-bar-field-icon--secondary">
            <MapPin style={{ width: 16, height: 16 }} />
          </div>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="search-bar-select"
          >
            <option value="">Any Destination</option>
            {/* {destinations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))} */}
          </select>
        </div>

        <div className="search-bar-field">
          <div className="search-bar-field-icon search-bar-field-icon--muted">
            <Calendar style={{ width: 16, height: 16 }} />
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="search-bar-input"
          />
        </div>

        <div className="search-bar-field">
          <div className="search-bar-field-icon search-bar-field-icon--muted">
            <Users style={{ width: 16, height: 16 }} />
          </div>
          <input
            type="number"
            min={1}
            max={50}
            value={pax}
            onChange={(e) => setPax(parseInt(e.target.value) || 1)}
            placeholder="PAX"
            className="search-bar-input"
          />
        </div>

        <button type="submit" className="search-bar-submit">
          <Search style={{ width: 16, height: 16 }} />
          Search
        </button>
      </div>
    </motion.form>
  );
};

export default SearchBar;
