import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/auth.css";
import { API_BASE_URL } from "../utils/api";

const getLoginError = (requestError) => {
  const responseData = requestError.response?.data;
  if (typeof responseData === "string" && responseData.trim()) {
    if (responseData.includes("secretOrPrivateKey must have a value")) {
      return "Backend JWT secret is missing. Please add JWT_SECRET in the backend .env file and restart the server.";
    }
    if (responseData.trim().startsWith("<!DOCTYPE") || responseData.includes("<html")) {
      return `Login failed (${requestError.response?.status || "server error"}). Please check the backend server logs.`;
    }
    return responseData;
  }
  if (responseData?.message) return responseData.message;
  if (responseData?.error) {
    return typeof responseData.error === "string"
      ? responseData.error
      : JSON.stringify(responseData.error);
  }
  if (requestError.response?.status) {
    return `Login failed (${requestError.response.status}). Please check the backend response.`;
  }
  return requestError.message || "Login failed. Please check your email and password.";
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(false);
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const loginData = {
      email: formData.get("email")?.trim(),
      password: formData.get("password"),
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/login/login`,
        loginData,
        { headers: { "Content-Type": "application/json" } },
      );
      const token = response.data?.token || response.data?.data?.token;
      if (!token) {
        throw new Error("Login succeeded but the backend did not return an auth token.");
      }
      const user = response.data?.user || loginData;
      localStorage.setItem("token", token.trim());
      localStorage.setItem("shopco_user", JSON.stringify(user));
      window.dispatchEvent(new Event("shopco-auth-changed"));
      navigate("/");
      setSubmitted(true);
      setError(response.data?.message || "");
    } catch (requestError) {
      console.error("Login request failed", {
        status: requestError.response?.status,
        response: requestError.response?.data,
      });
      setError(getLoginError(requestError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <p className="auth-eyebrow">Welcome back</p>
        <h1 id="login-title">Log in to SHOP.CO</h1>
        <p className="auth-description">Enter your details to continue shopping.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email address</label>
          <input id="login-email" name="email" type="email" placeholder="you@example.com" required />

          <div className="auth-label-row">
            <label htmlFor="login-password">Password</label>
            <button type="button" className="auth-text-button">Forgot password?</button>
          </div>
          <input id="login-password" name="password" type="password" placeholder="Enter your password" required />

          <button className="auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log in"}
          </button>
          {submitted && <p className="auth-success" role="status">You are ready to log in.</p>}
          {error && <p className={submitted ? "auth-success" : "auth-error"} role="alert">{error}</p>}
        </form>

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/signup">Create one</Link>
        </p>
      </section>
    </main>
  );
};

export default LoginPage;
