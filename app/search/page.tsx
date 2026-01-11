"use client";

import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Searching for:", query);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-100">검색</h1>
      </div>

      <form onSubmit={handleSearch} className="relative mb-12">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어를 입력하세요."
          className="w-full rounded-full border border-slate-700 bg-slate-900 py-4 pl-6 pr-14 text-slate-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-500"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </form>

      {/* Search Results Placeholder */}
      <div className="text-center text-slate-500 py-10">
        검색 결과가 여기에 표시됩니다.
      </div>
    </div>
  );
}
