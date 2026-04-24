import { useEffect, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import API from "../services/api";

const COLORS = ["#2dd4bf", "#fb7185"];

function Charts({ refreshKey = 0 }) {
  const [data, setData] = useState([
    { name: "Income", value: 0 },
    { name: "Expense", value: 0 }
  ]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await API.get("/transactions/summary");
        setData([
          { name: "Income", value: response.data.income },
          { name: "Expense", value: response.data.expense }
        ]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSummary();
  }, [refreshKey]);

  return (
    <section className="fade-rise glass-card rounded-[2rem] p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
            Breakdown
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Income vs expense
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          Quick visual balance check for the current data.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="h-72 w-full rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={55}
                outerRadius={92}
                paddingAngle={4}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-4 self-center">
          {data.map((item, index) => (
            <div
              key={item.name}
              className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                  {item.name}
                </p>
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Charts;
