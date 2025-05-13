import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const PrivateRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Se încarcă...</p>;
  if (!user) return <Navigate to="/" />; // dacă nu e logat, redirect

  return children;
};

export default PrivateRoute;
