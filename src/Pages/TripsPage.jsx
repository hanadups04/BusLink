import { useState, useMemo } from "react";
import { motion } from "motion/react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SearchBar from "../Components/SearchBar";
import TripCard from "../Components/TripCard";
// import { getAvailableTrips, searchTrips } from "../Backend/tripsData";
import "./TripsPage.css";

const TripsPage = () => {
  const [filteredTrips, setFilteredTrips] = useState(null);

  // const allTrips = useMemo(() => {
  //   return getAvailableTrips().sort((a, b) => a.origin.localeCompare(b.origin));
  // }, []);

  // const displayTrips = filteredTrips ?? allTrips;

  // const handleSearch = (origin, destination, date, pax) => {
  //   if (!origin && !destination && !date) {
  //     setFilteredTrips(null);
  //     return;
  //   }
  //   const results = searchTrips(origin, destination, date, pax);
  //   setFilteredTrips(results.sort((a, b) => a.origin.localeCompare(b.origin)));
  // };

  return (
    <div className="trips-page">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="trips-header mb-10"
          >
            <span className="label">Browse</span>
            <h1>All Available Trips</h1>
            <p>
              Explore upcoming routes sorted alphabetically. Use the search bar
              to narrow down your options.
            </p>
          </motion.div>
          <div className="mb-10">
            {/* <SearchBar onSearch={handleSearch} /> */}
          </div>
          {/* {displayTrips.length > 0 ? (
            <div className="trips-grid">
              {displayTrips.map((trip, i) => (
                <TripCard key={trip.id} trip={trip} index={i} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No trips match your criteria.</p>
            </div>
          )} */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TripsPage;
