"use client";

import { CreditCard, X } from "lucide-react";
import { Patient } from "./patientTypes";

type PaymentModalProps = {
  show: boolean;
  patient: Patient | null;
  paymentAmount: string;
  onPaymentAmountChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  calculatePaid: (patient: Patient) => number;
  calculateRemaining: (patient: Patient) => number;
  formatMoney: (value: number | string) => string;
};

export default function PaymentModal({
  show,
  patient,
  paymentAmount,
  onPaymentAmountChange,
  onClose,
  onSubmit,
  calculatePaid,
  calculateRemaining,
  formatMoney,
}: PaymentModalProps) {
  if (!show || !patient) return null;

  const paid = calculatePaid(patient);
  const remaining = calculateRemaining(patient);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <CreditCard size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold">Add Payment</h2>

                <p className="text-sm text-cyan-100">
                  {patient.firstName} {patient.lastName}
                </p>
              </div>
            </div>

            <button
              type="button"
              title="Close payment form"
              onClick={onClose}
              className="cursor-pointer rounded-xl p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 p-6">
          {/* SUMMARY */}

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Total Price</span>

              <span className="font-semibold text-slate-800">
                {formatMoney(patient.totalPrice)}
              </span>
            </div>

            <div className="mt-3 flex justify-between text-sm">
              <span className="text-slate-500">Already Paid</span>

              <span className="font-semibold text-emerald-600">
                {formatMoney(paid)}
              </span>
            </div>

            <div className="mt-3 flex justify-between rounded-xl bg-amber-50 px-3 py-3">
              <span className="font-medium text-amber-700">Remaining</span>

              <span className="font-bold text-amber-700">
                {formatMoney(remaining)}
              </span>
            </div>
          </div>

          {/* INPUT */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Payment Amount
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-slate-400">
                $
              </span>

              <input
                required
                autoFocus
                type="number"
                min="0.01"
                max={remaining}
                step="0.01"
                value={paymentAmount}
                onChange={(event) => onPaymentAmountChange(event.target.value)}
                placeholder="Enter payment amount"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-9 pr-4 text-lg font-semibold text-slate-800 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
              />
            </div>
          </div>

          {/* BUTTONS */}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              title="Cancel payment"
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              title="Save payment"
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-600/20 transition hover:bg-cyan-700"
            >
              <CreditCard size={17} />
              Save Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
