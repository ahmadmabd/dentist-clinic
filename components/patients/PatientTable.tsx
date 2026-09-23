"use client";

import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Eye,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Trash2,
  Users,
} from "lucide-react";

import { Patient } from "./patientTypes";
import TreatmentTable from "./TreatmentTable";

type PatientTableProps = {
  patients: Patient[];
  search: string;
  openPayments: number | null;
  onTogglePayments: (patientId: number) => void;
  onAddPayment: (patient: Patient) => void;
  onView: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
  calculatePaid: (patient: Patient) => number;
  calculateRemaining: (patient: Patient) => number;
  formatMoney: (value: number | string) => string;
  formatDate: (date: string) => string;
};

export default function PatientTable({
  patients,
  search,
  openPayments,
  onTogglePayments,
  onAddPayment,
  onView,
  onEdit,
  onDelete,
  calculatePaid,
  calculateRemaining,
  formatMoney,
  formatDate,
}: PatientTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1250px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Patient
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Treatments
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Price
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Payments
              </th>

              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <Users size={26} />
                    </div>

                    <p className="font-semibold text-slate-800">
                      No patients found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {search
                        ? "Try another patient name."
                        : "Start by adding your first patient."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              patients.map((patient) => {
                const paid = calculatePaid(patient);
                const remaining = calculateRemaining(patient);
                const isPaymentsOpen = openPayments === patient.id;

                return (
                  <tr
                    key={patient.id}
                    className="border-b border-slate-100 align-top transition last:border-0 hover:bg-cyan-50/30"
                  >
                    {/* PATIENT */}

                    <td className="px-6 py-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 font-bold text-cyan-700">
                          {patient.firstName.charAt(0).toUpperCase()}
                          {patient.lastName.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="font-bold text-slate-900">
                            {patient.firstName} {patient.lastName}
                          </p>

                          <div className="mt-2 space-y-1">
                            <p className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Phone size={12} />
                              {patient.phone}
                            </p>

                            <p className="flex items-center gap-1.5 text-xs text-slate-500">
                              <MapPin size={12} />
                              {patient.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* TREATMENTS */}

                    <td className="px-6 py-5">
                      <TreatmentTable treatments={patient.treatments} />
                    </td>

                    {/* TOTAL */}

                    <td className="px-6 py-5">
                      <div className="rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-xs text-slate-500">
                          Treatment Total
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900">
                          {formatMoney(patient.totalPrice)}
                        </p>
                      </div>
                    </td>

                    {/* PAYMENTS */}

                    <td className="relative px-6 py-5">
                      <button
                        type="button"
                        title="Show payment history"
                        onClick={() => onTogglePayments(patient.id)}
                        className="flex w-[230px] cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50/40"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {formatMoney(paid)} paid
                          </p>

                          <p
                            className={`mt-1 text-xs font-medium ${
                              remaining === 0
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          >
                            {remaining === 0
                              ? "Fully paid"
                              : `${formatMoney(remaining)} remaining`}
                          </p>
                        </div>

                        <div className="text-slate-400">
                          {isPaymentsOpen ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </div>
                      </button>

                      {isPaymentsOpen && (
                        <div className="absolute right-5 z-40 mt-2 w-[330px] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
                          <div className="mb-4 flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-slate-900">
                                Payment History
                              </h3>

                              <p className="text-xs text-slate-500">
                                {patient.payments.length} payments
                              </p>
                            </div>

                            <button
                              type="button"
                              title="Add payment"
                              onClick={() => onAddPayment(patient)}
                              disabled={remaining <= 0}
                              className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                            >
                              <Plus size={14} />
                              Payment
                            </button>
                          </div>

                          {patient.payments.length === 0 ? (
                            <div className="rounded-xl bg-slate-50 p-5 text-center">
                              <CreditCard
                                size={24}
                                className="mx-auto mb-2 text-slate-300"
                              />

                              <p className="text-sm text-slate-500">
                                No payments yet.
                              </p>
                            </div>
                          ) : (
                            <div className="max-h-60 space-y-2 overflow-y-auto">
                              {patient.payments.map((payment, index) => {
                                const paymentNumber =
                                  patient.payments.length - index;

                                return (
                                  <div
                                    key={payment.id}
                                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-3"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                        <CreditCard size={16} />
                                      </div>

                                      <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                          Payment {paymentNumber}
                                        </p>

                                        <p className="flex items-center gap-1 text-[11px] text-slate-400">
                                          <CalendarDays size={11} />
                                          {formatDate(payment.createdAt)}
                                        </p>
                                      </div>
                                    </div>

                                    <span className="font-bold text-emerald-600">
                                      +{formatMoney(payment.amount)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500">Total</span>

                              <span className="font-semibold text-slate-800">
                                {formatMoney(patient.totalPrice)}
                              </span>
                            </div>

                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500">Paid</span>

                              <span className="font-semibold text-emerald-600">
                                {formatMoney(paid)}
                              </span>
                            </div>

                            <div className="flex justify-between rounded-lg bg-amber-50 px-3 py-2 text-sm">
                              <span className="font-medium text-amber-700">
                                Remaining
                              </span>

                              <span className="font-bold text-amber-700">
                                {formatMoney(remaining)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          title="View patient details"
                          onClick={() => onView(patient)}
                          className="cursor-pointer rounded-lg border border-slate-200 p-2.5 text-slate-500 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          title="Edit patient"
                          onClick={() => onEdit(patient)}
                          className="cursor-pointer rounded-lg border border-slate-200 p-2.5 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          title="Delete patient"
                          onClick={() => onDelete(patient)}
                          className="cursor-pointer rounded-lg border border-slate-200 p-2.5 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
