import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
        setError("Email-ul sau parola nu sunt introduse corect.");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "80vh"
    }}>
      <form onSubmit={handleLogin} style={{
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
        <h2 style={{ textAlign: "center", color: "#b30000" }}>Logare</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Parolă"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
          
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
        >
          Conectează-te
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

export default Login;
