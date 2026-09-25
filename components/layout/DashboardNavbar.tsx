"use client";

import { useRouter } from "next/navigation";

export default function DashboardNavbar() {
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Dentist information */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-xl">
            🦷
          </div>

          <div>
            <h1 className="text-lg font-bold text-slate-800 sm:text-xl">
              Dentist Omar Abdallah
            </h1>

            <p className="text-xs text-slate-500">Dental Clinic</p>
          </div>
        </div>

        {/* Back to Home button */}
        <button
          type="button"
          onClick={() => router.push("/")}
          title="Back to Home"
          className="group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xl font-semibold text-slate-700 transition-all duration-200 hover:scale-105 hover:bg-sky-50 hover:text-sky-600 hover:shadow-md"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
            &lt;
          </span>
        </button>
      </div>
    </nav>
  );
}
