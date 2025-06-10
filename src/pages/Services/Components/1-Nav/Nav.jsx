import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "./nav.css";

export default function Nav() {
  const [showModal, setShowModal] = useState(false);
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const storedName = localStorage.getItem("user_name");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);

        if (payload.exp && payload.exp < now) {
          throw new Error("Token expired");
        }

        if (storedName) {
          setUserName(storedName);
        } else if (payload.Name) {
          setUserName(payload.Name);
        } else {
          setUserName("");
        }

        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error decoding token:", error);
        handleLogout();
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_name");
    setUserName("");
    setIsLoggedIn(false);
    navigate("/");
  };

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path.startsWith("/services")) return "services";
    if (path.startsWith("/about")) return "about";
    if (path.startsWith("/contact")) return "contact";
    return "";
  };

  const handleUserIconClick = () => {
    if (!isLoggedIn) {
      setShowLoginOptions(true);
      return;
    }

    const token = localStorage.getItem("access_token");
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = (payload.role || "User").toLowerCase();
      navigate(role === "technician" ? "/Tech" : "/User");
    } catch (err) {
      console.error("Error reading user role:", err);
      handleLogout();
    }
  };

  const closeModals = () => {
    setShowModal(false);
    setShowLoginOptions(false);
  };

  return (
    <header className="head flex">
      {/* Logo */}
      <div className="logo">
        <img src="/images/logo light.png" alt="logo" />
      </div>

      {/* Mobile menu icon */}
      <button onClick={() => setShowModal(true)} className="menu" aria-label="Open menu">
        ☰
      </button>

      {/* Navigation Links */}
      <nav>
        <ul className="flex">
          <li className={getCurrentPage() === "home" ? "activee" : ""}>
            <Link to="/">الرئيسية</Link>
          </li>
          <li className={getCurrentPage() === "services" ? "activee" : ""}>
            <Link to="/services">الخدمات</Link>
          </li>
          <li className={getCurrentPage() === "about" ? "activee" : ""}>
            <Link to="/about">معلومات عنا</Link>
          </li>
          <li className={getCurrentPage() === "contact" ? "activee" : ""}>
            <Link to="/contact">تواصل معنا</Link>
          </li>
        </ul>
      </nav>

      {/* User info / profile */}
      <div className="user-info flex" style={{ gap: "1rem", alignItems: "center" }}>
        {isLoggedIn && (
          <>
            <span className="welcome-text disp">مرحباً، {userName}</span>
            <button onClick={handleLogout} className="logout-btn disp" aria-label="Logout">
              تسجيل الخروج
            </button>
          </>
        )}
        <button
          onClick={handleUserIconClick}
          className="icon-user"
          aria-label={isLoggedIn ? "User profile" : "Login"}
        />
      </div>

      {/* Mobile Modal Menu */}
      {showModal && (
        <div className="fixedd" onClick={closeModals}>
          <ul className="modall" onClick={(e) => e.stopPropagation()}>
            <li>
              <button className="icon-close" onClick={closeModals} aria-label="Close menu" />
            </li>
            <li>
              <button
                onClick={handleUserIconClick}
                className="account-btn"
                style={{ width: '100%', textAlign: 'right' }}
              >
                حسابي
              </button>
            </li>
            <li><Link to="/">الرئيسية</Link></li>
            <li><Link to="/services">الخدمات</Link></li>
            <li><Link to="/about">معلومات عنا</Link></li>
            <li><Link to="/contact">تواصل معنا</Link></li>
            {isLoggedIn && (
              <li>
                <button
                  onClick={handleLogout}
                  className="logout-btn"
                  style={{ width: '100%', textAlign: 'right' }}
                >
                  تسجيل الخروج
                </button>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Login Role Selection */}
      {showLoginOptions && (
        <div className="bgUserTech" onClick={closeModals}>
          <div className="UserOrTechLog" onClick={(e) => e.stopPropagation()}>
            <div className="titlee">
              <h6>تسجيل الدخول كـ</h6>
            </div>
            <button onClick={() => navigate('/UserLog')}>مستخدم</button>
            <button onClick={() => navigate('/TechLog')}>فني</button>
          </div>
        </div>
      )}
    </header>
  );
}