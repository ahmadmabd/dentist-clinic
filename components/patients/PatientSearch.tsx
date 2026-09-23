"use client";

import { Search, X } from "lucide-react";

type PatientSearchProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function PatientSearch({
  search,
  setSearch,
}: PatientSearchProps) {
  return (
    <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Patients</h2>

          <p className="text-sm text-slate-500">
            Search and manage your clinic patients.
          </p>
        </div>

        <div className="relative w-full md:max-w-md">
          <Search
            size={19}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search patient by name..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
          />

          {search && (
            <button
              type="button"
              title="Clear search"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
