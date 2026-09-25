"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "../layout/Footer";

const images = ["/clinic-1.jpg", "/clinic-2.jpg"];

export default function ClinicHome() {
  const router = useRouter();

  const [currentImage, setCurrentImage] = useState(0);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const goToDashboard = () => {
    setShowToast(true);

    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950">
      {/* Toast */}
      {showToast && (
        <div className="fixed right-4 top-4 z-50 animate-[fadeIn_0.3s_ease-out]">
          <div className="rounded-xl border border-sky-200 bg-white px-5 py-3 shadow-xl">
            <p className="text-sm font-semibold text-slate-800">
              Welcome to Omar Abdallah Clinic
            </p>
          </div>
        </div>
      )}

      {/* Main content */}
      <section className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
        {/* Background image */}
        <div className="absolute inset-0">
          {images.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                currentImage === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image}
                alt="Omar Abdallah Dental Clinic"
                fill
                priority={index === 0}
                className="object-cover"
              />
            </div>
          ))}

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/55" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex w-full max-w-6xl flex-col items-center text-center">
          {/* Small label */}
          <div className="mb-5 rounded-full border border-white/30 bg-white/10 px-5 py-2 backdrop-blur-sm">
            <span className="text-sm font-medium tracking-wide text-white">
              Dental Clinic
            </span>
          </div>

          {/* Main title */}
          <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-6xl md:text-7xl lg:text-8xl">
            Dr. Omar Abdallah
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
            Professional dental care in a comfortable and modern clinic.
          </p>

          {/* Dashboard button */}
          <button
            type="button"
            onClick={goToDashboard}
            title="Go to Dashboard"
            className="group mt-10 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-white/15 text-3xl text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/25"
          >
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              &gt;
            </span>
          </button>

          <p className="mt-3 text-xs text-white/70">Enter Dashboard</p>

          {/* Image indicators */}
          <div className="mt-8 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                title={`Show clinic image ${index + 1}`}
                onClick={() => setCurrentImage(index)}
                className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                  currentImage === index
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
