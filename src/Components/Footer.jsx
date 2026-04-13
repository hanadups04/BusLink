import { Bus, Mail, Phone, MapPin } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-logo">
              <div className="footer-brand-icon">
                <Bus style={{ width: 20, height: 20 }} />
              </div>
              <span className="footer-brand-name">BusLink</span>
            </div>
            <p className="footer-brand-desc">
              Your premium gateway to comfortable and reliable bus travel across
              the Philippines.
            </p>
          </div>

          <div>
            <h4 className="footer-section-title">Contact Us</h4>
            <div className="footer-contact-list">
              <a href="mailto:hello@buslink.ph" className="footer-contact-item">
                <Mail style={{ width: 16, height: 16 }} />
                hello@buslink.ph
              </a>
              <a href="tel:+639123456789" className="footer-contact-item">
                <Phone style={{ width: 16, height: 16 }} />
                +63 912 345 6789
              </a>
              <div className="footer-contact-item">
                <MapPin style={{ width: 16, height: 16 }} />
                Manila, Philippines
              </div>
            </div>
          </div>

          <div>
            <h4 className="footer-section-title">Quick Links</h4>
            <div className="footer-quick-links">
              <a href="/" className="footer-quick-link">
                Home
              </a>
              <a href="/trips" className="footer-quick-link">
                All Trips
              </a>
              <a href="/my-bookings" className="footer-quick-link">
                My Bookings
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Designed and Developed by BF 2025 - 2026</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
