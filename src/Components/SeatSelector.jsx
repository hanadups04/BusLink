import React from "react";
import { motion } from "motion/react";
import "./SeatSelector.css";

const SeatSelector = ({
  totalSeats,
  occupiedSeats,
  selectedSeats,
  onSeatToggle,
  maxSelectable,
}) => {
  const rows = [];
  for (let i = 1; i <= totalSeats; i += 4) {
    const row = [];
    for (let j = i; j < i + 4 && j <= totalSeats; j++) {
      row.push(j);
    }
    rows.push(row);
  }

  const getSeatStatus = (seat) => {
    if (occupiedSeats.includes(seat)) return "occupied";
    if (selectedSeats.includes(seat)) return "selected";
    if (maxSelectable !== undefined && selectedSeats.length >= maxSelectable)
      return "occupied";
    return "available";
  };

  return (
    <div className="seat-selector">
      <div className="seat-legend">
        {[
          { label: "Available", mod: "available" },
          { label: "Selected", mod: "selected" },
          { label: "Occupied", mod: "occupied" },
        ].map((item) => (
          <div key={item.label} className="seat-legend-item">
            <div
              className={`seat-legend-swatch seat-legend-swatch--${item.mod}`}
            />
            <span className="seat-legend-label">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="seat-bus-shape">
        <div className="seat-driver-area">
          <div className="seat-driver-icon">🚌</div>
        </div>

        <div className="seat-rows">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="seat-row">
              {row.map((seat, seatIdx) => {
                const status = getSeatStatus(seat);
                return (
                  <React.Fragment key={seat}>
                    <motion.button
                      whileTap={
                        status !== "occupied" ? { scale: 0.9 } : undefined
                      }
                      whileHover={
                        status !== "occupied" ? { scale: 1.1 } : undefined
                      }
                      onClick={() =>
                        status !== "occupied" && onSeatToggle(seat)
                      }
                      disabled={status === "occupied"}
                      className={`seat-btn seat-btn--${status}`}
                    >
                      {seat}
                    </motion.button>
                    {seatIdx === 1 && <div className="seat-aisle" />}
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatSelector;
