import React, { useState, useEffect,useMemo } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoutes";
import routes from "./routes/routes";
import "./components/sidebar/sidebar.css";
import "./components/components.css";
import { LanguageProvider } from "./components/LanguageContext";
// 🧩 Import Material UI Theme
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// 🎨 Import your two theme definitions
import { themeA, themeB, themeC, themeD, themeMap } from './theme';
const App = () => {
  // 1. Existing Login Logic
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem("loggedIn") === "true";
  });

  const handleLogin = () => {
    setLoggedIn(true);
    localStorage.setItem("loggedIn", "true");
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("loggedIn");
  };

  const [currentTheme, setCurrentTheme] = useState(() => {
    // Initialize theme state from localStorage, allowing four possible values
    return localStorage.getItem("appTheme") || "A";
  });

  const setTheme = (themeId) => {
    setCurrentTheme(themeId);
    localStorage.setItem("appTheme", themeId);
  };
  const toggleTheme = () => {
    // This maintains the A <-> B functionality for the dedicated toggle button
    const newTheme = currentTheme === "A" ? "B" : "A";
    setTheme(newTheme); 
  };
  
 const appliedTheme = useMemo(() => {
      // Use the map to get the correct theme object, defaulting to themeA
      return themeMap[currentTheme] || themeA;
  }, [currentTheme]);
 
 // App.js

useEffect(() => {
    // 1. Clean up old classes (using lowercase to be safe)
    document.body.classList.remove('theme-a', 'theme-b', 'theme-c', 'theme-d');
    
    // 2. ✅ FIX: Convert currentTheme to lowercase before adding the class
    document.body.classList.add(`theme-${currentTheme.toLowerCase()}`);
    
    // Ensure local storage is set 
    localStorage.setItem("appTheme", currentTheme);
}, [currentTheme]);

  return (
    <LanguageProvider>
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline />
      <div className="App">
        <BrowserRouter basename="/">
          <Routes>
            {/* Existing Root Path Logic: Redirects to dashboard if logged in */}
            <Route
              path="/"
              element={
                loggedIn ? (
                  <Navigate to="/console/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            
            {/* Existing Login Route */}
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            
            {/* Protected Routes */}
            <Route
              element={
                // 4. Pass Theme props to ProtectedRoute
                <ProtectedRoute 
                 loggedIn={loggedIn} 
                  onLogout={handleLogout} 
                  currentTheme={currentTheme} 
                  toggleTheme={toggleTheme}   
                  setTheme={setTheme} 
                  
                />
              }
            >
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;