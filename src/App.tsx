import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import ProductDashboard from "./components/ProductDashboard";

// Redirect component for handling 404s
const RedirectHandler = () => {
  const location = useLocation();
  
  useEffect(() => {
    // If we get here, it means no route matched
    console.log('No route found for:', location.pathname);
  }, [location]);

  return <ProductDashboard />;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/db-gui-app">
      <Routes>
        <Route path="/" element={<ProductDashboard />} />
        <Route path="*" element={<RedirectHandler />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);