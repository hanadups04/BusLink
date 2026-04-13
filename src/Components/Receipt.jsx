import { useRef } from "react";
import { Bus, Download } from "lucide-react";
import { motion } from "motion/react";
import html2canvas from "html2canvas";
import "./Receipt.css";

const Receipt = ({ trip, passenger, index }) => {
  const receiptRef = useRef(null);

  const saveAsImage = async () => {
    if (!receiptRef.current) return;
    const canvas = await html2canvas(receiptRef.current, {
      backgroundColor: null,
      scale: 2,
    });
    const link = document.createElement("a");
    link.download = `BusLink-Receipt-${passenger.name.replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.15, duration: 0.4 }}
      className="receipt-wrapper"
    >
      <div ref={receiptRef} className="receipt-card">
        <div className="receipt-header">
          <div className="receipt-header-brand">
            <Bus />
            <span>BusLink</span>
          </div>
          <p className="receipt-header-subtitle">Boarding Pass</p>
        </div>

        <div className="receipt-body">
          <div className="receipt-route">
            <div style={{ textAlign: "right" }}>
              <p className="receipt-route-name">{trip.origin}</p>
            </div>
            <div className="receipt-route-divider">
              <div className="receipt-route-line" />
              <Bus />
              <div className="receipt-route-line" />
            </div>
            <div style={{ textAlign: "left" }}>
              <p className="receipt-route-name">{trip.destination}</p>
            </div>
          </div>

          {trip.busName && <p className="receipt-bus-name">{trip.busName}</p>}

          <div className="receipt-details">
            <div>
              <p className="receipt-detail-label">Distance</p>
              <p className="receipt-detail-value">{trip.distance}</p>
            </div>
            <div>
              <p className="receipt-detail-label">Departure</p>
              <p className="receipt-detail-value">{trip.departureTime}</p>
            </div>
            <div>
              <p className="receipt-detail-label">Date</p>
              <p className="receipt-detail-value">{trip.departureDate}</p>
            </div>
            <div>
              <p className="receipt-detail-label">Seat</p>
              <p className="receipt-detail-value">{passenger.seatNumber}</p>
            </div>
          </div>

          <div className="receipt-passenger-box">
            <p className="receipt-passenger-label">Passenger</p>
            <p className="receipt-passenger-name">{passenger.name}</p>
            <p className="receipt-passenger-type">{passenger.type}</p>
          </div>

          <div className="receipt-fare-section">
            <p className="receipt-fare-label">Total Fare</p>
            <p className="receipt-fare-value">₱{passenger.fare}</p>
            {passenger.type !== "Regular" && (
              <p className="receipt-discount">20% discount applied</p>
            )}
          </div>
        </div>
      </div>

      <button onClick={saveAsImage} className="receipt-save-btn">
        <Download style={{ width: 16, height: 16 }} />
        Save as Image
      </button>
    </motion.div>
  );
};

export default Receipt;
