import { useState, useCallback } from "react";
import { motion } from "motion/react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SearchBar from "../Components/SearchBar";
import TripCard from "../Components/TripCard";
// import { searchTrips, getAvailableTrips } from "../Backend/tripsData";
import heroBus from "../assets/hero-bus.jpg";
import "./LandingPage.css";

const LandingPage = () => {
  const [results, setResults] = useState(null);
  const [searched, setSearched] = useState(false);

  // const handleSearch = useCallback((origin, destination, date, pax) => {
  //   const trips = searchTrips(origin, destination, date, pax);
  //   setResults(trips);
  //   setSearched(true);
  // }, []);

  // const featuredTrips = getAvailableTrips().slice(0, 4);

  return (
    <div className="landing-page">
      <Navbar />
      <section className="hero-section">
        <div className="hero-bg">
          <img
            src={heroBus}
            alt="Premium bus travel"
            width={1920}
            height={1080}
          />
          <div className="hero-overlay" />
        </div>
        <div
          className="container mx-auto px-6 pb-16 pt-32"
          style={{ position: "relative" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="hero-content"
          >
            <h1 className="hero-title">
              Travel with
              <br />
              <span className="gradient-text">Confidence</span>
            </h1>
            <p className="hero-subtitle">
              Book premium bus rides across the Philippines. Seamless, fast, and
              reliable.
            </p>
          </motion.div>
          {/* <SearchBar onSearch={handleSearch} /> */}
        </div>
      </section>

      <section className="results-section container mx-auto px-6">
        {searched ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-10"
            >
              <h2 className="section-title">
                {results && results.length > 0
                  ? `${results.length} trip${results.length > 1 ? "s" : ""} found`
                  : "No trips found"}
              </h2>
            </motion.div>
            <div className="trips-grid search-results">
              {results?.map((trip, i) => (
                <TripCard key={trip.id} trip={trip} index={i} />
              ))}
            </div>
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <span className="section-label">Popular Routes</span>
              <h2 className="section-title">Featured Trips</h2>
            </motion.div>
            <div className="trips-grid">
              {/* {featuredTrips.map((trip, i) => (
                <TripCard key={trip.id} trip={trip} index={i} />
              ))} */}
            </div>
          </>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
