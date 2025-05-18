import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Account = () => {
  const [user] = useAuthState(auth);
  const [formData, setFormData] = useState({
    facultate: "",
    specializare: "",
    anstudiu: "",
    tel: "",
    reach: "",
    url: "",
    q1: "",
    answer: "",
    q2: "",
    q3: "",
    top1: "",
    top2: "",
    top3: "",
  });
  const [hasApplied, setHasApplied] = useState(false);
  const [existingData, setExistingData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);


  useEffect(() => {
    const fetchApplication = async () => {
      if (user) {
        const docRef = doc(db, "applications", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHasApplied(true);
          setExistingData(docSnap.data());
          console.log("Aplicația găsită:", docSnap.data()); 
        }
      }
    };

    fetchApplication();
  }, [user]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserInfo(docSnap.data());
        }
      }
    };
  
    fetchUserInfo();
  }, [user]);
  

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
      <>
      {hasApplied && existingData ? (
        <div style={{
          marginTop: "2rem",
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          maxWidth: "900px",
          marginInline: "auto",
          fontFamily: "Montserrat, sans-serif",
          fontSize: "1.05rem",
          lineHeight: "1.6",
          display: "flex",
          gap: "2rem",
          justifyContent: "space-between",
          flexWrap: "wrap" 
        }}
        >

          {/* Stânga: date personale */}
        <div style={{ flex: "1 1 45%" }}>
          <h3 style={{ color: "#b30000" }}>Date personale</h3>
          <p><strong>Nume:</strong> {userInfo?.lastName}</p>
          <p><strong>Prenume:</strong> {userInfo?.firstName}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Număr de telefon:</strong> {existingData.tel || "–"}</p>
          <p><strong>Facultatea:</strong> {existingData.facultate}</p>
          <p><strong>Specializarea:</strong> {existingData.specializare}</p>
          <p><strong>Anul de studiu:</strong> {existingData.anstudiu}</p>
        </div>
            
        {/* Dreapta: răspunsuri + top departamente */}
        <div style={{ flex: "1 1 45%" }}>
          <h3 style={{ color: "#b30000" }}>Aplicația mea</h3>
          { existingData.q1 === "Da" && (
            <p><strong>Ce ai învățat din experiența anterioară de voluntariat?</strong><br />{existingData.answer}</p>
           )}
          <p><strong>De ce vrei să te alături organizației noastre?</strong><br />{existingData.q2}</p>
          <p><strong>Povestește-ne ceva despre tine:</strong><br />{existingData.q3}</p>
          <p><strong>Top 3 departamente:</strong></p>
          <ol>
            <li>{existingData.top1}</li>
            <li>{existingData.top2}</li>
            <li>{existingData.top3}</li>
          </ol>
        </div>
      </div>
      ) : (

        <div style={{
          paddingTop: "80px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh"
        }}>

        <form onSubmit={handleSubmit} style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
          maxWidth: "600px"
        }}>

          <h2 style={{ textAlign: "center", color: "#b30000" }}>Formular de înscriere</h2>

          <label>1. Facultate</label>
          <textarea rows={1} name="facultate" onChange={handleChange} required 
          style={{
            fontFamily: "inherit",
            padding: "0.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            resize: "vertical",
            minHeight: "5px"
          }}
          />

          <label>2. Specializare</label>
          <textarea rows={1} name="specializare" onChange={handleChange} required 
          style={{
            fontFamily: "inherit",
            padding: "0.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            resize: "vertical",
            minHeight: "5px"
          }}
          />

          <label>3. An de studiu</label>
          <select rows={1} name="anstudiu" onChange={handleChange} required
          style={{
            fontSize: "1rem",
            padding: "0.6rem 0.8rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            height: "45px",          
            fontFamily: "inherit",
            backgroundColor: "#fff"      
          }}
          >
            <option value="">Alege...</option>
            <option value="An I Licență">An I Licență</option>
            <option value="An II Licență">An II Licență</option>
            <option value="An III Licență">An III Licență</option>
            <option value="An IV Licență">An IV Licență</option>
            <option value="An I Master">An I Master</option>
            <option value="An II Master">An II Master</option>
          </select>

          <label>4. Număr de telefon</label>
          <textarea rows={1} name="tel" onChange={handleChange} required
            style={{
              fontFamily: "inherit",
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              resize: "vertical",
              minHeight: "5px"
            }}
          />

          <label>5. De unde ai auzit de noi? </label>
          <select rows={1} name="reach" onChange={handleChange} required
          style={{
            fontSize: "1rem",
            padding: "0.6rem 0.8rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            height: "45px",          
            fontFamily: "inherit",
            backgroundColor: "#fff"      
          }}
          >
            <option value="">Alege...</option>
            <option value="Social media">Social media</option>
            <option value="De la prieteni/ colegi">De la prieteni/ colegi</option>
            <option value="Postere/ afișe">Postere/ afișe</option>
            <option value="Membrii Ligii AC">Membrii Ligii AC</option>
            <option value="Proiectele Ligii AC">Proiectele Ligii AC</option>
            <option value="Site-ul oficial Liga AC">Site-ul oficial Liga AC</option>
          </select>

          <label>6. Link de Facebook (dacă este cazul)</label>
          <textarea rows={1} name="url" onChange={handleChange} required
            style={{
              fontFamily: "inherit",
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              resize: "vertical",
              minHeight: "5px"
            }}
          />

          <label>7. Ai mai făcut parte dintr-o organizație de voluntariat? </label>
          <select rows={1} name="q1" onChange={handleChange} required
          style={{
            fontSize: "1rem",
            padding: "0.6rem 0.8rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            height: "45px",          
            fontFamily: "inherit",
            backgroundColor: "#fff"      
          }}
          >
            <option value="">Alege...</option>
            <option value="Da">Da</option>
            <option value="Nu">Nu</option>
          </select>

          <label>8. Dacă da, ne poți spune numele organizației și un lucru pe care l-ai învățat din această experiență?</label>
          <textarea name="answer" onChange={handleChange} required 
          style={{
            fontFamily: "inherit",
            padding: "0.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            resize: "vertical",
            minHeight: "5px"
          }}
          />

          <label>9. De ce vrei să te alături organizației noastre?</label>
          <textarea name="q2" onChange={handleChange} required 
          style={{
            fontFamily: "inherit",
            padding: "0.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            resize: "vertical",
            minHeight: "5px"
          }}
          />

          <label>10. Povestește-ne ceva despre tine</label>
          <textarea name="q3" onChange={handleChange} required 
          style={{
            fontFamily: "inherit",
            padding: "0.8rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            resize: "vertical",
            minHeight: "10px"
          }}
          />

          <label>Top 3 departamente din care ai dori să faci parte:</label>
          <select rows={1} name="top1" onChange={handleChange} required
          style={{
            fontSize: "1rem",
            padding: "0.6rem 0.8rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            height: "45px",          
            fontFamily: "inherit",
            backgroundColor: "#fff"      
          }}
          >
            <option value="">Alege...</option>
            <option value="Imagine">Imagine</option>
            <option value="Financiar">Financiar</option>
            <option value="Tehnic">Tehnic</option>
            <option value="Resurse Umane">Resurse Umane</option>
            <option value="Promovare">Promovare</option>
            <option value="Educațional">Educațional</option>
          </select>

          <select rows={1} name="top2" onChange={handleChange} required
          style={{
            fontSize: "1rem",
            padding: "0.6rem 0.8rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            height: "45px",          
            fontFamily: "inherit",
            backgroundColor: "#fff"      
          }}
          >
            <option value="">Alege...</option>
            <option value="Imagine">Imagine</option>
            <option value="Financiar">Financiar</option>
            <option value="Tehnic">Tehnic</option>
            <option value="Resurse Umane">Resurse Umane</option>
            <option value="Promovare">Promovare</option>
            <option value="Educațional">Educațional</option>
          </select>

          <select rows={1} name="top3" onChange={handleChange} required
          style={{
            fontSize: "1rem",
            padding: "0.6rem 0.8rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            height: "45px",          
            fontFamily: "inherit",
            backgroundColor: "#fff"      
          }}
          >
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
    </div>
      )
    };
  </>
);
};

export default Account;
