import { useEffect, useState } from "react";
import API from "../services/api";
import {
  showAmountPrompt,
  showConfirm,
  showError,
  showSuccess,
  showTransactionDetails
} from "../utils/alerts";

function TransactionList({ onTransactionChange }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchTransactions = async () => {
    try {
      const response = await API.get("/transactions/");
      setTransactions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await API.get("/categories/");
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const handleEdit = async (transaction) => {
    const result = await showAmountPrompt(transaction.amount);

    if (!result.isConfirmed) {
      return;
    }

    const newAmount = Number(result.value);

    try {
      await API.put(`/transactions/${transaction.id}`, {
        amount: newAmount,
        type: transaction.type,
        date: transaction.date,
        description: transaction.description,
        category_id: transaction.category_id
      });

      setTransactions((currentTransactions) =>
        currentTransactions.map((currentTransaction) =>
          currentTransaction.id === transaction.id
            ? {
                ...currentTransaction,
                amount: newAmount
              }
            : currentTransaction
        )
      );
      onTransactionChange?.();
      await showSuccess("Transaction updated", "Amount changed successfully.");
    } catch (error) {
      console.error(error);
      await showError("Update failed", "Unable to edit this transaction.");
    }
  };

  const handleDelete = async (transactionId) => {
    const result = await showConfirm(
      "Delete transaction?",
      "Delete this transaction permanently?"
    );

    if (!result.isConfirmed) {
      return;
    }

    try {
      await API.delete(`/transactions/${transactionId}`);
      setTransactions((currentTransactions) =>
        currentTransactions.filter(
          (currentTransaction) => currentTransaction.id !== transactionId
        )
      );
      onTransactionChange?.();
      await showSuccess("Transaction deleted", "The transaction was removed.");
    } catch (error) {
      console.error(error);
      await showError("Delete failed", "Unable to delete this transaction.");
    }
  };

  const handleView = async (transaction, categoryName) => {
    await showTransactionDetails({
      ...transaction,
      categoryName
    });
  };

  const filteredTransactions = transactions.filter((transaction) =>
    selectedCategory === ""
      ? true
      : Number(selectedCategory) === transaction.category_id
  );

  const sortedTransactions = [...filteredTransactions].sort(
    (firstTransaction, secondTransaction) =>
      new Date(secondTransaction.date) - new Date(firstTransaction.date)
  );

  return (
    <section className="fade-rise glass-card rounded-[2rem] p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
            Activity
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Transaction list
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            View all transactions in one place and filter only when needed.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <select
            className="w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-white outline-none transition focus:border-teal-300/50 sm:w-72"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setSelectedCategory("")}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-teal-300/30 hover:bg-teal-400/10"
          >
            View All
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Total shown
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {sortedTransactions.length}
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current filter
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            {selectedCategory === ""
              ? "All transactions"
              : categories.find((cat) => cat.id === Number(selectedCategory))
                  ?.name || "Filtered"}
          </p>
        </div>
      </div>

      <div className="mt-6 hidden overflow-hidden rounded-[1.5rem] border border-white/10 lg:block">
        <table className="min-w-full border-collapse overflow-hidden">
          <thead className="bg-white/5 text-left text-sm uppercase tracking-[0.2em] text-slate-400">
            <tr>
              <th className="px-4 py-4">Amount</th>
              <th className="px-4 py-4">Type</th>
              <th className="px-4 py-4">Date</th>
              <th className="px-4 py-4">Description</th>
              <th className="px-4 py-4">Category</th>
              <th className="px-4 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction) => {
              const categoryName =
                categories.find((cat) => cat.id === transaction.category_id)
                  ?.name || "Unknown";

              return (
                <tr
                  key={transaction.id}
                  className="border-t border-white/8 bg-slate-950/30 text-slate-200"
                >
                  <td className="px-4 py-4 font-semibold">
                    {transaction.amount}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                        transaction.type === "income"
                          ? "bg-teal-400/10 text-teal-200"
                          : "bg-rose-400/10 text-rose-200"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-4 py-4">{transaction.date}</td>
                  <td className="px-4 py-4">{transaction.description}</td>
                  <td className="px-4 py-4 text-slate-300">{categoryName}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(transaction, categoryName)}
                        className="rounded-xl bg-teal-400/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-teal-200 transition hover:bg-teal-400/25"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="rounded-xl bg-amber-400/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 transition hover:bg-amber-400/25"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="rounded-xl bg-rose-400/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-200 transition hover:bg-rose-400/25"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-4 lg:hidden">
        {sortedTransactions.map((transaction) => {
          const categoryName =
            categories.find((cat) => cat.id === transaction.category_id)?.name ||
            "Unknown";

          return (
            <article
              key={transaction.id}
              className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-white">
                    {transaction.amount}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {transaction.description}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                    transaction.type === "income"
                      ? "bg-teal-400/10 text-teal-200"
                      : "bg-rose-400/10 text-rose-200"
                  }`}
                >
                  {transaction.type}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
                <div className="rounded-2xl bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Date
                  </p>
                  <p className="mt-2">{transaction.date}</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Category
                  </p>
                  <p className="mt-2">{categoryName}</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleView(transaction, categoryName)}
                  className="flex-1 rounded-2xl bg-teal-400/15 px-4 py-3 text-sm font-semibold text-teal-200 transition hover:bg-teal-400/25"
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(transaction)}
                  className="flex-1 rounded-2xl bg-amber-400/15 px-4 py-3 text-sm font-semibold text-amber-200 transition hover:bg-amber-400/25"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="flex-1 rounded-2xl bg-rose-400/15 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-400/25"
                >
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {sortedTransactions.length === 0 ? (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-white/10 bg-slate-950/25 p-6 text-center text-slate-400">
          No transactions found for this filter.
        </div>
      ) : null}
    </section>
  );
}

export default TransactionList;
