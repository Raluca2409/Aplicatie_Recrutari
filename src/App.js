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
import Form from "./pages/Form";
import AboutUs from "./pages/AboutUs";



function App() {  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={ <AdminRoute> <Admin /> </AdminRoute> } />
        <Route path="/account" element={<Account />} />
        <Route path="/form" element={<Form />}/>
        <Route path="/aboutus" element={<AboutUs />}/>
      </Routes>
    </Router>
  );
}

export default App;

