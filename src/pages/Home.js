import React from "react";
import { Link } from "react-router-dom";

const Home = () => {

  return (
    <div>

      <header style={{ textAlign: "center", padding: "3rem" }}>
        <h2>Bine ai venit în Liga Studenților</h2>
        <p>Descoperă cine suntem, ce facem și cum poți face parte din echipa noastră.</p>
        <Link to="/register">
          <button 
            className="btn-pop"
            style={{ fontSize: "20px", fontFamily: "inherit", backgroundColor: "#b30000", color: "white", padding: "1rem 2rem", marginTop: "1rem", border: "none", borderRadius: "8px" }}>
            Începe aplicarea
          </button>
        </Link>
      </header>

      <section style={{ padding: "2rem", textAlign: "center" }}>
        <h3>Despre noi</h3>
        <p style={{ maxWidth: "800px", margin: "0 auto" }}>
          Liga Studenților este o organizație care își propune să creeze o comunitate puternică și unită, să dezvolte abilități prin proiecte și implicare activă.
        </p>
        {/* Poți adăuga aici imagini sau testimoniale */}
      </section>
    </div>
  );
};

export default Home;
