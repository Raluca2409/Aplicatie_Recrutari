import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Account = () => {
  const [user] = useAuthState(auth);
  const [formData, setFormData] = useState({
    q1: "",
    q2: "",
    top1: "",
    top2: "",
    top3: "",
  });
  const [hasApplied, setHasApplied] = useState(false);
  const [existingData, setExistingData] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      if (user) {
        const docRef = doc(db, "applications", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHasApplied(true);
          setExistingData(docSnap.data());
          console.log("Aplicația găsită:", docSnap.data()); // ✅ DEBUG
        }
      }
    };

    fetchApplication();
  }, [user]);

  // ✅ Actualizează valorile din formular
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      const docRef = doc(db, "applications", user.uid);
      const existingSnap = await getDoc(docRef);

      if (!existingSnap.exists()) {
        await setDoc(docRef, {
          ...formData,
          createdAt: new Date(),
        });
        setHasApplied(true);
        setExistingData(formData);
      } else {
        alert("Ai trimis deja aplicația.");
      }
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h2 style={{ textAlign: "center", color: "#b30000" }}>Contul Meu</h2>

      {hasApplied && existingData ? (
        <div style={{
          marginTop: "2rem",
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          maxWidth: "600px",
          marginInline: "auto",
          fontFamily: "Montserrat, sans-serif",
          fontSize: "1.1rem",
          lineHeight: "1.6"
        }}>
          <p>
            <strong>De ce vrei să te alături echipei noastre?</strong><br />
            {existingData.q1}
          </p>
          <p>
            <strong>Povestește-ne ceva despre tine:</strong><br />
            {existingData.q2}
          </p>
          <p><strong>Top 3 departamente:</strong></p>
          <ul style={{ paddingLeft: "1.2rem" }}>
            <li>{existingData.top1}</li>
            <li>{existingData.top2}</li>
            <li>{existingData.top3}</li>
          </ul>
        </div>        
      ) : (
        <form onSubmit={handleSubmit} style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginTop: "2rem"
        }}>

          <label>1. De ce vrei să te alături echipei noastre?</label>
          <textarea name="q1" onChange={handleChange} required />

          <label>2. Povestește-ne ceva despre tine</label>
          <textarea name="q2" onChange={handleChange} required />

          <label>Top 3 departamente dorite:</label>
          <select name="top1" onChange={handleChange} required>
            <option value="">Alege...</option>
            <option value="Imagine">Imagine</option>
            <option value="Financiar">Financiar</option>
            <option value="Tehnic">Tehnic</option>
            <option value="Resurse Umane">Resurse Umane</option>
            <option value="Promovare">Promovare</option>
            <option value="Educațional">Educațional</option>
          </select>

          <select name="top2" onChange={handleChange} required>
            <option value="">Alege...</option>
            <option value="Imagine">Imagine</option>
            <option value="Financiar">Financiar</option>
            <option value="Tehnic">Tehnic</option>
            <option value="Resurse Umane">Resurse Umane</option>
            <option value="Promovare">Promovare</option>
            <option value="Educațional">Educațional</option>
          </select>

          <select name="top3" onChange={handleChange} required>
            <option value="">Alege...</option>
            <option value="Imagine">Imagine</option>
            <option value="Financiar">Financiar</option>
            <option value="Tehnic">Tehnic</option>
            <option value="Resurse Umane">Resurse Umane</option>
            <option value="Promovare">Promovare</option>
            <option value="Educațional">Educațional</option>
          </select>

          <button
            type="submit"
            style={{
              padding: "0.8rem",
              backgroundColor: "#b30000",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Trimite aplicația
          </button>
        </form>
      )}
    </div>
  );
};

export default Account;
