import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import "./ConfirmationModal.css";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  trip,
  passengers,
  totalFare,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="confirmation-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="confirmation-modal"
          >
            <div className="confirmation-header">
              <h3 className="confirmation-title">Confirm Booking</h3>
              <button onClick={onClose} className="confirmation-close-btn">
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            <div className="confirmation-body">
              <div className="confirmation-route-box">
                <p className="confirmation-route-label">Route</p>
                <p className="confirmation-route-value">
                  {trip.origin} → {trip.destination}
                </p>
                <p className="confirmation-route-date">
                  {trip.departureDate} · {trip.departureTime}
                </p>
              </div>

              <div className="confirmation-pax-list">
                <p className="confirmation-pax-title">
                  Passengers ({passengers.length})
                </p>
                {passengers.map((p, i) => (
                  <div key={i} className="confirmation-pax-item">
                    <div>
                      <p className="confirmation-pax-name">{p.name}</p>
                      <p className="confirmation-pax-detail">
                        Seat {p.seatNumber} · {p.type}
                      </p>
                    </div>
                    <p className="confirmation-pax-fare">₱{p.fare}</p>
                  </div>
                ))}
              </div>

              <div className="confirmation-total">
                <span className="confirmation-total-label">Total</span>
                <span className="confirmation-total-value">
                  ₱{totalFare.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="confirmation-actions">
              <button onClick={onClose} className="confirmation-cancel-btn">
                Cancel
              </button>
              <button onClick={onConfirm} className="confirmation-confirm-btn">
                <CheckCircle style={{ width: 16, height: 16 }} />
                Confirm Booking
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
