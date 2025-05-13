import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";

const AdminRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkRecruiter = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().isRecruiter) {
        setIsRecruiter(true);
      }

      setChecking(false);
    };

    checkRecruiter();
  }, [user]);

  if (loading || checking) return <p>Se verifică accesul...</p>;
  if (!user || !isRecruiter) return <Navigate to="/" />;

  return children;
};

export default AdminRoute;
