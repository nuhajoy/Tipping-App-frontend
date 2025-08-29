"use client";

import { useAdminStore } from "@/store/adminStore";
import { Card } from "@/components/ui/card";

const useTransactionLogic = () => {
  const { providers, expandedRow, setExpandedRow } = useAdminStore();

  const stats = [
    { title: "Total Transactions", value: "16,500 ETB" },
    { title: "Top Performer", value: "1,200 ETB" },
    { title: "Most Active Provider", value: "950 ETB" },
  ];

  const transactions = [
    { id: 1, title: "Tip to Abebe", amount: "+250 ETB", date: "Aug 28, 2025" },
    { id: 2, title: "Tip to Kebede", amount: "+500 ETB", date: "Aug 27, 2025" },
    { id: 3, title: "Tip to Selam", amount: "+150 ETB", date: "Aug 26, 2025" },
    { id: 4, title: "Tip to Abeba", amount: "+1,000 ETB", date: "Aug 25, 2025" },
  ];

  const toggleExpandedRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return { stats, transactions, providers, expandedRow, toggleExpandedRow };
};

const StatCard = ({ title, value }) => (
  <Card className="p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </Card>
);

export default function TransactionsSection() {
  const { stats, transactions, providers, expandedRow, toggleExpandedRow } =
    useTransactionLogic();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} />
        ))}
      </div>

      <Card className="p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions Log</h3>
        <ul className="divide-y divide-border">
          {transactions.map((transaction) => (
            <li
              key={transaction.id}
              className="py-3 px-2 rounded-lg transition-all duration-300 hover:bg-muted/50 cursor-pointer"
              onClick={() => toggleExpandedRow(transaction.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium block">{transaction.title}</span>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
                <span
                  className={`font-semibold ${
                    transaction.amount.includes("-") ? "text-destructive" : "text-accent"
                  }`}
                >
                  {transaction.amount}
                </span>
              </div>

              {expandedRow === transaction.id && (
                <div className="mt-3 p-3 bg-card rounded-lg text-sm space-y-1 border">
                  <p>
                    <strong>Provider Name:</strong>{" "}
                    {providers[0]?.businessName || "Sample Provider"}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {providers[0]?.businessEmail || "provider@example.com"}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {providers[0]?.businessPhone || "+251 900 000000"}
                  </p>
                  <p>
                    <strong>City:</strong> {providers[0]?.city || "Addis Ababa"}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
