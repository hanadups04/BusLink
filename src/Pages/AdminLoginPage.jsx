import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import "./AdminLoginPage.css";
import * as AdminFunction from "../Backend/admin_funcs";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const admin = await AdminFunction.adminLogin(email, password);
      if (admin) {
        toast.success("Welcome, Admin!");
        navigate("/admin");
      } else {
        toast.error("Invalid admin credentials");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg">
        <div className="admin-login-bg-circle admin-login-bg-circle--1" />
        <div className="admin-login-bg-circle admin-login-bg-circle--2" />
      </div>

      <div className="admin-login-container">
        {/* Left branding */}
        <div className="admin-login-branding">
          <Link className="admin-login-logo">
            <div className="admin-login-logo-icon">
              <Shield />
            </div>
            <span className="admin-login-logo-text">
              Bus<span className="gradient">Link</span>
              <span className="admin-label">Admin</span>
            </span>
          </Link>

          <h1>
            Admin
            <br />
            <span className="gradient">Control Panel</span>
          </h1>
          <p>
            Manage trips, monitor bookings, and keep your fleet running
            smoothly.
          </p>

          <div className="admin-login-stats">
            {[
              { value: "8", label: "Active Trips" },
              { value: "50", label: "Seats/Bus" },
              { value: "24/7", label: "Monitoring" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="admin-login-stat-value">{stat.value}</div>
                <div className="admin-login-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right form */}
        <div className="admin-login-form-wrapper">
          <div className="admin-login-card">
            <div className="admin-login-mobile-logo">
              <div className="admin-login-mobile-logo-icon">
                <Shield style={{ width: 20, height: 20, color: "white" }} />
              </div>
              <span>
                Bus
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(0,89%,41%), hsl(24,100%,50%))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Link
                </span>
              </span>
            </div>

            <h2>Admin Login</h2>
            <p className="subtitle">Access the management dashboard</p>

            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="admin-login-field">
                <label>Email</label>
                <div className="input-wrapper">
                  <Mail />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@buslink.com"
                    required
                  />
                </div>
              </div>

              <div className="admin-login-field">
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    style={{ paddingRight: "3rem" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-password"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="admin-login-submit"
              >
                {loading ? (
                  <div className="admin-login-spinner" />
                ) : (
                  <>
                    Access Dashboard
                    <ArrowRight />
                  </>
                )}
              </button>
            </form>

            {/* <div className="admin-login-links">
              <span>Not an admin? </span>
              <Link to="/login">User Login</Link>
            </div> */}

            {/* <Link to="/admin" className="admin-login-back">
              <ArrowLeft />
              Back to Home
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
