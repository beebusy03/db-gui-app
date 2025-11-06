import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import { LoginPage, DashboardPage, ProtectedRoute } from "./App";
import "./index.css"; 

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/db-gui-app">
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Protected Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);