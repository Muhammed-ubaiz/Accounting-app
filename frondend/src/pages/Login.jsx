import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { showError, showSuccess } from "../utils/alerts";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event?.preventDefault();

    if (!email || !password) {
      setErrorMessage("Enter your email and password.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await API.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", response.data.access_token);
      await showSuccess("Login successful", "Welcome back.");
      navigate("/home");
    } catch (error) {
      const message = error.response?.data?.detail || "Login failed";
      setErrorMessage(message);
      await showError("Login failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell soft-grid">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="fade-rise flex flex-col justify-center rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8 lg:p-10">
            <div className="mb-6 inline-flex w-fit items-center gap-3 rounded-full border border-amber-400/20 bg-amber-300/10 px-4 py-2 text-sm font-medium text-amber-200">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              Finance cockpit
            </div>

            <h1 className="max-w-xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Track money with a dashboard that feels sharp and calm.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Keep income, expenses, and categories in one clean space built
              for quick decisions. Sign in to continue where you left off.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="glass-card float-gentle rounded-3xl p-4">
                <p className="text-sm text-slate-400">Live balance</p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  Clear totals
                </p>
              </div>

              <div className="glass-card rounded-3xl p-4 sm:translate-y-8">
                <p className="text-sm text-slate-400">Fast input</p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  Fewer clicks
                </p>
              </div>

              <div className="glass-card float-gentle rounded-3xl p-4">
                <p className="text-sm text-slate-400">Smarter view</p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  Better focus
                </p>
              </div>
            </div>
          </section>

          <section className="fade-rise glass-card rounded-[2rem] p-5 sm:p-8">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-teal-300">
                Welcome back
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Login</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Use your account to open the accounting workspace and continue
                managing transactions.
              </p>

              <form
                id="login-form"
                className="mt-8 space-y-5"
                onSubmit={handleLogin}
              >
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    Email
                  </span>
                  <input
                    placeholder="Enter your email"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-amber-300/60 focus:bg-slate-900"
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
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-amber-300/60 focus:bg-slate-900"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
              </form>

              {errorMessage ? (
                <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                  {errorMessage}
                </div>
              ) : null}

              <button
                onClick={handleLogin}
                type="submit"
                form="login-form"
                disabled={loading}
                className="mt-6 w-full rounded-2xl bg-amber-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Login"}
              </button>

              <div className="mt-6 flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                <span>New here? Create your workspace account.</span>
                <Link
                  to="/signup"
                  className="font-semibold text-teal-300 transition hover:text-teal-200"
                >
                  Go to signup
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Login;
