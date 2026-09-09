import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/auth.css";
import { API_BASE_URL } from "../utils/api";

const SinupPage = () => {
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
    const signupData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/singup/singup`,
        signupData,
      );
      // Signup does not return a login token, so the user must log in next.
      navigate("/login");
      setSubmitted(true);
      setError(response.data?.message || "");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || 
        "Signup failed. Please try again.",
      );

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="signup-title">
        <p className="auth-eyebrow">Join the community</p>
        <h1 id="signup-title">Create your account</h1>
        <p className="auth-description">Sign up today and get 20% off your first order.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="signup-name">Full name</label>
          <input id="signup-name" name="name" type="text" placeholder="Your full name" required />

          <label htmlFor="signup-email">Email address</label>
          <input id="signup-email" name="email" type="email" placeholder="you@example.com" required />

          <label htmlFor="signup-password">Password</label>
          <input id="signup-password" name="password" type="password" placeholder="Create a password" minLength="6" required />

          <button className="auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </button>
          {submitted && <p className="auth-success" role="status">Your account is ready to be created.</p>}
          {error && <p className={submitted ? "auth-success" : "auth-error"} role="alert">{error}</p>}
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
};

export default SinupPage;
