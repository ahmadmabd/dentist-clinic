"use client";

import { CreditCard, MapPin, Phone, Plus, Wallet, X } from "lucide-react";

import { Patient } from "./patientTypes";
import TreatmentTable from "./TreatmentTable";

type ViewPatientModalProps = {
  patient: Patient | null;
  show: boolean;
  onClose: () => void;
  onAddPayment: (patient: Patient) => void;
  calculatePaid: (patient: Patient) => number;
  calculateRemaining: (patient: Patient) => number;
  formatMoney: (value: number | string) => string;
  formatDate: (date: string) => string;
};

export default function ViewPatientModal({
  patient,
  show,
  onClose,
  onAddPayment,
  calculatePaid,
  calculateRemaining,
  formatMoney,
  formatDate,
}: ViewPatientModalProps) {
  if (!show || !patient) return null;

  const paid = calculatePaid(patient);
  const remaining = calculateRemaining(patient);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 font-bold text-cyan-700">
              {patient.firstName.charAt(0)}
              {patient.lastName.charAt(0)}
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {patient.firstName} {patient.lastName}
              </h2>

              <p className="text-sm text-slate-500">Patient medical overview</p>
            </div>
          </div>

          <button
            type="button"
            title="Close patient details"
            onClick={onClose}
            className="cursor-pointer rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-7 p-6">
          {/* INFO */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-cyan-600 shadow-sm">
                <Phone size={17} />
              </div>

              <p className="text-xs font-medium text-slate-400">Phone</p>

              <p className="mt-1 font-semibold text-slate-800">
                {patient.phone}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-cyan-600 shadow-sm">
                <MapPin size={17} />
              </div>

              <p className="text-xs font-medium text-slate-400">Address</p>

              <p className="mt-1 font-semibold text-slate-800">
                {patient.address}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-cyan-600 shadow-sm">
                <Wallet size={17} />
              </div>

              <p className="text-xs font-medium text-slate-400">
                Treatment Total
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {formatMoney(patient.totalPrice)}
              </p>
            </div>
          </div>

          {/* TREATMENTS */}

          <div>
            <div className="mb-4">
              <h3 className="font-bold text-slate-900">Dental Treatments</h3>

              <p className="text-sm text-slate-500">
                Complete treatment history
              </p>
            </div>

            {patient.treatments.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-8 text-center text-slate-500">
                No treatments recorded.
              </div>
            ) : (
              <TreatmentTable treatments={patient.treatments} />
            )}
          </div>

          {/* PAYMENTS */}

          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Payments</h3>

                <p className="text-sm text-slate-500">
                  Payment history and balance
                </p>
              </div>

              <button
                type="button"
                title="Add payment"
                onClick={() => onAddPayment(patient)}
                disabled={remaining <= 0}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                <Plus size={16} />
                Add Payment
              </button>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Total Price</p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {formatMoney(patient.totalPrice)}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-xs text-emerald-700">Total Paid</p>

                <p className="mt-1 text-xl font-bold text-emerald-600">
                  {formatMoney(paid)}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-xs text-amber-700">Remaining</p>

                <p className="mt-1 text-xl font-bold text-amber-600">
                  {formatMoney(remaining)}
                </p>
              </div>
            </div>

            {patient.payments.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-7 text-center">
                <CreditCard size={28} className="mx-auto mb-2 text-slate-300" />

                <p className="text-sm text-slate-500">
                  No payments recorded yet.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {patient.payments.map((payment, index) => {
                  const paymentNumber = patient.payments.length - index;

                  return (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                          <CreditCard size={17} />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            Payment {paymentNumber}
                          </p>

                          <p className="text-xs text-slate-400">
                            {formatDate(payment.createdAt)}
                          </p>
                        </div>
                      </div>

                      <p className="font-bold text-emerald-600">
                        {formatMoney(payment.amount)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
