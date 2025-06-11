import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Formular = () => {

  const navigate = useNavigate();
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
  const [q1, setVolunteerExperience] = useState(""); 
  const departments = [
    "Imagine",
    "Financiar",
    "Tehnic",
    "Resurse Umane",
    "Promovare",
    "Educațional"
  ];
  const filteredTop2 = departments.filter(dep => dep !== formData.top1);
  const filteredTop3 = departments.filter(dep => dep !== formData.top1 && dep !== formData.top2);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      const docRef = doc(db, "applications", user.uid);
      const existingSnap = await getDoc(docRef);

      if (!existingSnap.exists()) {
        await setDoc(docRef, {
          ...formData,
          userId: user.uid,    
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: user.email,
          createdAt: new Date(),
        });
        setHasApplied(true);
        setExistingData(formData);
        navigate("/account");
      } else {
        alert("Ai trimis deja aplicația.");
      }
    }
  };

  useEffect(() => {
    const fetchApplication = async () => {
      if (user) {
        const docRef = doc(db, "applications", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setExistingData(docSnap.data());
        }
      }
    };
  
    fetchApplication();
  }, [user]);
  

  if(!user){
    return(
      <div style={{
        backgroundImage: `url('/poza_fundal_blur.JPEG')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        fontFamily: "Montserrat, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
  
      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.69)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: "16px",
        padding: "2rem 3rem",
        textAlign: "center",
        maxWidth: "600px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
      }}
      >

        <h2 style={{ color: "#b30000", fontWeight: "bold" }}>Trebuie să-ți creezi un cont înainte de a completa formularul.</h2>

      </div>
      </div>
    );
  }

  if(existingData && user !== null){
    return(
      <div style={{
        backgroundImage: `url('/poza_fundal_blur.JPEG')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        fontFamily: "Montserrat, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
  
      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.69)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: "16px",
        padding: "2rem 3rem",
        textAlign: "center",
        maxWidth: "600px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
      }}
      >
        <h2 style={{ color: "#b30000", fontWeight: "bold" }}>Deja ai completat formularul, poți merge la contul tău pentru a-ți vedea răspunsurile.</h2>

      </div> 
      </div>  
    );
  }

  return (
    <div style={{
      backgroundImage: `url('/poza_fundal_blur.JPEG')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      minHeight: "100vh",
      width: "100vw",
      paddingTop: "80px",
      fontFamily: "Montserrat, sans-serif",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
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
      <select rows={1} name="q1" 
      
      value={q1}
      onChange={(e) => {
        setVolunteerExperience(e.target.value);
        setFormData((prev) => ({ ...prev, q1: e.target.value }));
      }}
      required

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
      <textarea name="answer" onChange={handleChange} 
      required={q1 === "Da"}
      disabled={q1 === "Nu"}
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
      <select rows={1} name="top1" value={formData.top1} onChange={handleChange} required
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
        {departments.map(dep => (
            <option key={dep} value={dep}>{dep}</option>
          ))}

      </select>

      <select rows={1} name="top2" value={formData.top2} onChange={handleChange} required
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
        {filteredTop2.map(dep => (
            <option key={dep} value={dep}>{dep}</option>
          ))}

      </select>

      <select rows={1} name="top3" value={formData.top3} onChange={handleChange} required
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
        {filteredTop3.map(dep => (
            <option key={dep} value={dep}>{dep}</option>
          ))}

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
  );
};

export default Formular;
