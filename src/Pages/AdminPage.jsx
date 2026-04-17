import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Bus,
  MapPin,
  Clock,
  Route,
  ArrowRight,
  Trash2,
  Edit3,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SeatSelector from "../Components/SeatSelector";
import * as AdminFunction from "../Backend/admin_funcs"
import * as CustomerFunction from "../Backend/customer_funcs"
// import { getTrips, addTrip, updateTripDepartureTime, cancelTrip, getTripBookings } from "../Backend/tripsData";
import "./AdminPage.css";

const emptyForm = {
  origin: "",
  destination: "",
  distance: "",
  travelTime: "",
  departureDate: "",
  departureTime: "",
  fare: "",
  busName: "",
};

const AdminPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [editTime, setEditTime] = useState("");
  const [notification, setNotification] = useState(null);
  const [, setRefresh] = useState(0);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [originDesti, setOriginDesti] = useState([]);
const [trips, setTrips] = useState([]);
  
  const now = new Date();

  // const upcomingTrips = useMemo(() => {
  //   return trips.filter(
  //     (t) =>
  //       new Date(`${t.departureDate}T00:00:00`) >=
  //       new Date(now.toISOString().split("T")[0]),
  //   );
  // }, [trips]);

  // const pastTrips = useMemo(() => {
  //   return trips.filter(
  //     (t) =>
  //       new Date(`${t.departureDate}T00:00:00`) <
  //       new Date(now.toISOString().split("T")[0]),
  //   );
  // }, [trips]);

  const showNotif = (msg, type) => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

useEffect(() => {
  let isMounted = true;

  const getData = async () => {
    try {
      setLoading(true);

      const [tripss, originDestination] = await Promise.all([
        CustomerFunction.getTrips(),
        AdminFunction.getOrigins(),
      ]);

      if (isMounted) {
        setTrips(tripss);
        setOriginDesti(originDestination);
      }

      console.log("trips: ", tripss);
      console.log("originDestination: ", originDestination);

    } catch (error) {
      console.log("error", error);
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  getData();

  return () => {
    isMounted = false;
  };
}, []);

  const handleAddTrip = async (e) => {
    e.preventDefault();
    if (
      !formData.origin ||
      !formData.destination ||
      !formData.fare ||
      !formData.departureDate ||
      !formData.departureTime ||
      !formData.bus_name
    )
      return;

      const departureDateTime = `${formData.departureDate}T${formData.departureTime}:00`;

    const newTrip = {
      origin: formData.origin,
      destination: formData.destination,
      distance: formData.distance || "N/A",
      fare: parseFloat(formData.fare),
      departure_time: departureDateTime,
      bus_name: formData.bus_name
    };
    console.log("insert", newTrip);
    AdminFunction.createTrip(newTrip);
    setShowAddModal(false);
    setFormData(emptyForm);
    setRefresh((r) => r + 1);
    showNotif("Trip added successfully!", "success");
  };

  // const handleAddTrip = async (e) => {
  //   e.preventDefault();

  //   const departureDateTime = `${formData.departureDate}T${formData.departureTime}:00`;

  //   await supabase.from("trips").insert({
  //     origin: formData.origin,
  //     destination: formData.destination,
  //     distance: formData.distance || "N/A",
  //     fare: parseFloat(formData.fare),
  //     departure_time: departureDateTime,
  //     totalSeats: 50,
  //     bus_name: formData.bus_name,
  //   });
  // };

  const handleUpdateTime = () => {
    if (!selectedTrip || !editTime) return;
    updateTripDepartureTime(selectedTrip.id, editTime);
    setShowEditModal(false);
    setEditTime("");
    setSelectedTrip(null);
    setRefresh((r) => r + 1);
    showNotif("Departure time updated!", "success");
  };

  const handleCancelTrip = (trip) => {
    const success = cancelTrip(trip.id);
    if (success) {
      setSelectedTrip(null);
      setRefresh((r) => r + 1);
      showNotif("Trip cancelled successfully!", "success");
    } else {
      showNotif("Cannot cancel — trip has existing bookings.", "error");
    }
  };

  const openEditModal = (trip) => {
    setSelectedTrip(trip);
    setEditTime(trip.departureTime);
    setShowEditModal(true);
  };

  const TripAdminCard = ({ trip, isPast }) => {
    const bookingCount = getTripBookings(trip.id).length;
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, scale: 1.01 }}
        onClick={() => setSelectedTrip(trip)}
        className="admin-trip-card"
      >
        <div className="admin-trip-card-inner">
          <div className="admin-card-route">
            <div className="admin-card-route-icon">
              <MapPin />
            </div>
            <div className="admin-card-route-names">
              <span className="admin-card-route-name">{trip.origin}</span>
              <ArrowRight className="admin-card-route-arrow" />
              <span className="admin-card-route-name">{trip.destination}</span>
            </div>
          </div>
          <p className="admin-card-bus">{trip.busName}</p>
          <div className="admin-card-meta">
            <div>
              <div className="admin-card-meta-label">
                <Route />
                <span>Distance</span>
              </div>
              <p className="admin-card-meta-value">{trip.distance}</p>
            </div>
            <div>
              <div className="admin-card-meta-label">
                <Clock />
                <span>Duration</span>
              </div>
              <p className="admin-card-meta-value">{trip.travelTime}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span className="admin-card-meta-label">
                <span>Fare</span>
              </span>
              <p className="admin-card-fare">₱{trip.fare}</p>
            </div>
          </div>
          <div className="admin-card-footer">
            <div className="admin-card-footer-left">
              <strong>{trip.departureDate}</strong>
              {" · "}
              {trip.departureTime}
            </div>
            <div className="admin-card-footer-right">
              <span className="admin-card-booking-count">
                {bookingCount} booking{bookingCount !== 1 ? "s" : ""}
              </span>
              {!isPast && (
                <div
                  style={{ display: "flex", gap: "0.25rem" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => openEditModal(trip)}
                    className="admin-card-action-btn admin-card-action-btn--edit"
                  >
                    <Edit3 />
                  </button>
                  <button
                    onClick={() => handleCancelTrip(trip)}
                    className="admin-card-action-btn admin-card-action-btn--delete"
                  >
                    <Trash2 />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Trip detail view
  if (selectedTrip && !showEditModal) {
    const bookings = getTripBookings(selectedTrip.id);
    return (
      <div className="admin-page">
        <Navbar />
        <div className="pt-28 pb-20 container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: "2.5rem" }}
          >
            <button
              onClick={() => setSelectedTrip(null)}
              className="admin-detail-back"
            >
              <ArrowRight style={{ transform: "rotate(180deg)" }} />
              Back to Trips
            </button>
            <span className="admin-detail-label">Trip Details</span>
            <h1 className="admin-detail-title">
              {selectedTrip.origin} → {selectedTrip.destination}
            </h1>
            <p className="admin-detail-bus">{selectedTrip.busName}</p>
          </motion.div>

          <div className="admin-detail-grid">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="admin-detail-card">
                <h2>Seat Layout</h2>
                <SeatSelector
                  totalSeats={selectedTrip.totalSeats}
                  occupiedSeats={selectedTrip.seatsOccupied}
                  selectedSeats={[]}
                  onSeatToggle={() => {}}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div className="admin-detail-card">
                <h3>Trip Information</h3>
                <div className="admin-info-grid">
                  <div className="admin-info-item">
                    <MapPin style={{ color: "hsl(0 89% 41%)" }} />
                    <div>
                      <p className="admin-info-label">Origin</p>
                      <p className="admin-info-value">{selectedTrip.origin}</p>
                    </div>
                  </div>
                  <div className="admin-info-item">
                    <MapPin style={{ color: "hsl(24 100% 50%)" }} />
                    <div>
                      <p className="admin-info-label">Destination</p>
                      <p className="admin-info-value">
                        {selectedTrip.destination}
                      </p>
                    </div>
                  </div>
                  <div className="admin-info-item">
                    <Route style={{ color: "hsl(0 0% 40%)" }} />
                    <div>
                      <p className="admin-info-label">Distance</p>
                      <p className="admin-info-value">
                        {selectedTrip.distance}
                      </p>
                    </div>
                  </div>
                  <div className="admin-info-item">
                    <Clock style={{ color: "hsl(0 0% 40%)" }} />
                    <div>
                      <p className="admin-info-label">Departure</p>
                      <p className="admin-info-value">
                        {selectedTrip.departureDate} ·{" "}
                        {selectedTrip.departureTime}
                      </p>
                    </div>
                  </div>
                  <div className="admin-info-item">
                    <Bus style={{ color: "hsl(0 0% 40%)" }} />
                    <div>
                      <p className="admin-info-label">Bus Name</p>
                      <p className="admin-info-value">{selectedTrip.busName}</p>
                    </div>
                  </div>
                  <div className="admin-info-item">
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        color: "hsl(0 0% 40%)",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      ₱
                    </span>
                    <div>
                      <p className="admin-info-label">Fare</p>
                      <p
                        className="admin-info-value"
                        style={{ color: "hsl(0 89% 41%)" }}
                      >
                        ₱{selectedTrip.fare}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-detail-card">
                <h3>Seat Availability</h3>
                <div className="admin-availability">
                  <div className="admin-availability-row">
                    <span>Occupied</span>
                    <span>
                      {selectedTrip.seatsOccupied.length} /{" "}
                      {selectedTrip.totalSeats}
                    </span>
                  </div>
                  <div className="admin-availability-row">
                    <span>Available</span>
                    <span>
                      {selectedTrip.totalSeats -
                        selectedTrip.seatsOccupied.length}
                    </span>
                  </div>
                </div>
              </div>

              {bookings.length > 0 && (
                <div className="admin-detail-card">
                  <h3>Bookings ({bookings.length})</h3>
                  <div className="admin-booking-list">
                    {bookings.map((b) => (
                      <div key={b.id} className="admin-booking-item">
                        <div>
                          <p className="admin-booking-item-id">{b.id}</p>
                          <p className="admin-booking-item-pax">
                            {b.passengers.length} passenger
                            {b.passengers.length > 1 ? "s" : ""}
                          </p>
                        </div>
                        <span
                          className={`admin-booking-status admin-booking-status--${b.status.toLowerCase()}`}
                        >
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Navbar />

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`admin-notification admin-notification--${notification.type}`}
          >
            {notification.type === "success" ? (
              <CheckCircle />
            ) : (
              <AlertCircle />
            )}
            <span>{notification.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-28 pb-20 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-header"
        >
          <div>
            <span className="admin-header-label">Admin Panel</span>
            <h1>Trips Management</h1>
          </div>
          <button
            onClick={() => {
              setFormData(emptyForm);
              setShowAddModal(true);
            }}
            className="admin-add-btn"
          >
            <Plus />
            Add Trip
          </button>
        </motion.div>

        <div className="admin-tabs">
          {["ongoing", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`admin-tab ${activeTab === tab ? "admin-tab--active" : "admin-tab--inactive"}`}
            >
              {tab === "ongoing" ? "Ongoing Trips" : "Completed Trips"}
              <span className="admin-tab-count">
                {/* {tab === "ongoing" ? upcomingTrips.length : pastTrips.length} */}
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "ongoing" ? (
            <motion.div
              key="ongoing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* {upcomingTrips.length > 0 ? (
                <div className="admin-trips-grid">
                  {upcomingTrips.map((trip) => (
                    <TripAdminCard key={trip.id} trip={trip} />
                  ))}
                </div>
              ) : (
                <p className="admin-empty">No upcoming trips.</p>
              )} */}
            </motion.div>
          ) : (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {pastTrips.length > 0 ? (
                <div className="admin-trips-grid">
                  {pastTrips.map((trip) => (
                    <TripAdminCard key={trip.id} trip={trip} isPast />
                  ))}
                </div>
              ) : (
                <p className="admin-empty">No completed trips yet.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Trip Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="admin-modal-overlay"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="admin-modal"
            >
              <div className="admin-modal-header">
                <h3>Add New Trip</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="admin-modal-close"
                >
                  <X />
                </button>
              </div>
              <div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Origin</label>
                    <select
                      name="origin"
                      className="admin-form-input"
                      value={formData.origin}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, origin: e.target.value }))
                      }
                    >
                      <option value="">Select origin</option>
                      {originDesti.map((origin) => (
                        <option key={origin.location_id} value={origin.location_id}>
                          {origin.city_name}
                        </option>
                      ))}
                    </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Destination</label>
                    <select
                      name="destination"
                      className="admin-form-input"
                      value={formData.destination}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, destination: e.target.value }))
                      }
                    >
                      <option value="">Select destination</option>
                      {originDesti.map((destination) => (
                        <option key={destination.location_id} value={destination.location_id}>
                          {destination.city_name}
                        </option>
                      ))}
                    </select>
                </div>
                {[
                  {
                    label: "Distance",
                    key: "distance",
                    placeholder: "e.g. 246 km",
                  },
                  // { label: "Travel Time", key: "travelTime", placeholder: "e.g. 5h 30m" },
                  {
                    label: "Bus Name *",
                    key: "bus_name",
                    placeholder: "e.g. BusLink Express",
                  },
                  { label: "Fare *", key: "fare", placeholder: "e.g. 750" },
                ].map((field) => (
                  <div key={field.key} className="admin-form-group">
                    <label className="admin-form-label">{field.label}</label>
                    <input
                      type={field.key === "fare" ? "number" : "text"}
                      placeholder={field.placeholder}
                      value={formData[field.key]}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          [field.key]: e.target.value,
                        }))
                      }
                      className="admin-form-input"
                    />
                  </div>
                ))}
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Departure Date *</label>
                    <input
                      type="date"
                      value={formData.departureDate}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          departureDate: e.target.value,
                        }))
                      }
                      className="admin-form-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Departure Time *</label>
                    <input
                      type="time"
                      placeholder="e.g. 06:00 AM"
                      value={formData.departureTime}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          departureTime: e.target.value,
                        }))
                      }
                      className="admin-form-input"
                    />
                  </div>
                </div>
              </div>
              <div className="admin-modal-actions">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="admin-modal-cancel"
                >
                  Cancel
                </button>
                <button type="submit" onClick={handleAddTrip} className="admin-modal-submit">
                  <Plus />
                  Add Trip
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Time Modal */}
      <AnimatePresence>
        {showEditModal && selectedTrip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="admin-modal-overlay"
            onClick={() => {
              setShowEditModal(false);
              setSelectedTrip(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="admin-modal admin-modal--sm"
            >
              <div className="admin-modal-header">
                <h3>Update Departure Time</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedTrip(null);
                  }}
                  className="admin-modal-close"
                >
                  <X />
                </button>
              </div>
              <p className="admin-modal-trip-info">
                {selectedTrip.origin} → {selectedTrip.destination} ·{" "}
                {selectedTrip.departureDate}
              </p>
              <div className="admin-form-group">
                <label className="admin-form-label">New Departure Time</label>
                <input
                  type="text"
                  placeholder="e.g. 07:00 AM"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  className="admin-form-input"
                />
              </div>
              <div className="admin-modal-actions">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedTrip(null);
                  }}
                  className="admin-modal-cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTime}
                  className="admin-modal-submit"
                >
                  <CheckCircle />
                  Update
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default AdminPage;
