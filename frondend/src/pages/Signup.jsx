import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { showError, showSuccess } from "../utils/alerts";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");

  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event?.preventDefault();

    if (!email || !password) {
      setStatus("error");
      setMessage("Enter an email and password to continue.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await API.post("/auth/signup", {
        email,
        password
      });

      setStatus("success");
      setMessage("Account created successfully. Redirecting to login...");
      await showSuccess("Signup successful", "Your account is ready.");
      navigate("/");
    } catch (error) {
      const message = error.response?.data?.detail || "Signup failed";
      setStatus("error");
      setMessage(message);
      await showError("Signup failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell soft-grid">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="fade-rise order-2 glass-card rounded-[2rem] p-5 sm:p-8 lg:order-1">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
                Start fresh
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Signup</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Create your account and start organizing money flow with a clean
                dashboard built for everyday tracking.
              </p>

              <form
                id="signup-form"
                className="mt-8 space-y-5"
                onSubmit={handleSignup}
              >
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    Email
                  </span>
                  <input
                    placeholder="Enter your email"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-teal-300/60 focus:bg-slate-900"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    Password
                  </span>
                  <input
                    type="password"
                    placeholder="Choose a password"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-teal-300/60 focus:bg-slate-900"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
              </form>

              {message ? (
                <div
                  className={`mt-5 rounded-2xl px-4 py-3 text-sm ${
                    status === "success"
                      ? "border border-teal-400/20 bg-teal-400/10 text-teal-200"
                      : "border border-rose-400/20 bg-rose-400/10 text-rose-200"
                  }`}
                >
                  {message}
                </div>
              ) : null}

              <button
                onClick={handleSignup}
                type="submit"
                form="signup-form"
                disabled={loading}
                className="mt-6 w-full rounded-2xl bg-teal-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Signup"}
              </button>

              <div className="mt-6 flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                <span>Already have an account?</span>
                <Link
                  to="/"
                  className="font-semibold text-amber-300 transition hover:text-amber-200"
                >
                  Back to login
                </Link>
              </div>
            </div>
          </section>

          <section className="fade-rise order-1 flex flex-col justify-center rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8 lg:order-2 lg:p-10">
            <div className="mb-6 inline-flex w-fit items-center gap-3 rounded-full border border-teal-400/20 bg-teal-300/10 px-4 py-2 text-sm font-medium text-teal-200">
              <span className="h-2.5 w-2.5 rounded-full bg-teal-300" />
              New account setup
            </div>

            <h1 className="max-w-xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Build a cleaner routine for income, expenses, and categories.
            </h1>

            <div className="mt-8 space-y-4 text-slate-300">
              <div className="glass-card rounded-3xl p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                  01
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Create your account in seconds
                </p>
              </div>

              <div className="glass-card rounded-3xl p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                  02
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Land inside a dashboard that already feels organized
                </p>
              </div>

              <div className="glass-card rounded-3xl p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                  03
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Review balances and categories on any screen size
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Signup;
