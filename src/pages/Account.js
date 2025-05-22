import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

const Account = () => {
  const [user] = useAuthState(auth);
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
  
  if (!user) {
    return (
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
        justifyContent: "space-between",
        flexWrap: "wrap" ,
        flexDirection: "column",
        textAlign: "center",
      }}>

        <hr style={{ margin: "1.5rem 0" }} />
        <p style={{ color: "#b30000", fontWeight: "bold" }}>Încă nu ți-ai creat un cont sau nu ești conectat la cel existent.</p>

      </div>
    );
  }

  if(user && !existingData){
    return (
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
      justifyContent: "space-between",
      flexWrap: "wrap" ,
      flexDirection: "column",
      textAlign: "center",


    }}
    >
      <h3 style={{ color: "#b30000", marginBottom: "1rem", textAlign: "center"}}>Date cont</h3>
       <div style={{textAlign: "left", display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
        <p><strong>Nume:</strong> {userInfo?.lastName || "–"}</p>
        <p><strong>Prenume:</strong> {userInfo?.firstName || "–"}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        </div>

        <hr style={{ margin: "1.5rem 0" }} />
        <p style={{ color: "#b30000", fontWeight: "bold" }}>Nu ai completat formularul încă, dar îl poți accesa și de aici.</p>

        <Link to="/form">
             <button
              className="btn-pop"
              style={{
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
              Formular
             </button>
           </Link>

      </div>
   );
  }


   return (
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
     );
  };


export default Account;
