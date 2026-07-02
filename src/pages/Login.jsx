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

  const isFormValid = !loading && emailRegex.test(email) && password.length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col w-5/12 gap-4">
        <div className="faan-logo">
          <img src="/assets/FAAN_logo-removebg-preview.png" alt="FAAN" />
        </div>
        <h2>Staff Login</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                className="input"
                type="email"
                placeholder="Enter your email address"
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
            <LoadingButton type="submit" isLoading={loading} disabled={!isFormValid} className="w-full">
              Login
            </LoadingButton>
          </div>
        </form>
        <div style={{ marginTop: 12, textAlign: "center" }}>
          <Link to="/signup" className="underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
