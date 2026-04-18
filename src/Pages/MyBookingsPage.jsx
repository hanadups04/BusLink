import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import TripCard from "../Components/TripCard";
// import { getBookings } from "../Backend/tripsData";
import "./MyBookingsPage.css";
import * as CustFunc from "../Backend/customer_funcs";
import { ArrowLeft } from "lucide-react";
import Receipt from "../Components/Receipt";

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const currentUser = JSON.parse(
      localStorage.getItem("buslink_current_user") || "null",
    );

    async function getBookings() {
      try {
        console.log(currentUser);
        const data = await CustFunc.getUserBookings(currentUser);
        setMyBookings(data);
        console.log("bookings data: ", data);
      } catch (error) {
        console.log("error", errror);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    getBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  const groupedBookings = useMemo(() => {
    const groups = new Map();

    for (const booking of myBookings) {
      const tripId = booking.trip_id;
      const existing = groups.get(tripId);

      if (!existing) {
        groups.set(tripId, {
          tripId,
          trip: booking.trip,
          tickets: [booking], // each booking row is already one passenger ticket
        });
      } else {
        existing.tickets.push(booking);
      }
    }

    return Array.from(groups.values());
  }, [myBookings]);

  const filteredBookings = useMemo(() => {
    return groupedBookings.filter((group) => {
      const origin = group.trip?.origin?.city_name || "";
      const destination = group.trip?.destination?.city_name || "";
      const tripId = String(group.tripId);

      const matchesSearch =
        !searchQuery ||
        origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tripId.includes(searchQuery);

      const matchesStatus = statusFilter === "all";
      return matchesSearch && matchesStatus;
    });
  }, [groupedBookings, searchQuery, statusFilter]);

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bookings-header mb-10"
          >
            <button
              onClick={() => setSelectedBooking(null)}
              className="bookings-back-btn"
            >
              <ArrowLeft style={{ width: 16, height: 16 }} />
              Back to Bookings
            </button>
            <span className="label">Booking {selectedBooking.trip_id}</span>
            <h1>
              {selectedBooking.trip.origin.city_name} →{" "}
              {selectedBooking.trip.destination.city_name}
            </h1>
            {selectedBooking.trip.bus_name && (
              <p style={{ color: "hsl(0 0% 40%)", marginTop: "0.25rem" }}>
                {selectedBooking.trip.bus_name}
              </p>
            )}
          </motion.div>

          <div className="bookings-receipts-grid">
            {selectedBooking.tickets.map((ticket, i) => (
              <Receipt
                key={ticket.id}
                trip={selectedBooking.trip}
                passenger={{
                  name: ticket.name,
                  type: ticket.passenger_type,
                  fare: ticket.fare,
                  seatNumber: ticket.seat?.seat_number || ticket.seat_id,
                }}
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
        {myBookings.length > 0 ? (
          <>
            <div className="bookings-grid">
              {filteredBookings.map((group, index) => (
                <TripCard
                  key={group.tripId}
                  trip={group.trip}
                  index={index}
                  onClick={() => setSelectedBooking(group)}
                />
              ))}
            </div>
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
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyBookingsPage;
