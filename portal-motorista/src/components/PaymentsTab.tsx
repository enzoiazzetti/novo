"use client";

import { Payment } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/validators";
import { CheckCircle, Clock, Calendar, FileText } from "lucide-react";

type Props = {
  payments: Payment[];
  pendingTotal: number;
};

const statusConfig = {
  paid: {
    label: "Pago",
    icon: CheckCircle,
    className: "text-emerald-600 bg-emerald-50 border-emerald-200",
    iconClass: "text-emerald-500",
  },
  pending: {
    label: "A receber",
    icon: Clock,
    className: "text-amber-600 bg-amber-50 border-amber-200",
    iconClass: "text-amber-500",
  },
  scheduled: {
    label: "Agendado",
    icon: Calendar,
    className: "text-blue-600 bg-blue-50 border-blue-200",
    iconClass: "text-blue-500",
  },
};

export default function PaymentsTab({ payments, pendingTotal }: Props) {
  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amount, 0);

  const upcoming = payments
    .filter((p) => p.status !== "paid")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const history = payments
    .filter((p) => p.status === "paid")
    .sort((a, b) => b.dueDate.localeCompare(a.dueDate));

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <p className="text-sm text-amber-700 font-medium mb-1">A receber / Agendado</p>
          <p className="text-3xl font-bold text-amber-800">{formatCurrency(pendingTotal)}</p>
          <p className="text-xs text-amber-600 mt-1">{upcoming.length} pagamento(s) pendente(s)</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
          <p className="text-sm text-emerald-700 font-medium mb-1">Total já recebido</p>
          <p className="text-3xl font-bold text-emerald-800">{formatCurrency(totalPaid)}</p>
          <p className="text-xs text-emerald-600 mt-1">{history.length} pagamento(s) realizado(s)</p>
        </div>
      </div>

      {/* Upcoming payments */}
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-gray-700 mb-3">Próximos pagamentos</h3>
          <div className="space-y-3">
            {upcoming.map((p) => {
              const cfg = statusConfig[p.status];
              const Icon = cfg.icon;
              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3.5 ${cfg.className}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-5 h-5 shrink-0 ${cfg.iconClass}`} />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate">{p.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Vencimento: {formatDate(p.dueDate)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="font-bold text-gray-800">{formatCurrency(p.amount)}</p>
                    <span className="text-xs font-medium">{cfg.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Payment history */}
      {history.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-gray-700 mb-3">Histórico de pagamentos</h3>
          <div className="space-y-3">
            {history.map((p) => {
              const cfg = statusConfig[p.status];
              const Icon = cfg.icon;
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-5 h-5 shrink-0 text-emerald-500" />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate">{p.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-gray-500">
                          Pago em: {p.paidDate ? formatDate(p.paidDate) : "-"}
                        </p>
                        {p.nfNumber && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <FileText className="w-3 h-3" />
                            {p.nfNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="font-bold text-gray-800">{formatCurrency(p.amount)}</p>
                    <span className="text-xs text-emerald-600 font-medium">Pago</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
