import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import PrivateRoute from "./components/PrivateRoute";
import Admin from "./pages/Admin";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";



function App() {  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={ <AdminRoute> <Admin /> </AdminRoute> } />
        <Route path="/account" element={ <PrivateRoute> <Account /> </PrivateRoute> } />
      </Routes>
    </Router>
  );
}

export default App;

