import { useState } from "react";
import { Lock, Mail, AlertCircle, Sparkles, Database } from "lucide-react";
import "./Login.css";

interface LoginProps {
  onLogin: (email: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@tendrils\.io$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validate email domain
    if (!validateEmail(email)) {
      setError("Please use a valid @tendrils.io email address");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      // For now, accept any @tendrils.io email with password length >= 6
      // Later, you can integrate with your actual authentication API
      setIsLoading(false);
      onLogin(email);
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="sparkle-wrapper">
          <Sparkles className="sparkle sparkle-1" />
          <Sparkles className="sparkle sparkle-2" />
          <Sparkles className="sparkle sparkle-3" />
        </div>
      </div>

      <div className="login-card gradient-border-wrapper">
        <div className="card-inner glass-effect">
          {/* Header */}
          <div className="login-header">
            <div className="login-icon-wrapper">
              <Database className="login-icon" />
              <div className="icon-pulse"></div>
            </div>
            <h1 className="login-title">Product Dashboard</h1>
            <p className="login-subtitle">Sign in to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail size={16} />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@tendrils.io"
                className="form-input"
                required
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <Lock size={16} />
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-input"
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-banner">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}