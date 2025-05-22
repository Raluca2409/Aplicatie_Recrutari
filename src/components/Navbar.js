import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [user] = useAuthState(auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#b30000",
        color: "white",
        height: "40px",
        zIndex: 1000,
      }}
    >
      <div style={{ flex: "1" }}>
        <h1 style={{ margin: 0 }}>Liga AC</h1>
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "2rem",
        }}
      >
        <Link className="nav-link" to="/">
          Acasă
        </Link>
        <Link className="nav-link" to="/aboutus">
          Despre noi
        </Link>
        <Link className="nav-link" to="/register">
          Înregistrare
        </Link>
        {/* <Link className="nav-link" to="/register">
          Înregistrare
        </Link> */}
        <Link className="nav-link" to="/account">
          Contul Meu
        </Link>
      </div>

      <div style={{ flex: "1", textAlign: "right" }}>
        {!user ? (
          <Link to="/login">
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
                borderRadius: "10px",
              }}
            >
              Conectează-te
            </button>
          </Link>
        ) : (
          <div style={{ position: "relative", display: "inline-block" }}>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.2rem",
                cursor: "pointer",
                color: "white",
              }}
            >
              <FaUserCircle size={30} />
              {userData?.firstName && (
                <p
                  style={{
                    margin: "0.3rem 0 0 0",
                    fontSize: "1rem",
                    fontWeight: "500",
                  }}
                >
                  {userData.firstName}
                </p>
              )}
            </div>

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
