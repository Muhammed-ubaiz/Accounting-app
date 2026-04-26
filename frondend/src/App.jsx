import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./components/Dashboard";
import Charts from "./components/Charts";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import ProtectedRoute from "./components/ProtectedRoute";


function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDataChange = () => {
    setRefreshKey((current) => current + 1);
  };

  return (
    <div className="app-shell">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <Dashboard refreshKey={refreshKey} />
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <TransactionForm onTransactionAdded={handleDataChange} />
          <Charts refreshKey={refreshKey} />
        </div>
        <TransactionList onTransactionChange={handleDataChange} refreshKey={refreshKey} />
      </div>
    </div>
  );
}


function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );

}


export default App;
