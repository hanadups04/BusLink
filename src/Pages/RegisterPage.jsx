import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Bus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import "./RegisterPage.css";
import { createUser } from "../Backend/customer_funcs";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;
  const allFilled =
    username.trim() && email.trim() && password && confirmPassword;
  const isValid = allFilled && passwordsMatch;

  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "" };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    return { score, label: labels[score] || "" };
  }, [password]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);

    const newUser = {
      username: username.trim(),
      Email: email.trim(),
      password: password.trim(),
    };

    const create = await createUser(newUser);
    if (create === 1) {
      toast.success("Account created successfully!");
      navigate("/");
      setLoading(false);
    } else {
      toast.success("Account creation failed!");
      alert(create.message);
      setLoading(false);
    }
  };

  const strengthColors = [
    "",
    "#e54",
    "#FF6500",
    "#F6CE71",
    "#C40C0C",
    "#C40C0C",
  ];

  return (
    <div className="register-page">
      <div className="register-bg-circle register-bg-circle-1" />
      <div className="register-bg-circle register-bg-circle-2" />

      <div className="register-container">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="register-branding"
        >
          <Link to="/" className="register-logo">
            <div className="register-logo-icon">
              <Bus size={28} color="white" />
            </div>
            <span className="register-logo-text">
              Bus<span className="register-logo-accent">Link</span>
            </span>
          </Link>
          <h1 className="register-headline">
            Start your travel
            <br />
            adventure <span className="register-headline-accent">today</span>.
          </h1>
          <p className="register-subtext">
            Create your account and unlock seamless booking experiences across
            hundreds of routes.
          </p>
          <div className="register-features">
            {[
              "Instant seat selection & booking",
              "Real-time trip tracking",
              "Exclusive member discounts",
            ].map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="register-feature"
              >
                <div className="register-feature-icon">
                  <Check size={12} color="white" />
                </div>
                <span>{f}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="register-form-card"
        >
          <div className="register-mobile-logo">
            <div className="register-logo-icon-sm">
              <Bus size={20} color="white" />
            </div>
            <span className="register-logo-text-sm">
              Bus<span className="register-logo-accent">Link</span>
            </span>
          </div>
          <h2 className="register-title">Create account</h2>
          <p className="register-subtitle">Join BusLink today</p>
          <form onSubmit={handleRegister} className="register-form">
            <div className="register-field">
              <label>Username</label>
              <div className="register-input-wrap">
                <User className="register-input-icon" size={16} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>
            <div className="register-field">
              <label>Email</label>
              <div className="register-input-wrap">
                <Mail className="register-input-icon" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div className="register-field">
              <label>Password</label>
              <div className="register-input-wrap">
                <Lock className="register-input-icon" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  className="register-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && (
                <div className="register-strength">
                  <div className="register-strength-bars">
                    {[1, 2, 3, 4, 5].map((l) => (
                      <div
                        key={l}
                        className="register-strength-bar"
                        style={{
                          background:
                            l <= passwordStrength.score
                              ? strengthColors[passwordStrength.score]
                              : "#e5e5e5",
                        }}
                      />
                    ))}
                  </div>
                  <span className="register-strength-label">
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>
            <div className="register-field">
              <label>Confirm Password</label>
              <div className="register-input-wrap">
                <Lock className="register-input-icon" size={16} />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={
                    confirmPassword
                      ? passwordsMatch
                        ? "input-match"
                        : "input-mismatch"
                      : ""
                  }
                  required
                />
                <button
                  type="button"
                  className="register-eye-btn"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && (
                <div
                  className={`register-match-msg ${passwordsMatch ? "match" : "mismatch"}`}
                >
                  {passwordsMatch ? (
                    <>
                      <Check size={12} /> Passwords match
                    </>
                  ) : (
                    <>
                      <X size={12} /> Passwords do not match
                    </>
                  )}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="register-submit"
              disabled={!isValid || loading}
            >
              {loading ? (
                <div className="register-spinner" />
              ) : (
                <>
                  Create Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
          <div className="register-footer-link">
            <span>Already have an Account? </span>
            <Link to="/login">Login</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
