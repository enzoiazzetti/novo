"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  findDriver,
  getDriverPayments,
  getDriverReferrals,
  getDriverNFs,
  getPendingTotal,
  getTotalCommissions,
  Driver,
  Payment,
  Referral,
  NF,
} from "@/lib/mockData";
import PaymentsTab from "@/components/PaymentsTab";
import NFEmissionTab from "@/components/NFEmissionTab";
import ReferralTab from "@/components/ReferralTab";
import NFUploadTab from "@/components/NFUploadTab";
import {
  CreditCard,
  FileText,
  Users,
  Upload,
  LogOut,
  Truck,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

type Tab = "payments" | "nf-emission" | "referral" | "nf-upload";

const tabs: { id: Tab; label: string; shortLabel: string; icon: React.ElementType }[] = [
  { id: "payments", label: "Pagamentos", shortLabel: "Pagamentos", icon: CreditCard },
  { id: "nf-emission", label: "Emitir NF", shortLabel: "Emitir NF", icon: FileText },
  { id: "referral", label: "Indicações", shortLabel: "Indicações", icon: Users },
  { id: "nf-upload", label: "Enviar NF", shortLabel: "Enviar NF", icon: Upload },
];

export default function DashboardPage() {
  const router = useRouter();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [nfRecords, setNfRecords] = useState<NF[]>([]);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [totalCommissions, setTotalCommissions] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>("payments");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("driverQuery");
    if (!stored) {
      router.push("/");
      return;
    }
    const found = findDriver(stored);
    if (!found) {
      router.push("/");
      return;
    }
    setDriver(found);
    setPayments(getDriverPayments(found.id));
    setReferrals(getDriverReferrals(found.id));
    setNfRecords(getDriverNFs(found.id));
    setPendingTotal(getPendingTotal(found.id));
    setTotalCommissions(getTotalCommissions(found.id));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("driverQuery");
    router.push("/");
  };

  if (!driver) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const ActiveIcon = tabs.find((t) => t.id === activeTab)?.icon ?? CreditCard;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">Entrega Já</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-bold text-sm">
                {driver.name.charAt(0)}
              </div>
              <span className="hidden sm:block font-medium">{driver.name.split(" ")[0]}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold text-gray-800 text-sm">{driver.name}</p>
                  <p className="text-xs text-gray-500">{driver.cpf}</p>
                  <p className="text-xs text-gray-500">Placa: {driver.plate}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Olá, {driver.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Bem-vindo ao seu portal de motorista · Placa {driver.plate}
          </p>
        </div>

        {/* Desktop tabs */}
        <div className="hidden sm:flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Mobile tab selector */}
        <div className="sm:hidden mb-6">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <ActiveIcon className="w-4 h-4 text-orange-500" />
              <span className="font-medium text-gray-800">
                {tabs.find((t) => t.id === activeTab)?.label}
              </span>
            </div>
            {mobileMenuOpen ? (
              <X className="w-4 h-4 text-gray-400" />
            ) : (
              <Menu className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {mobileMenuOpen && (
            <div className="mt-1 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium border-b border-gray-100 last:border-0 transition-colors ${
                      activeTab === tab.id
                        ? "text-orange-600 bg-orange-50"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Tab content */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
          {activeTab === "payments" && (
            <PaymentsTab payments={payments} pendingTotal={pendingTotal} />
          )}
          {activeTab === "nf-emission" && (
            <NFEmissionTab
              payments={payments}
              pendingTotal={pendingTotal}
              driverName={driver.name}
            />
          )}
          {activeTab === "referral" && (
            <ReferralTab
              referrals={referrals}
              referralCode={driver.referralCode}
              totalCommissions={totalCommissions}
            />
          )}
          {activeTab === "nf-upload" && (
            <NFUploadTab nfRecords={nfRecords} driverId={driver.id} />
          )}
        </div>
      </main>

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </div>
  );
}
