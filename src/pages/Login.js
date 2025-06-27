import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import PasswordInput from "../components/PasswordInput";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);


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

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Te rugăm să introduci adresa de email.");
      return;
    }
  
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      setError(""); 
    } catch (err) {
      setError("A apărut o eroare la trimiterea emailului de resetare.");
      console.error(err);
    }
  };
  

  return (

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

      <form onSubmit={handleLogin} style={{
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "100%",
        maxWidth: "450px"
      }}>
        <h2 style={{ textAlign: "center", color: "#b30000" }}>Conectare</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Parola"
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

        <p
          onClick={handlePasswordReset}
          style={{
            color: "#b30000",
            cursor: "pointer",
            textAlign: "center",
            marginTop: "1rem",
            textDecoration: "underline"
          }}
        >
          Ai uitat parola?
        </p>
        
        {resetEmailSent && (
          <p style={{ color: "green", textAlign: "center", marginTop: "0.5rem" }}>
            Emailul pentru resetarea parolei a fost trimis!
          </p>
        )}


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
