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
  const isRecruiter = user?.email?.endsWith("@ligaac.ro");

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
  <Link to="/" style={{ textDecoration: "none" }}>
    <button
      className="btn-pop"
      style={{
        background: "rgba(255, 255, 255, 0.9)",
        borderRadius: "12px",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
        padding: "0.5rem 1rem",
        border: "none",
        cursor: "pointer"
      }}
    >
      <img
        src="/logo_ligaac.svg"
        alt="Liga AC"
        style={{
          height: "35px",
          display: "block"
        }}
      />
    </button>
  </Link>
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

        {user ? (

          isRecruiter ? (
            <>

            <Link className="nav-link" to="/">Acasă</Link>
            <Link className="nav-link" to="/applications">Aplicații</Link>
            <Link className="nav-link" to="/interview">Interviuri</Link>

            </>
          ) : (
            <>

             <Link className="nav-link" to="/">Acasă</Link>
             <Link className="nav-link" to="/aboutus">Despre noi</Link>
             <Link className="nav-link" to="/register">Înregistrare</Link>
             <Link className="nav-link" to="/account">Contul Meu</Link>
             <Link className="nav-link" to="/interview">Interviuri</Link>

            </>
            )
          ) : (
            <>
            
            <Link className="nav-link" to="/">Acasă</Link>
             <Link className="nav-link" to="/aboutus">Despre noi</Link>
             <Link className="nav-link" to="/register">Înregistrare</Link>
             <Link className="nav-link" to="/account">Contul Meu</Link>

            </>

          )  
        }  
      </div>

      <div style={{ flex: "1", textAlign: "right" }}>
        {!user ? (
          <Link to="/login">
            <button
              className="btn-pop"
              style={{
                padding: "0.5rem 1.2rem",
                background: "rgba(255, 255, 255, 0.9)",
                border: "none",
                fontSize: "1rem",
                fontWeight: "600",
                fontFamily: "inherit",
                color: "#b30000",
                cursor: "pointer",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
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
              <div
                className="profile-icon"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.2rem",
                  cursor: "pointer",
                  color: "white",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  borderRadius: "8px"
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
