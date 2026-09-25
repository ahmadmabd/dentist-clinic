"use client";

import { useEffect, useState } from "react";

export default function WelcomeToast() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed right-4 top-20 z-50">
      <div className="rounded-xl border border-sky-200 bg-white px-5 py-3 shadow-xl">
        <p className="text-sm font-semibold text-slate-800">
          Welcome to Omar Abdallah Clinic
        </p>
      </div>
    </div>
  );
}
