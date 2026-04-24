import { useEffect, useState } from "react";
import API from "../services/api";

const cards = [
  {
    key: "income",
    label: "Income",
    accent: "text-teal-300",
    ring: "from-teal-400/20 to-transparent"
  },
  {
    key: "expense",
    label: "Expense",
    accent: "text-rose-300",
    ring: "from-rose-400/20 to-transparent"
  },
  {
    key: "balance",
    label: "Balance",
    accent: "text-amber-300",
    ring: "from-amber-400/20 to-transparent"
  }
];

function Dashboard({ refreshKey = 0 }) {
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await API.get("/transactions/summary");
        setSummary(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSummary();
  }, [refreshKey]);

  return (
    <section className="fade-rise glass-card overflow-hidden rounded-[2rem]">
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
        <div>
          <div className="inline-flex items-center gap-3 rounded-full border border-amber-400/20 bg-amber-300/10 px-4 py-2 text-sm font-medium text-amber-200">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            Personal finance overview
          </div>

          <h1 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">
            Stay on top of money without losing the bigger picture.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Watch your balance, add transactions fast, and keep categories tidy
            in one space that stays readable on mobile and desktop.
          </p>
        </div>

        <div className="flex flex-col justify-between gap-4 rounded-[1.75rem] border border-white/10 bg-slate-950/35 p-5">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
              Session
            </p>
            <p className="mt-3 text-2xl font-semibold text-white">
              Accounting workspace
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Everything important is visible at a glance.
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-rose-300/30 hover:bg-rose-400/10"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid gap-4 px-5 pb-5 sm:grid-cols-2 sm:px-6 sm:pb-6 lg:grid-cols-3 lg:px-8 lg:pb-8">
        {cards.map((card) => (
          <div
            key={card.key}
            className={`relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-5`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.ring} opacity-80`}
            />
            <div className="relative">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                {card.label}
              </p>
              <p className={`mt-4 text-3xl font-semibold ${card.accent}`}>
                {summary[card.key] ?? 0}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Dashboard;
