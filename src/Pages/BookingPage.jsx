import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SeatSelector from "../Components/SeatSelector";
import ConfirmationModal from "../Components/ConfirmationModal";
import Receipt from "../Components/Receipt";
// import { getTripById, addBooking } from "../Backend/tripsData";
import "./BookingPage.css";
import * as Read from "../Backend/customer_funcs";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tripData, setTripData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("trip id", id);
    let isMounted = true;

    async function getData() {
      try {
        if (isMounted) {
          const data = await Read.getTripById(id);
          setTripData(data ?? []);
          console.log("booking data", data);
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

  const occupiedSeats =
    tripData.seats
      ?.filter((seat) => seat.taken)
      .map((seat) => seat.seat_number) ?? [];

  const occupiedSeatsCount = occupiedSeats.length;
  // const trip = getTripById(tripId || "");

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([
    { name: "", seatNumber: null, type: "Regular" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [completedBooking, setCompletedBooking] = useState(null);

  if (!id) {
    return (
      <div
        className="booking-page"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2>Trip not found</h2>
          <button onClick={() => navigate("/")} className="book-btn active">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleSeatToggle = (seat) => {
    console.log("sleected seat", seat);
    if (selectedSeats.includes(seat)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seat));
      setPassengers((prev) =>
        prev.map((p) =>
          p.seatNumber === seat ? { ...p, seatNumber: null } : p,
        ),
      );
    } else {
      setSelectedSeats((prev) => [...prev, seat]);
      const unassignedIdx = passengers.findIndex((p) => p.seatNumber === null);
      if (unassignedIdx !== -1) {
        setPassengers((prev) =>
          prev.map((p, i) =>
            i === unassignedIdx ? { ...p, seatNumber: seat } : p,
          ),
        );
      }
    }
  };

  const addPassenger = () => {
    const unassignedSeat =
      selectedSeats.find((s) => !passengers.some((p) => p.seatNumber === s)) ||
      null;
    setPassengers((prev) => [
      ...prev,
      { name: "", seatNumber: unassignedSeat, type: "Regular" },
    ]);
  };

  const removePassenger = (index) => {
    const removed = passengers[index];
    if (removed.seatNumber)
      setSelectedSeats((prev) => prev.filter((s) => s !== removed.seatNumber));
    setPassengers((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePassenger = (index, field, value) => {
    setPassengers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    );
  };

  const calculateFare = (type) => {
    const base = tripData.fare;
    return ["Student", "Senior", "PWD"].includes(type)
      ? Math.round(base * 0.8)
      : base;
  };

  const finalPassengers = passengers
    .filter((p) => p.name && p.seatNumber)
    .map((p) => ({
      name: p.name,
      seatNumber: p.seatNumber,
      seatId:
        tripData.seats?.find((seat) => seat.seat_number === p.seatNumber)?.id ??
        null,
      type: p.type,
      fare: calculateFare(p.type),
    }));

  const totalFare = finalPassengers.reduce((sum, p) => sum + p.fare, 0);
  const canBook =
    passengers.length > 0 &&
    passengers.every((p) => p.name.trim() && p.seatNumber !== null);

  const handleBookNow = () => {
    if (canBook) setShowModal(true);
  };

  const currentUser = JSON.parse(
    localStorage.getItem("buslink_current_user") || "null",
  );

  const handleConfirm = async () => {
    const booking = {
      id: `BK${Date.now()}`,
      tripId: id,
      trip: tripData,
      passengers: finalPassengers,
      totalFare,
      paymentMethod: "GCash",
      status: "Booked",
      bookedAt: new Date().toISOString(),
    };

    console.log("passengers: ", finalPassengers, "current user: ", currentUser);

    const seatUpdates = await Promise.all(
      finalPassengers.map((p) =>
        Read.takeSeat({
          seat_id: p.seatId,
          user_id: currentUser,
        }),
      ),
    );

    const bookingUpdates = await Promise.all(
      finalPassengers.map((p) =>
        Read.createBooking({
          trip_id: id,
          seat_id: p.seatId,
          owner_id: currentUser,
          name: p.name,
          passenger_type: p.type,
          fare: p.fare,
        }),
      ),
    );

    const allSeatsUpdated = seatUpdates.every(Boolean);
    const allbooking = bookingUpdates.every(Boolean);
    if (!allSeatsUpdated || !allbooking) {
      console.log("Failed to book all seats. Please try again.");
      return;
    }
    // addBooking(booking);
    setCompletedBooking(booking);
    setShowModal(false);
    setBookingComplete(true);
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#C40C0C", "#FF6500", "#F6CE71"],
    });
  };

  if (bookingComplete && completedBooking) {
    return (
      <div className="booking-page">
        <Navbar />
        <div
          className="pt-28 pb-20 container mx-auto px-6"
          style={{ textAlign: "center" }}
        >
          <div className="success-icon">
            <span>🎉</span>
          </div>
          <h1 className="section-title" style={{ marginBottom: "0.5rem" }}>
            Booking Confirmed!
          </h1>
          <p style={{ color: "hsl(0 0% 40%)" }}>
            Your tickets are ready. Save your receipts below.
          </p>
          <div className="receipts-grid" style={{ marginTop: "3rem" }}>
            {completedBooking.passengers.map((passenger, i) => (
              <Receipt
                key={i}
                trip={completedBooking.trip}
                passenger={passenger}
                index={i}
              />
            ))}
          </div>
          <button
            onClick={() => navigate("/myBookings")}
            className="book-btn active"
            style={{ maxWidth: "16rem", margin: "3rem auto 0" }}
          >
            View My Bookings
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="booking-page">
      <Navbar />
      <div className="pt-28 pb-20 container mx-auto px-6">
        <>
          {loading ? (
            <div className="empty-state">
              <p>Loading trip...</p>
            </div>
          ) : (
            <>
              <div className="booking-header mb-10">
                <span className="label">Book Your Ride</span>
                <h1>
                  {tripData.origin.city_name} → {tripData.destination.city_name}
                </h1>
              </div>
              <div className="booking-layout">
                <div className="glass-card">
                  <h2
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    Select Your Seats
                  </h2>
                  <SeatSelector
                    totalSeats={tripData.seats.length}
                    occupiedSeats={occupiedSeats}
                    selectedSeats={selectedSeats}
                    onSeatToggle={handleSeatToggle}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                  }}
                >
                  <div className="glass-card">
                    <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>
                      Trip Information
                    </h3>
                    <p>
                      <strong>Origin:</strong> {tripData.origin.city_name}
                    </p>
                    <p>
                      <strong>Destination:</strong>{" "}
                      {tripData.destination.city_name}
                    </p>
                    <p>
                      <strong>Distance:</strong> {tripData.distance} KM
                    </p>
                    <p>
                      <strong>Departure:</strong> {tripData.departure_time}
                    </p>
                  </div>
                  <div className="glass-card">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <h3 style={{ fontWeight: 700 }}>Passenger Details</h3>
                      <button
                        onClick={addPassenger}
                        style={{
                          color: "hsl(0 89% 41%)",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        + Add Passenger
                      </button>
                    </div>
                    <AnimatePresence mode="popLayout">
                      {passengers.map((p, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="passenger-card"
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "0.75rem",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                color: "hsl(0 0% 40%)",
                              }}
                            >
                              Passenger {i + 1}
                            </span>
                            {passengers.length > 1 && (
                              <button
                                onClick={() => removePassenger(i)}
                                style={{
                                  color: "hsl(0 84% 60%)",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            placeholder="Passenger Name *"
                            value={p.name}
                            onChange={(e) =>
                              updatePassenger(i, "name", e.target.value)
                            }
                            required
                          />
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "0.75rem",
                              marginTop: "0.75rem",
                            }}
                          >
                            <div
                              style={{
                                padding: "0.75rem 1rem",
                                borderRadius: "0.75rem",
                                border: "1px solid hsl(0 0% 90%)",
                                fontSize: "0.875rem",
                              }}
                            >
                              Seat:{" "}
                              {p.seatNumber ? `#${p.seatNumber}` : "Select"}
                            </div>
                            <select
                              value={p.type}
                              onChange={(e) =>
                                updatePassenger(i, "type", e.target.value)
                              }
                            >
                              <option value="Regular">Regular</option>
                              <option value="Student">Student</option>
                              <option value="Senior">Senior</option>
                              <option value="PWD">PWD</option>
                            </select>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <div className="glass-card">
                    <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>
                      Payment Details
                    </h3>
                    <p style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                      <strong>Payment:</strong> GCash
                    </p>
                    <p style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                      <strong>Base Rate:</strong> ₱{tripData.fare}
                    </p>
                    <div
                      style={{
                        borderTop: "1px solid hsl(0 0% 90%)",
                        paddingTop: "0.75rem",
                        marginTop: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <strong>Total Fee</strong>
                      <span
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          color: "hsl(0 89% 41%)",
                        }}
                      >
                        ₱{totalFare.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={handleBookNow}
                      disabled={!canBook}
                      className={`book-btn ${canBook ? "active" : "disabled"}`}
                      style={{ marginTop: "1.5rem" }}
                    >
                      → Book Now
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      </div>
      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        trip={tripData}
        passengers={finalPassengers}
        totalFare={totalFare}
      />
      <Footer />
    </div>
  );
};

export default BookingPage;
