import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import ProductDashboard from "./components/ProductDashboard";
import Login from "./components/Login";

// Authentication Hook
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedEmail = localStorage.getItem("userEmail");
    
    if (storedAuth === "true" && storedEmail && validateEmail(storedEmail)) {
      setIsAuthenticated(true);
      setUserEmail(storedEmail);
    }
    setIsLoading(false);
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@tendrils\.io$/;
    return emailRegex.test(email);
  };

  const login = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("isAuthenticated", "true");
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail("");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAuthenticated");
  };

  return {
    isAuthenticated,
    userEmail,
    isLoading,
    login,
    logout,
  };
};

// Protected Route Wrapper
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '1.2rem',
        fontWeight: '500',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTopColor: 'white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}></div>
          Loading...
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

// Login Page Wrapper
export const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (email: string) => {
    login(email);
    navigate("/dashboard", { replace: true });
  };

  return <Login onLogin={handleLogin} />;
};

// Dashboard Page Wrapper
export const DashboardPage = () => {
  const { userEmail, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return <ProductDashboard userEmail={userEmail} onLogout={handleLogout} />;
};