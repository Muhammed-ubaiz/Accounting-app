import { useState } from "react";
import API from "../services/api";
import { showError, showSuccess } from "../utils/alerts";

function CategoryForm({ refreshCategories }) {
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    if (!name) {
      return;
    }

    try {
      await API.post("/categories/", {
        name
      });

      setName("");
      refreshCategories();
      await showSuccess("Category added", "New category created successfully.");
    } catch (error) {
      console.error(error);
      await showError("Category failed", "Unable to create category.");
    }
  };

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
      <input
        placeholder="New category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-white outline-none transition focus:border-teal-300/50"
      />

      <button
        onClick={handleSubmit}
        className="rounded-2xl bg-teal-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-teal-300"
      >
        Add Category
      </button>
    </div>
  );
}

export default CategoryForm;
