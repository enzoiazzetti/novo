"use client";

import { useState } from "react";
import { Payment } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/validators";
import { FileText, Download, Info, ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  payments: Payment[];
  pendingTotal: number;
  driverName: string;
};

export default function NFEmissionTab({ payments, pendingTotal, driverName }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const pendingPayments = payments.filter(
    (p) => p.status === "pending" || p.status === "scheduled"
  );

  const handleDownloadModel = () => {
    const content = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Modelo de NF-e para: ${driverName} -->
<!-- Preencha os campos abaixo com seus dados reais -->
<!-- Valor total a receber: ${formatCurrency(pendingTotal)} -->
<NFe>
  <infNFe>
    <ide>
      <nNF>00001</nNF>
      <dhEmi>${new Date().toISOString()}</dhEmi>
    </ide>
    <emit>
      <CNPJ>SEU_CNPJ_AQUI</CNPJ>
      <xNome>${driverName}</xNome>
    </emit>
    <total>
      <ICMSTot>
        <vNF>${pendingTotal.toFixed(2)}</vNF>
      </ICMSTot>
    </total>
  </infNFe>
</NFe>`;

    const blob = new Blob([content], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "modelo-nfe.xml";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Total card */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
        <p className="text-orange-100 text-sm font-medium mb-1">Total a receber (emitir NF)</p>
        <p className="text-4xl font-bold mb-4">{formatCurrency(pendingTotal)}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownloadModel}
            className="flex items-center justify-center gap-2 bg-white text-orange-600 font-semibold px-4 py-2.5 rounded-lg hover:bg-orange-50 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Baixar modelo NF-e
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700 space-y-1">
            <p className="font-semibold">Como emitir sua nota fiscal:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-600">
              <li>Emita a NF-e no valor total acima pelo seu sistema de emissão (ex.: Nota Fiscal Fácil, eNotas, sistema da prefeitura).</li>
              <li>Use o CNPJ da Entrega Já como tomador de serviços.</li>
              <li>Após emitir, vá na aba <strong>Enviar NF</strong> e faça o upload do XML.</li>
              <li>Nossa equipe validará e liberará o pagamento.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div>
        <h3 className="text-base font-semibold text-gray-700 mb-3">
          Detalhamento dos valores ({pendingPayments.length} itens)
        </h3>
        <div className="space-y-2">
          {pendingPayments.map((p) => (
            <div key={p.id} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3.5 bg-white hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="font-medium text-gray-800 text-sm truncate">
                    {p.description}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <span className="font-bold text-gray-800 text-sm">
                    {formatCurrency(p.amount)}
                  </span>
                  {expandedId === p.id ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>
              {expandedId === p.id && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Vencimento:</span>
                    <span className="font-medium">{formatDate(p.dueDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium capitalize">
                      {p.status === "pending" ? "A receber" : "Agendado"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between items-center px-4 py-3 bg-gray-100 rounded-xl">
          <span className="font-semibold text-gray-700">Total</span>
          <span className="font-bold text-gray-900 text-lg">{formatCurrency(pendingTotal)}</span>
        </div>
      </div>
    </div>
  );
}
