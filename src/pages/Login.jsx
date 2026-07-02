import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../api";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const doLogin = async () => {
    if (!email || !password) {
      toast.warn("Please enter email and password");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.warn("Please enter a valid email address");
      return;
    }
    setLoading(true);
    const r = await post("/auth/login", { email, password });
    setLoading(false);
    if (!r.ok) return;
    const staff = r.data?.staff;
    const token = r.data?.token;
    if (token) localStorage.setItem("token", token);
    if (staff) localStorage.setItem("staff", JSON.stringify(staff));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col w-5/12 gap-4">
        <div className="faan-logo">
          <img src="/dist/assets/FAAN_logo-removebg-preview.png" alt="FAAN" />
        </div>
        <h2>Staff Login</h2>
        <div className="flex flex-col gap-1">
          <label>Email</label>
          <input
            className="input"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label>Password</label>
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className={`btn ${loading ? "opacity-40" : "opacity-100"}`}
          onClick={doLogin}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner size={14} />{" "}
              <span style={{ marginLeft: 8 }}>Logging in...</span>
            </>
          ) : (
            "Login"
          )}
        </button>
        <div style={{ marginTop: 12, textAlign: "center" }}>
          <a href="/signup" className="underline">
            Create account
          </a>
        </div>
      </div>
    </div>
  );
}
