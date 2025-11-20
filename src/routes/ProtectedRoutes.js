// src/components/ProtectedRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import SideBar from "../components/sidebar/SideBar";

const ProtectedRoute = ({ loggedIn, onLogout, currentTheme, toggleTheme,setTheme })=>{
  return loggedIn ? (
    <>
      <SideBar 
    onLogout={onLogout} 
    currentTheme={currentTheme} // Pass state
    toggleTheme={toggleTheme}   // Pass function
   setTheme={setTheme}
/>
      <div className="main-content">
        <div className="main">
          <Outlet />
        </div>
      </div>
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
