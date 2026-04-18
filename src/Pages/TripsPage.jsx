import { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SearchBar from "../Components/SearchBar";
import TripCard from "../Components/TripCard";
// import { getAvailableTrips, searchTrips } from "../Backend/tripsData";
import "./TripsPage.css";
import * as Readfunctions from "../Backend/customer_funcs";

const TripsPage = () => {
  const [filteredTrips, setFilteredTrips] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function getData() {
      try {
        if (isMounted) {
          const data = await Readfunctions.getTrips();
          setTrips(data ?? []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    getData();

    return () => {
      isMounted = false;
    };
  }, []);

  // const allTrips = useMemo(() => {
  //   return getAvailableTrips().sort((a, b) => a.origin.localeCompare(b.origin));
  // }, []);

  const displayTrips = filteredTrips ?? trips;

  const handleSearch = (origin, destination) => {
    if (!origin && !destination) {
      setFilteredTrips(null);
      return;
    }

    const normalizedOrigin = origin ? origin.toLowerCase() : null;
    const normalizedDestination = destination
      ? destination.toLowerCase()
      : null;

    const results = trips.filter((trip) => {
      const tripOrigin = (trip.origin?.name || trip.origin || "").toLowerCase();
      const tripDestination = (
        trip.destination?.name ||
        trip.destination ||
        ""
      ).toLowerCase();

      const matchesOrigin = normalizedOrigin
        ? tripOrigin.includes(normalizedOrigin)
        : true;
      const matchesDestination = normalizedDestination
        ? tripDestination.includes(normalizedDestination)
        : true;

      return matchesOrigin && matchesDestination;
    });

    setFilteredTrips(results);
  };

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
          {loading ? (
            <div className="empty-state">
              <p>Loading trips...</p>
            </div>
          ) : displayTrips.length > 0 ? (
            <div className="trips-grid">
              {displayTrips.map((trip, i) => (
                <TripCard key={i} trip={trip} index={i} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No trips match your criteria.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TripsPage;
