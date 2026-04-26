import Swal from "sweetalert2";

export const showSuccess = (title, text) =>
  Swal.fire({
    icon: "success",
    title,
    text,
    background: "#0f172a",
    color: "#eff6ff",
    confirmButtonColor: "#f59e0b"
  });

export const showError = (title, text) =>
  Swal.fire({
    icon: "error",
    title,
    text,
    background: "#0f172a",
    color: "#eff6ff",
    confirmButtonColor: "#fb7185"
  });

export const showConfirm = (title, text, confirmButtonText = "Yes, delete") =>
  Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: "Cancel",
    background: "#0f172a",
    color: "#eff6ff",
    confirmButtonColor: "#f59e0b",
    cancelButtonColor: "#334155"
  });

export const showAmountPrompt = (value) =>
  Swal.fire({
    title: "Edit amount",
    input: "number",
    inputValue: value,
    inputLabel: "New amount",
    inputAttributes: {
      min: "0",
      step: "0.01"
    },
    showCancelButton: true,
    confirmButtonText: "Update",
    cancelButtonText: "Cancel",
    background: "#0f172a",
    color: "#eff6ff",
    confirmButtonColor: "#f59e0b",
    cancelButtonColor: "#334155",
    inputValidator: (inputValue) => {
      if (!inputValue) {
        return "Please enter an amount";
      }

      if (Number(inputValue) <= 0) {
        return "Amount must be greater than zero";
      }

      return undefined;
    }
  });

export const showTransactionDetails = (transaction) =>
  Swal.fire({
    title: "Transaction details",
    html: `
      <div style="text-align:left; display:grid; gap:12px;">
        <div><strong>Amount:</strong> ${transaction.amount}</div>
        <div><strong>Type:</strong> ${transaction.type}</div>
        <div><strong>Date:</strong> ${transaction.date}</div>
        <div><strong>Category:</strong> ${transaction.categoryName}</div>
        <div><strong>Description:</strong> ${transaction.description || "-"}</div>
      </div>
    `,
    confirmButtonText: "Close",
    background: "#0f172a",
    color: "#eff6ff",
    confirmButtonColor: "#2dd4bf"
  });
