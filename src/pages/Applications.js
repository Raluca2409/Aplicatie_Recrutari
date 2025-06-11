// Applications.js
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";

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
  const [selectedApp, setSelectedApp] = useState(null);
  const [observatii, setObservatii] = useState("");
  const [status, setStatus] = useState("");
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

  const handleReviewClick = (app) => {
    setSelectedApp(app);
    setObservatii(app.observatii || "");
    setStatus(app.status || "pending");
  };
  
  const handleSaveStatus = async () => {
    if (selectedApp) {
      await updateDoc(doc(db, "applications", selectedApp.id), {
        observatii,
        status,
      });
      setApplications((prev) =>
        prev.map(app =>
          app.id === selectedApp.id ? { ...app, observatii, status } : app
        )
      );
      setSelectedApp(null);
    }
  };
  

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
                {app.observatii && (
                <p style={{ color: "gray", marginTop: "0.5rem" }}>
                    <strong>Observații:</strong> {app.observatii}
                </p>
                )}


                <button
                    onClick={() => handleReviewClick(app)}
                    style={{
                      position: "absolute",
                      bottom: "1rem",
                      right: "1rem",
                      backgroundColor: app.status === 'accepted' ? '#2e7d32' : app.status === 'rejected' ? '#c62828' : '#F29339',
                      color: "white",
                      padding: "1rem 2rem",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      border: "none",
                      cursor: "pointer"
                    }}
                > 
                {app.status === 'accepted' ? 'Acceptat' : app.status === 'rejected' ? 'Respins' : 'Verifică'}
                </button>

              </div>
            );
          })}
        </div>
      </div>

      {selectedApp && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  }}>
    <div style={{
      background: "#fff",
      padding: "2rem",
      borderRadius: "12px",
      maxWidth: "600px",
      width: "100%"
    }}>
      <h2 style={{ marginBottom: "1rem" }}>Aplicație: {selectedApp.lastName} {selectedApp.firstName}</h2>
      <p><strong>Email:</strong> {selectedApp.email}</p>
      <p><strong>Număr de telefon:</strong> {selectedApp.tel}</p>
      <p><strong>Facultate:</strong> {selectedApp.facultate}</p>
      <p><strong>Specializare:</strong> {selectedApp.specializare}</p>
      <p><strong>An studiu:</strong> {selectedApp.anstudiu}</p>
      
      <p><strong>Top 3 departamente:</strong></p>
      <ol>
        <li>{selectedApp.top1}</li>
        <li>{selectedApp.top2}</li>
        <li>{selectedApp.top3}</li>
      </ol>
      
      <p><strong>Ai mai făcut voluntariat?</strong> {selectedApp.q1}</p>
      {selectedApp.q1 === "Da" && (
        <p><strong>Detalii:</strong> {selectedApp.answer}</p>
      )}
      
      <p><strong>De ce vrei să te alături?</strong><br />{selectedApp.q2}</p>
      <p><strong>Despre tine:</strong><br />{selectedApp.q3}</p>
      
      <hr style={{ margin: "1.5rem 0" }} />
      
      <textarea
        value={observatii}
        onChange={e => setObservatii(e.target.value)}
        placeholder="Observații pentru aplicant"
        style={{
          width: "100%",
          minHeight: "80px",
          marginBottom: "1rem",
          padding: "0.5rem"
        }}
      />
  
      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
      >
        <option value="pending">În așteptare</option>
        <option value="accepted">Acceptat</option>
        <option value="rejected">Respins</option>
      </select>


      <button onClick={handleSaveStatus} style={{
        background: "#b30000",
        color: "white",
        padding: "0.75rem 1.5rem",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer"
      }}>Salvează</button>

      <button onClick={() => setSelectedApp(null)} style={{
        marginLeft: "1rem",
        padding: "0.75rem 1.5rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        background: "white",
        cursor: "pointer"
      }}>Închide</button>
    </div>
  </div>
)}


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
