import PatientPage from "@/components/patients/PatientPage";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import WelcomeToast from "@/components/ui/WelcomeToast";
export default function Page() {
  return (
    <div className="min-h-screen bg-slate-100">
      <DashboardNavbar />
      <WelcomeToast />
      <main>
        <PatientPage />
      </main>
      <Footer />
    </div>
  );
}
