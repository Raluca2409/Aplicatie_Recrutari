import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Admin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const data = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(user => user.application); 

      setUsers(data);
    };

    fetchApplications();
  }, []);

  return (
    <div>
      <h2>Aplicații primite</h2>
      {users.map(user => (
        <div key={user.id} style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "10px" }}>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Trimis la:</strong> {user.application?.submittedAt?.toDate().toLocaleString()}</p>
          <p><strong>Răspunsuri:</strong></p>
          <ul>
            <li><strong>Întrebare 1:</strong> {user.application.q1}</li>
            <li><strong>Întrebare 2:</strong> {user.application.q2}</li>
            <li><strong>Top 3 Departamente:</strong> {user.application.topDepartments?.join(", ")}</li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Admin;
