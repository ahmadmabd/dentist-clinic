"use client";

import { Stethoscope, Trash2, X } from "lucide-react";
import TreatmentTable from "./TreatmentTable";
import { Patient, PatientFormData, Treatment } from "./patientTypes";

type PatientModalProps = {
  show: boolean;
  editingPatient: Patient | null;
  form: PatientFormData;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onUpdateField: (field: string, value: string) => void;
  onUpdateTreatment: (
    index: number,
    field: keyof Treatment,
    value: string,
  ) => void;
  onAddTreatment: () => void;
  onRemoveTreatment: (index: number) => void;
};

export default function PatientModal({
  show,
  editingPatient,
  form,
  onClose,
  onSubmit,
  onUpdateField,
  onUpdateTreatment,
  onAddTreatment,
  onRemoveTreatment,
}: PatientModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <Stethoscope size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {editingPatient ? "Edit Patient" : "Add New Patient"}
              </h2>

              <p className="text-sm text-slate-500">
                Patient information and treatment details
              </p>
            </div>
          </div>

          <button
            type="button"
            title="Close"
            onClick={onClose}
            className="cursor-pointer rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-7 p-6">
          {/* PATIENT INFORMATION */}

          <div>
            <div className="mb-4">
              <h3 className="font-bold text-slate-900">Patient Information</h3>

              <p className="text-sm text-slate-500">
                Enter the patient's basic information.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                {
                  label: "First Name",
                  field: "firstName",
                  placeholder: "Enter first name",
                },
                {
                  label: "Last Name",
                  field: "lastName",
                  placeholder: "Enter last name",
                },
                {
                  label: "Phone",
                  field: "phone",
                  placeholder: "Enter phone number",
                },
                {
                  label: "Total Price",
                  field: "totalPrice",
                  placeholder: "0.00",
                },
                {
                  label: "Address",
                  field: "address",
                  placeholder: "Enter address",
                },
              ].map((item) => (
                <div
                  key={item.field}
                  className={item.field === "address" ? "md:col-span-2" : ""}
                >
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {item.label}
                  </label>

                  <div className="relative">
                    {item.field === "totalPrice" && (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        $
                      </span>
                    )}

                    <input
                      required
                      type={item.field === "totalPrice" ? "number" : "text"}
                      min={item.field === "totalPrice" ? "0" : undefined}
                      step={item.field === "totalPrice" ? "0.01" : undefined}
                      value={
                        form[item.field as keyof PatientFormData] as string
                      }
                      onChange={(event) =>
                        onUpdateField(item.field, event.target.value)
                      }
                      placeholder={item.placeholder}
                      className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50 ${
                        item.field === "totalPrice" ? "pl-8" : ""
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TREATMENTS */}

          <TreatmentTable
            treatments={form.treatments}
            editable
            onAddTreatment={onAddTreatment}
            onUpdateTreatment={onUpdateTreatment}
            onRemoveTreatment={onRemoveTreatment}
          />

          {/* FORM ACTIONS */}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              title="Cancel"
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              title={editingPatient ? "Update patient" : "Create patient"}
              className="cursor-pointer rounded-xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-600/20 transition hover:bg-cyan-700"
            >
              {editingPatient ? "Update Patient" : "Create Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
