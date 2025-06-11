// Applications.js
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Applications = () => {
  const [user, loading] = useAuthState(auth);
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAZ, setSortAZ] = useState(false);
  const [filterDep1, setFilterDep1] = useState("");
  const [filterDep2, setFilterDep2] = useState("");
  const [filterDep3, setFilterDep3] = useState("");
  const [filterVol, setFilterVol] = useState("");
  const [filterFac, setFilterFac] = useState("");
  const [filterSpec, setFilterSpec] = useState("");
  const [filterAn, setFilterAn] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user || !user.email.endsWith("@ligaac.ro")) {
        navigate("/");
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "applications"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const filtered = data.filter(app => app.firstName && app.lastName && app.email);
      setApplications(filtered);
    };
    fetchData();
  }, []);

  const filteredApplications = applications
    .filter(app => {
      const fullName = `${app.firstName} ${app.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    })
    .filter(app => !filterDep1 || app.top1?.toLowerCase() === filterDep1.toLowerCase())
    .filter(app => !filterDep2 || app.top2?.toLowerCase() === filterDep2.toLowerCase())
    .filter(app => !filterDep3 || app.top3?.toLowerCase() === filterDep3.toLowerCase())
    .filter(app => !filterVol || app.q1 === filterVol)
    .filter(app => !filterFac || app.facultate?.toLowerCase() === filterFac.toLowerCase())
    .filter(app => !filterSpec || app.specializare?.toLowerCase() === filterSpec.toLowerCase())
    .filter(app => !filterAn || app.anstudiu === filterAn)
    .sort((a, b) => sortAZ ? a.lastName.localeCompare(b.lastName) : 0);

  return (
    <div
      style={{
        backgroundImage: `url('/poza_fundal_blur.JPEG')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        width: "100vw",
        padding: "2rem",
        fontFamily: "Montserrat, sans-serif",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div style={{ width: "100%", maxWidth: "1000px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2rem",
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            paddingTop: "80px",
            justifyContent: "space-between"
          }}
        >

          <select onChange={e => setSortAZ(e.target.value === 'true')} style={selectStyle}>
            <option value="false">Sortare</option>
            <option value="true">Alfabetic A-Z</option>
          </select>

          <select onChange={e => setFilterDep1(e.target.value)} style={selectStyle}>
            <option value="">Primul departament</option>
            <option value="Imagine">Imagine</option>
            <option value="Financiar">Financiar</option>
            <option value="Tehnic">Tehnic</option>
            <option value="Resurse Umane">Resurse Umane</option>
            <option value="Promovare">Promovare</option>
            <option value="Educațional">Educațional</option>
          </select>
          <select onChange={e => setFilterDep2(e.target.value)} style={selectStyle}>
            <option value="">Al 2-lea departament</option>
            <option value="Imagine">Imagine</option>
            <option value="Financiar">Financiar</option>
            <option value="Tehnic">Tehnic</option>
            <option value="Resurse Umane">Resurse Umane</option>
            <option value="Promovare">Promovare</option>
            <option value="Educațional">Educațional</option>
          </select>
          <select onChange={e => setFilterDep3(e.target.value)} style={selectStyle}>
            <option value="">Al 3-lea departament</option>
            <option value="Imagine">Imagine</option>
            <option value="Financiar">Financiar</option>
            <option value="Tehnic">Tehnic</option>
            <option value="Resurse Umane">Resurse Umane</option>
            <option value="Promovare">Promovare</option>
            <option value="Educațional">Educațional</option>
          </select>

          

          <select onChange={e => setFilterAn(e.target.value)} style={selectStyle}>
            <option value="">An studiu</option>
            <option value="An I Licență">An I Licență</option>
            <option value="An II Licență">An II Licență</option>
            <option value="An III Licență">An III Licență</option>
            <option value="An IV Licență">An IV Licență</option>
            <option value="An I Master">An I Master</option>
            <option value="An II Master">An II Master</option>
          </select>
          
          <input placeholder="Facultate" onChange={e => setFilterFac(e.target.value)} style={selectStyle} />
          <input placeholder="Specializare" onChange={e => setFilterSpec(e.target.value)} style={selectStyle} />
          <input
            type="text"
            placeholder="Caută după nume..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: "1 1 200px", padding: "0.75rem 1rem", fontSize: "1rem", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {filteredApplications.length === 0 && (
            <p style={{ fontSize: "1.2rem", color: "#b30000" }}>Nicio aplicație găsită.</p>
          )}

          {filteredApplications.map((app) => {
            const createdAtDate = app.createdAt?.seconds
              ? new Date(app.createdAt.seconds * 1000)
              : new Date();

            return (
              <div
                key={app.id}
                style={{
                  border: "2px solid #b30000",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
                  position: "relative"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div></div>
                  <div style={{ textAlign: "right", color: "#b30000", fontSize: "0.9rem" }}>
                    <div>Data: {createdAtDate.toLocaleDateString()}</div>
                    <div>Ora: {createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>

                <h2 style={{ margin: "0.3rem 0", fontSize: "1.6rem" }}>{app.lastName?.toUpperCase()} {app.firstName}</h2>

                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                  {[app.top1, app.top2, app.top3].filter(Boolean).map((dep, idx) => (
                    <span key={idx} style={tagStyle}>{dep}</span>
                  ))}
                </div>

                <p><strong>Email:</strong> {app.email}</p>

                <button
                  style={{
                    position: "absolute",
                    bottom: "1rem",
                    right: "1rem",
                    backgroundColor: "#F29339",
                    color: "white",
                    padding: "1rem 2rem",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  În așteptare
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const tagStyle = {
  backgroundColor: "#df9294",
  color: "white",
  padding: "0.4rem 0.8rem",
  borderRadius: "20px",
  fontSize: "0.85rem",
  fontWeight: 500
};

const selectStyle = {
  flex: "1 1 200px",
  padding: "0.75rem 1rem",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

export default Applications;
