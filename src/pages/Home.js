import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      style={{
        backgroundImage: `url('/poza_fundal.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden", // oprește scroll
        fontFamily: "Montserrat, sans-serif",
        position: "relative",
        color: "white",
      }}
    >
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 5vw",
        }}
      >
        {/* 🟥 Blurred Text Box în stânga */}
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "16px",
            padding: "2rem 2.5rem",
            maxWidth: "480px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            
          }}
        >
          <h1 style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>
            Noi suntem Liga AC!
          </h1>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
            Dacă te afli aici probabil ai aflat câte ceva despre mica noastră organizație. Dacă încă nu te-am convins să te alături echipei noastre, poți afla mai multe despre activitatea noastră aici.
          </p>
        </div>

        <div style={{ 
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end", // butonul în dreapta
          justifyContent: "flex-start", // sus pe verticală
          flex: 1,
          paddingTop: "5rem", // mută-l mai sus
          paddingRight: "17vw"
          }}>

          <Link to="/form">
             <button
              className="btn-pop"
              style={{
                position: "absolute",
                top: "15%",
                padding: "1rem 2rem",
                backgroundColor: "#b30000",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1.2rem",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 6px 12px rgba(0,0,0,0.25)"
              }}
              >
              Începe aplicarea
             </button>
           </Link>
         </div>

      </div>
    </div>
  );
};

export default Home;
