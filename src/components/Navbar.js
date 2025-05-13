import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const Navbar = () => {
  const [user] = useAuthState(auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      backgroundColor: "#b30000",
      color: "white",
      position: "relative"
    }}>
      <div style={{ flex: "1" }}>
        <h1 style={{ margin: 0 }}>Liga AC</h1>
      </div>

      <div style={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "2rem"
      }}>
        <Link className="nav-link" to="/">Acasă</Link>
        <Link className="nav-link" to="/login">Logare</Link>
        <Link className="nav-link" to="/register">Înregistrare</Link>
        <Link className="nav-link" to="/account">Contul Meu</Link>
      </div>

      <div style={{ flex: "1", textAlign: "right" }}>
        {!user ? (
          <Link to="/register">
            <button
              className="btn-pop"
              style={{
                padding: "0.5rem 1.2rem",
                background: "white",
                border: "none",
                fontSize: "1rem",
                fontWeight: "600",
                fontFamily: "inherit",
                color: "#b30000",
                cursor: "pointer",
                borderRadius: "10px"
              }}
            >
              Înregistrează-te
            </button>
          </Link>
        ) : (
          <div style={{ position: "relative", display: "inline-block" }}>
            <FaUserCircle
              size={28}
              color="white"
              className="nav-icon"
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className="dropdown-menu">
                <Link
                  to="/account"
                  className="dropdown-item"
                  onClick={() => setShowDropdown(false)}
                >
                  Profil
                </Link>
                <button
                  className="dropdown-item"
                  onClick={async () => {
                    try {
                      await signOut(auth);
                      setShowDropdown(false);
                      navigate("/");
                    } catch (error) {
                      console.error("Eroare la signOut:", error);
                    }
                  }}
                >
                  Deconectare
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;