import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Bus, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import "./LoginPage.css";
import * as custFunc from "../Backend/customer_funcs";

const LoginPage = () => {
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
    setTimeout(async () => {
      const users = JSON.parse(localStorage.getItem("buslink_users") || "[]");
      const user = await custFunc.loginUser(email, password);
      if (user) {
        localStorage.setItem("buslink_current_user", JSON.stringify(user.id));
        toast.success(`Welcome back, ${user.username}!`);
        navigate("/");
      } else {
        toast.error("Invalid email or password");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="login-page">
      <div className="login-bg-circle login-bg-circle-1" />
      <div className="login-bg-circle login-bg-circle-2" />

      <div className="login-container">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="login-branding"
        >
          <Link to="/" className="login-logo">
            <div className="login-logo-icon">
              <Bus size={28} color="white" />
            </div>
            <span className="login-logo-text">
              Bus<span className="login-logo-accent">Link</span>
            </span>
          </Link>
          <h1 className="login-headline">
            Your journey begins
            <br />
            with a single <span className="login-headline-accent">click</span>.
          </h1>
          <p className="login-subtext">
            Book premium bus travel across the country. Fast, reliable, and
            always on time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="login-form-card"
        >
          <div className="login-mobile-logo">
            <div className="login-logo-icon-sm">
              <Bus size={20} color="white" />
            </div>
            <span className="login-logo-text-sm">
              Bus<span className="login-logo-accent">Link</span>
            </span>
          </div>
          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">Sign in to your account</p>
          <form onSubmit={handleLogin} className="login-form">
            <div className="login-field">
              <label>Email</label>
              <div className="login-input-wrap">
                <Mail className="login-input-icon" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div className="login-field">
              <label>Password</label>
              <div className="login-input-wrap">
                <Lock className="login-input-icon" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? (
                <div className="login-spinner" />
              ) : (
                <>
                  Login <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
          <div className="login-footer-link">
            <span>Create an Account? </span>
            <Link to="/register">Sign Up</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
