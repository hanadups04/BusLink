import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import TripCard from "../Components/TripCard";
// import { getBookings } from "../Backend/tripsData";
import "./MyBookingsPage.css";

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
   const [selectedBooking, setSelectedBooking] = useState(null);

  // const bookings = getBookings();

  // const filtered = useMemo(() => {
  //   return bookings.filter((b) => {
  //     const matchesSearch =
  //       !searchQuery ||
  //       b.trip.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       b.trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       b.id.toLowerCase().includes(searchQuery.toLowerCase());
  //     const matchesStatus = statusFilter === "all" || b.status === statusFilter;
  //     return matchesSearch && matchesStatus;
  //   });
  // }, [bookings, searchQuery, statusFilter]);

  const statuses = ["all", "Booked", "Done", "Cancelled"];


    // Receipts view
  if (selectedBooking) {
    return (
      <div className="my-bookings-page">
        <Navbar />
        <div className="pt-28 pb-20 container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bookings-header mb-10">
            <button
              onClick={() => setSelectedBooking(null)}
              className="bookings-back-btn"
            >
              <ArrowLeft style={{ width: 16, height: 16 }} />
              Back to Bookings
            </button>
            <span className="label">Booking {selectedBooking.id}</span>
            <h1>{selectedBooking.trip.origin} → {selectedBooking.trip.destination}</h1>
            {selectedBooking.trip.busName && (
              <p style={{ color: "hsl(0 0% 40%)", marginTop: "0.25rem" }}>{selectedBooking.trip.busName}</p>
            )}
          </motion.div>

          <div className="bookings-receipts-grid">
            {selectedBooking.passengers.map((passenger, i) => (
              <Receipt
                key={i}
                trip={selectedBooking.trip}
                passenger={passenger}
                index={i}
              />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="my-bookings-page">
      <Navbar />
      <div className="pt-28 pb-20 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bookings-header mb-10"
        >
          <span className="label">Your Rides</span>
          <h1>My Bookings</h1>
        </motion.div>
        {/* {bookings.length > 0 ? ( */}
        <>
          <div className="bookings-controls">
            <div className="search-input-wrapper">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Search by route or booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-buttons">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`filter-btn ${statusFilter === s ? "active" : "inactive"}`}
                >
                  {s === "all" ? "All" : s}
                </button>
              ))}
            </div>
          </div>

          {/* {filtered.length > 0 ? (
              <div className="bookings-grid">
                {filtered.map((booking, i) => (
                                    <TripCard key={booking.id} trip={booking.trip} index={i} status={booking.status} onClick={() => setSelectedBooking(booking)} />

                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "5rem 0",
                  color: "hsl(0 0% 40%)",
                }}
              >
                No bookings match your search.
              </div>
            )} */}
        </>
        ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="empty-state"
        >
          <div className="empty-icon">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={{ opacity: 0.5 }}
            >
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
              <path d="M13 5v2" />
              <path d="M13 17v2" />
              <path d="M13 11v2" />
            </svg>
          </div>
          <h2>No bookings yet</h2>
          <p>
            You haven't booked any trips. Start exploring available routes and
            book your first ride!
          </p>
          <button onClick={() => navigate("/")} className="book-now-btn">
            Book Now →
          </button>
        </motion.div>
        {/* )} */}
      </div>
      <Footer />
    </div>
  );
};

export default MyBookingsPage;
