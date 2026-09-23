"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  CreditCard,
  Plus,
  Stethoscope,
  Users,
  Wallet,
} from "lucide-react";

import PatientSearch from "./PatientSearch";
import PatientTable from "./PatientTable";
import PatientModal from "./PatientModal";
import ViewPatientModal from "./ViewPatientModal";
import PaymentModal from "./PaymentModal";

import {
  emptyTreatment,
  Patient,
  PatientFormData,
  Treatment,
} from "./patientTypes";

export default function PatientPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [paymentPatient, setPaymentPatient] = useState<Patient | null>(null);

  const [openPayments, setOpenPayments] = useState<number | null>(null);

  const [paymentAmount, setPaymentAmount] = useState("");

  const [form, setForm] = useState<PatientFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    totalPrice: "",
    address: "",
    treatments: [{ ...emptyTreatment }],
  });

  // =====================================================
  // FETCH PATIENTS
  // =====================================================

  async function fetchPatients() {
    try {
      setLoading(true);

      const response = await fetch("/api/patients");

      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }

      const result = await response.json();

      setPatients(result.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredPatients = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return patients;
    }

    return patients.filter((patient) => {
      const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();

      return fullName.includes(value);
    });
  }, [patients, search]);

  // =====================================================
  // HELPERS
  // =====================================================

  function calculatePaid(patient: Patient) {
    return patient.payments.reduce(
      (total, payment) => total + Number(payment.amount),
      0,
    );
  }

  function calculateRemaining(patient: Patient) {
    return Number(patient.totalPrice) - calculatePaid(patient);
  }

  function formatMoney(value: number | string) {
    return `$${Number(value).toFixed(2)}`;
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString();
  }

  // =====================================================
  // PATIENT MODAL
  // =====================================================

  function openAddPatientModal() {
    setEditingPatient(null);

    setForm({
      firstName: "",
      lastName: "",
      phone: "",
      totalPrice: "",
      address: "",
      treatments: [{ ...emptyTreatment }],
    });

    setShowPatientModal(true);
  }

  function openEditPatientModal(patient: Patient) {
    setEditingPatient(patient);

    setForm({
      firstName: patient.firstName,
      lastName: patient.lastName,
      phone: patient.phone,
      totalPrice: String(patient.totalPrice),
      address: patient.address,

      treatments:
        patient.treatments.length > 0
          ? patient.treatments.map((treatment) => ({
              id: treatment.id,
              name: treatment.name,
              before: treatment.before,
              after: treatment.after,
            }))
          : [{ ...emptyTreatment }],
    });

    setShowPatientModal(true);
  }

  function closePatientModal() {
    setShowPatientModal(false);
    setEditingPatient(null);
  }

  function updateFormField(field: string, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // =====================================================
  // TREATMENTS
  // =====================================================

  function updateTreatment(
    index: number,
    field: keyof Treatment,
    value: string,
  ) {
    setForm((previous) => {
      const treatments = [...previous.treatments];

      treatments[index] = {
        ...treatments[index],
        [field]: value,
      };

      return {
        ...previous,
        treatments,
      };
    });
  }

  function addTreatment() {
    setForm((previous) => ({
      ...previous,
      treatments: [
        ...previous.treatments,
        {
          ...emptyTreatment,
        },
      ],
    }));
  }

  function removeTreatment(index: number) {
    setForm((previous) => {
      const treatments = previous.treatments.filter(
        (_, treatmentIndex) => treatmentIndex !== index,
      );

      return {
        ...previous,
        treatments:
          treatments.length > 0 ? treatments : [{ ...emptyTreatment }],
      };
    });
  }

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  async function handlePatientSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const cleanedTreatments = form.treatments
        .filter(
          (treatment) =>
            treatment.name.trim() ||
            treatment.before.trim() ||
            treatment.after.trim(),
        )
        .map((treatment) => ({
          name: treatment.name,
          before: treatment.before,
          after: treatment.after,
        }));

      const body = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        totalPrice: Number(form.totalPrice),
        address: form.address,
        treatments: cleanedTreatments,
      };

      const url = editingPatient
        ? `/api/patients/${editingPatient.id}`
        : "/api/patients";

      const method = editingPatient ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to save patient");
      }

      await fetchPatients();

      closePatientModal();
    } catch (error) {
      console.error("Error saving patient:", error);
      alert("Failed to save patient");
    }
  }

  // =====================================================
  // DELETE
  // =====================================================

  async function handleDeletePatient(patient: Patient) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${patient.firstName} ${patient.lastName}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/patients/${patient.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete patient");
      }

      await fetchPatients();
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("Failed to delete patient");
    }
  }

  // =====================================================
  // VIEW
  // =====================================================

  function openViewModal(patient: Patient) {
    setSelectedPatient(patient);
    setShowViewModal(true);
  }

  function closeViewModal() {
    setShowViewModal(false);
    setSelectedPatient(null);
  }

  // =====================================================
  // PAYMENTS
  // =====================================================

  function openPaymentModal(patient: Patient) {
    setPaymentPatient(patient);
    setPaymentAmount("");
    setShowPaymentModal(true);
  }

  function closePaymentModal() {
    setShowPaymentModal(false);
    setPaymentPatient(null);
    setPaymentAmount("");
  }

  async function handleAddPayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!paymentPatient) return;

    const amount = Number(paymentAmount);

    if (!amount || amount <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }

    const remaining = calculateRemaining(paymentPatient);

    if (amount > remaining) {
      alert(`Payment cannot be greater than ${formatMoney(remaining)}`);
      return;
    }

    try {
      const response = await fetch(
        `/api/patients/${paymentPatient.id}/payments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add payment");
      }

      await fetchPatients();

      closePaymentModal();
    } catch (error) {
      console.error("Error adding payment:", error);
      alert("Failed to add payment");
    }
  }

  function togglePayments(patientId: number) {
    setOpenPayments((current) => (current === patientId ? null : patientId));
  }

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalPatients = patients.length;

  const totalRevenue = patients.reduce(
    (total, patient) => total + calculatePaid(patient),
    0,
  );

  const totalRemaining = patients.reduce(
    (total, patient) => total + calculateRemaining(patient),
    0,
  );

  const totalTreatments = patients.reduce(
    (total, patient) => total + patient.treatments.length,
    0,
  );

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600">
              <Stethoscope size={28} />
            </div>

            <p className="font-medium text-slate-600">Loading clinic...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50">
      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-cyan-100/50 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}

        <header className="mb-7 overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-600 via-cyan-600 to-blue-700 shadow-xl shadow-cyan-900/10">
          <div className="relative px-6 py-7 sm:px-8">
            <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[40px] border-white/10" />

            <div className="absolute -bottom-24 right-48 h-52 w-52 rounded-full border-[30px] border-white/5" />

            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white shadow-lg backdrop-blur">
                  <Stethoscope size={34} />
                </div>

                <div>
                  <p className="mb-1 text-sm font-medium text-cyan-100">
                    Dental Clinic Management
                  </p>

                  <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Dentist Dashboard
                  </h1>

                  <p className="mt-1 text-sm text-cyan-100">
                    Manage patients, treatments and payments in one place.
                  </p>
                </div>
              </div>

              <button
                type="button"
                title="Add a new patient"
                onClick={openAddPatientModal}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-cyan-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-cyan-50"
              >
                <Plus size={19} />
                Add Patient
              </button>
            </div>
          </div>
        </header>

        {/* STATISTICS */}

        <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Patients
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalPatients}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Treatments</p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalTreatments}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                <Activity size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Collected</p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {formatMoney(totalRevenue)}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Wallet size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Outstanding
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {formatMoney(totalRemaining)}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <CreditCard size={22} />
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH */}

        <PatientSearch search={search} setSearch={setSearch} />

        {/* TABLE */}

        <PatientTable
          patients={filteredPatients}
          search={search}
          openPayments={openPayments}
          onTogglePayments={togglePayments}
          onAddPayment={openPaymentModal}
          onView={openViewModal}
          onEdit={openEditPatientModal}
          onDelete={handleDeletePatient}
          calculatePaid={calculatePaid}
          calculateRemaining={calculateRemaining}
          formatMoney={formatMoney}
          formatDate={formatDate}
        />
      </div>

      {/* ADD / EDIT */}

      <PatientModal
        show={showPatientModal}
        editingPatient={editingPatient}
        form={form}
        onClose={closePatientModal}
        onSubmit={handlePatientSubmit}
        onUpdateField={updateFormField}
        onUpdateTreatment={updateTreatment}
        onAddTreatment={addTreatment}
        onRemoveTreatment={removeTreatment}
      />

      {/* VIEW */}

      <ViewPatientModal
        show={showViewModal}
        patient={selectedPatient}
        onClose={closeViewModal}
        onAddPayment={openPaymentModal}
        calculatePaid={calculatePaid}
        calculateRemaining={calculateRemaining}
        formatMoney={formatMoney}
        formatDate={formatDate}
      />

      {/* PAYMENT */}

      <PaymentModal
        show={showPaymentModal}
        patient={paymentPatient}
        paymentAmount={paymentAmount}
        onPaymentAmountChange={setPaymentAmount}
        onClose={closePaymentModal}
        onSubmit={handleAddPayment}
        calculatePaid={calculatePaid}
        calculateRemaining={calculateRemaining}
        formatMoney={formatMoney}
      />
    </main>
  );
}
