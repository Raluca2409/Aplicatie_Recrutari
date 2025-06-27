import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import PasswordInput from "../components/PasswordInput";

const Register = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(""); 
  const [lastName, setLastName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = true;
    if (!lastName.trim()) newErrors.lastName = true;
    if (!email.trim()) newErrors.email = true;
    if (!password) newErrors.password = true;
    if (!confirmPassword) newErrors.confirmPassword = true;
    if (password !== confirmPassword) {
      newErrors.confirmPassword = true;
      setError("Parolele nu se potrivesc!");
    }
    if (password.length < 6) {
      setError("Parola trebuie să aibă cel puțin 6 caractere.");
      return;
    }
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>_]/;
    if (!specialCharRegex.test(password)) {
      setError("Parola trebuie să conțină cel puțin un caracter special.");
      return;
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        firstName,
        lastName,
        createdAt: new Date()
      });

      navigate("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email-ul este deja folosit. Poți merge la logare!");
      } else {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  if(user){
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
        position: "relative",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
      }}>

      <div
      style={{
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
      <h2 style={{ color: "#b30000", marginBottom: "1rem" }}>Ești deja logat. Dacă vrei, mergi la contul tău.</h2>
      </div>  
      </div>

    );
  }

  return (

    <div
    style={{
      backgroundImage: `url('/poza_fundal_blur.JPEG')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    fontFamily: "Montserrat, sans-serif",
    position: "relative",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    }}
  >

      <form onSubmit={handleRegister} noValidate style={{
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "100%",
        maxWidth: "400px"
      }}>
        <h2 style={{ textAlign: "center", color: "#b30000" }}>Creează un cont</h2>

        <label style={{ color: errors.lastName ? "red" : "#333" }}>
          Nume*
        </label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={user !== null}
          style={{
            ...inputStyle,
            borderColor: errors.lastName ? "red" : "#ccc"
          }}
        />

        <label style={{ color: errors.firstName ? "red" : "#333" }}>
          Prenume*
        </label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={user !== null}
          style={{
            ...inputStyle,
            borderColor: errors.firstName ? "red" : "#ccc"
          }}
        />

        <label style={{ color: errors.email ? "red" : "#333" }}>
          Email*
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={user !== null}
          style={{
            ...inputStyle,
            borderColor: errors.email ? "red" : "#ccc"
          }}
        />

        <label style={{ color: errors.password ? "red" : "#333" }}>
          Parolă*
        </label>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
        />

        <label style={{ color: errors.confirmPassword ? "red" : "#333" }}>
          Confirmă parola*
        </label>
        <PasswordInput
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          name="confirmPassword"
        />

        <button
          type="submit"
          style={{
            fontFamily: "inherit",
            fontSize: "17px",
            padding: "0.8rem",
            backgroundColor: "#b30000",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
          disabled={user !== null}
        >
          Înregistrează-te
        </button>

      </form>

      {error && (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(255, 255, 255, 0.64)",
          color: "#b30000",
          padding: "3rem 3rem",
          borderRadius: "16px",
          fontSize: "1.2rem",
          fontWeight: "600",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
          backdropFilter: "blur(4px)",
          zIndex: 9999,
          textAlign: "center",
          maxWidth: "80%",
        }}>
    {error}
  </div>
)}

    </div>
  );
};

const inputStyle = {
  padding: "0.8rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "1rem"
};

export default Register;
