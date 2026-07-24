import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../api";
import PasswordInput from "../components/PasswordInput";
import LoadingButton from "../components/LoadingButton";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function validate(values) {
    const nextErrors = {};
    if (!values.email) nextErrors.email = "Enter your email address.";
    else if (!emailRegex.test(values.email)) nextErrors.email = "Enter a valid email address.";
    if (!values.password) nextErrors.password = "Enter your password.";
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate({ email, password });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    const r = await post("/auth/login", { email, password });
    setLoading(false);
    if (!r.ok) {
      setErrors({ form: r.data?.message || "Login failed. Please try again." });
      return;
    }
    const staff = r.data?.staff;
    const token = r.data?.token;
    if (token) localStorage.setItem("token", token);
    if (staff) localStorage.setItem("staff", JSON.stringify(staff));
    navigate("/dashboard");
  }

  function handleFieldChange(field, value) {
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
  }

  return (
    <main className="auth-page">
      <section className="auth-aside"><div className="auth-aside__content"><p className="eyebrow">Federal Airports Authority of Nigeria</p><h1>Reserved for decisions that move aviation forward.</h1><p>The Managing Director’s Office boardroom scheduling environment.</p><div className="auth-aside__line" /><span>Secure staff access · Official use only</span></div></section>
      <section className="auth-panel"><div className="auth-card">
        <img className="auth-logo" src="/assets/FAAN_logo-removebg-preview.png" alt="FAAN" />
        <p className="eyebrow">Boardroom Booking</p><h2>Welcome back</h2><p className="auth-card__intro">Sign in to manage your meeting requests.</p>
        <form onSubmit={handleSubmit} noValidate className="auth-form">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                className="input"
                type="email"
                placeholder="name@faan.gov.ng"
                value={email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                onBlur={() => setErrors((current) => ({ ...current, ...validate({ email, password }) }))}
                autoComplete="email"
                aria-describedby={errors.email ? "login-email-error" : undefined}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && (
                <p id="login-email-error" className="field-error" role="alert">
                  {errors.email}
                </p>
              )}
            </div>
            <PasswordInput
              id="login-password"
              label="Password"
              name="password"
              value={password}
              onChange={(e) => handleFieldChange("password", e.target.value)}
              onBlur={() => setErrors((current) => ({ ...current, ...validate({ email, password }) }))}
              placeholder="Password"
              error={errors.password}
              autoComplete="current-password"
            />
            {errors.form && (
              <p className="field-error" role="alert">
                {errors.form}
              </p>
            )}
            <LoadingButton type="submit" isLoading={loading} className="primary-button auth-submit">
              Sign in securely
            </LoadingButton>
          </div>
        </form>
        <div className="auth-switch">
          <Link to="/signup" className="underline">
            Need an account? <strong>Create one</strong>
          </Link>
        </div></div></section>
    </main>
  );
}
