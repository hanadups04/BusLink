import { motion } from "motion/react";
import { MapPin, Clock, Route, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./TripCard.css";

const TripCard = ({ trip, index = 0, status, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/booking/${trip.id}`);
    }
  };

  const statusClass = status
    ? `trip-card-status trip-card-status--${status.toLowerCase()}`
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={handleClick}
      className="trip-card"
    >
      <div className="trip-card-inner">
        {status && <span className={statusClass}>{status}</span>}

        <div className="trip-card-route">
          <div className="trip-card-route-icon">
            <MapPin style={{ width: 16, height: 16 }} />
          </div>
          <div className="trip-card-route-names">
            <span className="trip-card-route-name">
              {trip.origin.city_name}
            </span>
            <ArrowRight className="trip-card-route-arrow" />
            <span className="trip-card-route-name">
              {trip.destination.city_name}
            </span>
          </div>
        </div>

        {trip.bus_name && <p className="trip-card-bus-name">{trip.bus_name}</p>}

        <div className="trip-card-meta">
          <div className="trip-card-meta-item">
            <div className="trip-card-meta-label">
              <Route />
              <span>Distance</span>
            </div>
            <p className="trip-card-meta-value">{trip.distance}</p>
          </div>
          <div className="trip-card-meta-item trip-card-meta-fare">
            <span className="trip-card-meta-label">
              <span>Fare</span>
            </span>
            <p className="trip-card-fare-value">₱{trip.fare}</p>
          </div>
        </div>

        <div className="trip-card-departure">
          <div>
            <span className="trip-card-departure-date">
              {trip.departure_time}
            </span>
          </div>
          {/* <div className="trip-card-seats-left">
            {trip.totalSeats - trip.seatsOccupied.length} seats left
          </div> */}
        </div>
      </div>
    </motion.div>
  );
};

export default TripCard;
