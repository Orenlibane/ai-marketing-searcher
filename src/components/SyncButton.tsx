"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SyncResult {
  success?: boolean;
  error?: string;
  added?: number;
  updated?: number;
  parsedToolsCount?: number;
  searchResultsCount?: number;
}

export default function SyncButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const router = useRouter();

  async function handleSync() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/fetch-tools", { method: "POST" });
      const data = (await res.json()) as SyncResult;
      setResult(data);

      if (data.success) {
        router.refresh();
      }
    } catch {
      setResult({ error: "Network error — check console for details." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleSync}
        disabled={loading}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Syncing...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Sync Now
          </>
        )}
      </button>

      {result && (
        <div
          className={`text-xs px-3 py-2 rounded-lg max-w-xs text-right ${
            result.error
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {result.error ? (
            <span>{result.error}</span>
          ) : (
            <span>
              +{result.added ?? 0} added · {result.updated ?? 0} updated ·{" "}
              {result.parsedToolsCount ?? 0} parsed from {result.searchResultsCount ?? 0} results
            </span>
          )}
        </div>
      )}
    </div>
  );
}
