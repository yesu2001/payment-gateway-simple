"use client";

import React, { useState } from "react";
import { Transaction } from "@/types/payment";

export const TransactionHistory = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-6 text-center text-sm text-gray-400">
        No transactions yet
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* MOBILE VIEW: Card Stack (Visible on small screens, hidden on md+) */}
      <div className="md:hidden space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            onClick={() => setExpandedId(expandedId === tx.id ? null : tx.id)}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm active:bg-gray-50"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </p>
                <p className="font-medium text-gray-800">
                  {tx.cardType.toUpperCase()} •••• {tx.lastFour}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800">
                  {tx.currency === "INR" ? "₹" : "$"}
                  {tx.amount.toFixed(2)}
                </p>
                <span
                  className={`text-[10px] px-2 py-0.5 font-bold rounded-full inline-block ${
                    tx.status === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {tx.status}
                </span>
              </div>
            </div>
            {expandedId === tx.id && (
              <div className="mt-3 pt-3 border-t border-dashed border-gray-100 text-xs text-gray-600 space-y-1">
                <p>
                  <span className="font-semibold text-gray-700">ID:</span>{" "}
                  {tx.id}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Attempts:</span>{" "}
                  {tx.attemptsCount}
                </p>
                {tx.failureReason && (
                  <p className="text-red-500">{tx.failureReason}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* DESKTOP VIEW: Table (Hidden on mobile, visible on md+) */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <React.Fragment key={tx.id}>
                <tr
                  onClick={() =>
                    setExpandedId(expandedId === tx.id ? null : tx.id)
                  }
                  className="cursor-pointer hover:bg-gray-50/50 transition-colors"
                >
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-800">
                    {tx.cardType.toUpperCase()} •••• {tx.lastFour}
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-800">
                    {tx.currency === "INR" ? "₹" : "$"}
                    {tx.amount.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded-full ${tx.status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
                {expandedId === tx.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={4} className="px-4 py-4 text-sm text-gray-600">
                      <p>
                        ID: {tx.id} | Attempts: {tx.attemptsCount}
                      </p>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
