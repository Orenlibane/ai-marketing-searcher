"use client";

import { useState, ReactNode } from "react";
import SyncButton from "./SyncButton";
import CompaniesTab from "./companies/CompaniesTab";

interface DashboardShellProps {
  productsContent: ReactNode;
}

export default function DashboardShell({ productsContent }: DashboardShellProps) {
  const [activeTab, setActiveTab] = useState<"products" | "companies">("products");

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Marketing Tools</h1>
            <p className="text-xs text-gray-500">Live directory · ranked by usage score</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setActiveTab("products")}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                  activeTab === "products"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab("companies")}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                  activeTab === "companies"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Companies
              </button>
            </div>
            {activeTab === "products" && <SyncButton />}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "products" ? productsContent : <CompaniesTab />}

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 py-6 text-center text-xs text-gray-400">
        AI Marketing Tools Dashboard · Updates daily via cron
      </footer>
    </main>
  );
}
