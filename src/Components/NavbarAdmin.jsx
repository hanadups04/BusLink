import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bus, User, Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import "./Navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      const stored = localStorage.getItem("buslink_current_user");
      setCurrentUser(stored ? JSON.parse(stored) : null);
    };
    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("buslink_current_user");
    setCurrentUser(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    // { to: "/", label: "Home" },
    // { to: "/trips", label: "Trips" },
    // { to: "/myBookings", label: "My Bookings" },
    { to: "/admin", label: "Admin" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar-container">
        <Link className="navbar-brand">
          <div className="navbar-brand-icon">
            <Bus style={{ width: 20, height: 20 }} />
          </div>
          <span className="navbar-brand-text">
            Bus<span className="navbar-brand-accent">Link</span>
          </span>
        </Link>

        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar-link ${isActive(link.to) ? "navbar-link--active" : ""}`}
            >
              {link.label}
              {isActive(link.to) && (
                <motion.div
                  layoutId="nav-underline"
                  className="navbar-link-underline"
                />
              )}
            </Link>
          ))}
        </div>

        <div className="navbar-auth">
          {currentUser ? (
            <>
              <div className="navbar-user-info">
                <div className="navbar-user-avatar">
                  <User style={{ width: 14, height: 14 }} />
                </div>
                <span className="navbar-user-name">{currentUser.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="navbar-logout-btn"
                title="Logout"
              >
                <LogOut style={{ width: 16, height: 16 }} />
              </button>
            </>
          ) : (
            <>
              {/* <Link to="/adminLogin" className="navbar-login-link">
                Login
              </Link> */}
              {/* <Link to="/adminLogin" className="navbar-register-link">
                Login
              </Link> */}
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="navbar-mobile-toggle"
        >
          {mobileOpen ? (
            <X style={{ width: 20, height: 20 }} />
          ) : (
            <Menu style={{ width: 20, height: 20 }} />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="navbar-mobile-menu"
          >
            <div className="navbar-mobile-links">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`navbar-mobile-link ${isActive(link.to) ? "navbar-mobile-link--active" : ""}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="navbar-mobile-auth">
                {currentUser ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="navbar-login-link"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    {/* <Link
                      to="/adminLogin"
                      onClick={() => setMobileOpen(false)}
                      className="navbar-login-link"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="navbar-register-link"
                    >
                      Register
                    </Link> */}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
