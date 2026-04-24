import { useEffect, useState } from "react";
import CategoryForm from "./CategoryForm";
import API from "../services/api";
import { showError, showSuccess } from "../utils/alerts";

function TransactionForm({ onTransactionAdded }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    date: "",
    description: "",
    category_id: ""
  });

  const fetchCategories = async () => {
    try {
      const response = await API.get("/categories/");
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    try {
      await API.post("/transactions/", form);
      setForm({
        amount: "",
        type: "expense",
        date: "",
        description: "",
        category_id: ""
      });
      onTransactionAdded?.();
      await showSuccess("Transaction added", "Your transaction was saved.");
    } catch (error) {
      console.error(error);
      await showError("Transaction failed", "Unable to save transaction.");
    }
  };

  return (
    <section className="fade-rise glass-card rounded-[2rem] p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
            Input
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Add transaction
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          Keep entries quick, clear, and easy to scan.
        </p>
      </div>

      <div className="mt-6 grid gap-6">
        <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4 sm:p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="Amount"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-white outline-none transition focus:border-amber-300/50"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
            />

            <select
              className="w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-white outline-none transition focus:border-amber-300/50"
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <input
              type="date"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-white outline-none transition focus:border-amber-300/50"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />

            <select
              className="w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-white outline-none transition focus:border-amber-300/50"
              value={form.category_id}
              onChange={(e) =>
                setForm({ ...form, category_id: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <input
            placeholder="Description"
            className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-white outline-none transition focus:border-amber-300/50"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <button
            onClick={handleSubmit}
            className="mt-4 w-full rounded-2xl bg-amber-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-300 sm:w-auto"
          >
            Add Transaction
          </button>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4 sm:p-5">
          <div className="mb-4">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
              Categories
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              Keep transaction tags organized
            </p>
          </div>
          <CategoryForm refreshCategories={fetchCategories} />
        </div>
      </div>
    </section>
  );
}

export default TransactionForm;
