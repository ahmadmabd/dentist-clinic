"use client";

import { Plus, Trash2 } from "lucide-react";
import { Treatment } from "./patientTypes";

type TreatmentTableProps = {
  treatments: Treatment[];
  editable?: boolean;
  onAddTreatment?: () => void;
  onUpdateTreatment?: (
    index: number,
    field: keyof Treatment,
    value: string,
  ) => void;
  onRemoveTreatment?: (index: number) => void;
};

export default function TreatmentTable({
  treatments,
  editable = false,
  onAddTreatment,
  onUpdateTreatment,
  onRemoveTreatment,
}: TreatmentTableProps) {
  if (!editable) {
    if (treatments.length === 0) {
      return (
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
          No treatments
        </span>
      );
    }

    return (
      <div className="w-[500px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="border-b border-slate-200 px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Name
                </th>

                <th className="border-b border-slate-200 px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Before
                </th>

                <th className="border-b border-slate-200 px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  After
                </th>
              </tr>
            </thead>

            <tbody>
              {treatments.map((treatment, index) => (
                <tr
                  key={treatment.id ?? index}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-3 py-2.5 text-xs font-semibold text-slate-800">
                    {treatment.name || "-"}
                  </td>

                  <td className="max-w-[150px] px-3 py-2.5 text-xs text-slate-500">
                    {treatment.before || "-"}
                  </td>

                  <td className="max-w-[150px] px-3 py-2.5 text-xs text-slate-500">
                    {treatment.after || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bold text-slate-900">Dental Treatments</h3>

          <p className="text-sm text-slate-500">
            Record each dental operation and its condition before and after
            treatment.
          </p>
        </div>

        <button
          type="button"
          title="Add another treatment"
          onClick={onAddTreatment}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"
        >
          <Plus size={17} />
          Add Treatment
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead>
              <tr className="bg-slate-50">
                <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Operation
                </th>

                <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Before
                </th>

                <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  After
                </th>

                <th className="w-16 border-b border-slate-200 px-3 py-3" />
              </tr>
            </thead>

            <tbody>
              {treatments.map((treatment, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="p-3">
                    <input
                      value={treatment.name}
                      onChange={(event) =>
                        onUpdateTreatment?.(index, "name", event.target.value)
                      }
                      placeholder="e.g. Cleaning"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                    />
                  </td>

                  <td className="p-3">
                    <input
                      value={treatment.before}
                      onChange={(event) =>
                        onUpdateTreatment?.(index, "before", event.target.value)
                      }
                      placeholder="Condition before"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                    />
                  </td>

                  <td className="p-3">
                    <input
                      value={treatment.after}
                      onChange={(event) =>
                        onUpdateTreatment?.(index, "after", event.target.value)
                      }
                      placeholder="Result after"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                    />
                  </td>

                  <td className="p-3 text-center">
                    <button
                      type="button"
                      title="Remove treatment"
                      onClick={() => onRemoveTreatment?.(index)}
                      className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
