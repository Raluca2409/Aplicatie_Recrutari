import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

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

  useEffect(() => {
    if (user) {
      setError("Ești deja logat. Dacă vrei, mergi la contul tău.");
    }
  }, [user]);

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

      navigate("/account");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email-ul este deja folosit. Poți merge la logare!");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div style={{
      paddingTop: "80px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "80vh"
    }}>
      <form onSubmit={handleRegister} style={{
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
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={user !== null}
          style={{
            ...inputStyle,
            borderColor: errors.password ? "red" : "#ccc"
          }}
        />

        <label style={{ color: errors.confirmPassword ? "red" : "#333" }}>
          Confirmă parola*
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={user !== null}
          style={{
            ...inputStyle,
            borderColor: errors.confirmPassword ? "red" : "#ccc"
          }}
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

        {error && (
          <p style={{ color: "#b30000", textAlign: "center", marginTop: "0.5rem" }}>
            {error}
          </p>
        )}
      </form>
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
