"use client";

import { useState, useRef } from "react";
import { NF } from "@/lib/mockData";
import { formatCurrency, formatDate, validateNFXML, extractNFValue, extractNFNumber } from "@/lib/validators";
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  CloudUpload,
  Trash2,
} from "lucide-react";

type Props = {
  nfRecords: NF[];
  driverId: string;
};

type UploadState = "idle" | "reading" | "validating" | "success" | "error";

type ValidationResult = {
  valid: boolean;
  errors: string[];
  value: number | null;
  number: string | null;
  fileName: string;
};

const statusConfig = {
  approved: {
    label: "Aprovada",
    icon: CheckCircle,
    className: "text-emerald-600 bg-emerald-50 border-emerald-200",
    iconClass: "text-emerald-500",
  },
  pending: {
    label: "Em análise",
    icon: Clock,
    className: "text-amber-600 bg-amber-50 border-amber-200",
    iconClass: "text-amber-500",
  },
  rejected: {
    label: "Rejeitada",
    icon: XCircle,
    className: "text-red-600 bg-red-50 border-red-200",
    iconClass: "text-red-500",
  },
};

export default function NFUploadTab({ nfRecords }: Props) {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submittedNFs, setSubmittedNFs] = useState<NF[]>(nfRecords);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.name.endsWith(".xml")) {
      setValidation({
        valid: false,
        errors: ["Apenas arquivos XML de NF-e são aceitos."],
        value: null,
        number: null,
        fileName: file.name,
      });
      setUploadState("error");
      return;
    }

    setUploadState("reading");
    const reader = new FileReader();
    reader.onload = (e) => {
      const xml = e.target?.result as string;
      setUploadState("validating");

      setTimeout(() => {
        const result = validateNFXML(xml);
        const value = extractNFValue(xml);
        const number = extractNFNumber(xml);
        setValidation({
          ...result,
          value,
          number,
          fileName: file.name,
        });
        setUploadState(result.valid ? "success" : "error");
      }, 800);
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSubmit = () => {
    if (!validation?.valid) return;
    const newNF: NF = {
      id: `nf-${Date.now()}`,
      driverId: "current",
      number: validation.number ?? `NF-${Date.now()}`,
      value: validation.value ?? 0,
      submittedAt: new Date().toISOString().split("T")[0],
      status: "pending",
    };
    setSubmittedNFs((prev) => [newNF, ...prev]);
    setUploadState("idle");
    setValidation(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleReset = () => {
    setUploadState("idle");
    setValidation(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Upload area */}
      <div>
        <h3 className="text-base font-semibold text-gray-700 mb-3">Enviar Nota Fiscal (XML NF-e)</h3>

        {uploadState === "idle" && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragOver
                ? "border-orange-400 bg-orange-50"
                : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"
            }`}
          >
            <CloudUpload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="font-semibold text-gray-700">Arraste o XML aqui ou clique para selecionar</p>
            <p className="text-sm text-gray-500 mt-1">Apenas arquivos .xml de NF-e</p>
            <input
              ref={fileRef}
              type="file"
              accept=".xml"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        {(uploadState === "reading" || uploadState === "validating") && (
          <div className="border-2 border-orange-300 rounded-xl p-8 text-center bg-orange-50">
            <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="font-semibold text-orange-700">
              {uploadState === "reading" ? "Lendo arquivo..." : "Validando NF-e..."}
            </p>
          </div>
        )}

        {uploadState === "success" && validation && (
          <div className="border-2 border-emerald-400 rounded-xl p-5 bg-emerald-50 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-700">NF-e válida!</p>
                <p className="text-sm text-emerald-600">{validation.fileName}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
              {validation.number && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Número:</span>
                  <span className="font-medium">{validation.number}</span>
                </div>
              )}
              {validation.value && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Valor:</span>
                  <span className="font-bold text-gray-800">{formatCurrency(validation.value)}</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Enviar nota fiscal
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {uploadState === "error" && validation && (
          <div className="border-2 border-red-300 rounded-xl p-5 bg-red-50 space-y-4">
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-700">NF-e inválida</p>
                <p className="text-sm text-red-600">{validation.fileName}</p>
              </div>
            </div>
            <div className="space-y-2">
              {validation.errors.map((err, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-red-600 bg-white rounded-lg px-3 py-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {err}
                </div>
              ))}
            </div>
            <button
              onClick={handleReset}
              className="w-full border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-white transition-colors text-sm"
            >
              Tentar novamente
            </button>
          </div>
        )}
      </div>

      {/* NF History */}
      {submittedNFs.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-gray-700 mb-3">Notas enviadas</h3>
          <div className="space-y-3">
            {submittedNFs.map((nf) => {
              const cfg = statusConfig[nf.status];
              const Icon = cfg.icon;
              return (
                <div
                  key={nf.id}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3.5 ${cfg.className}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-5 h-5 shrink-0 ${cfg.iconClass}`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-gray-400" />
                        <p className="font-medium text-gray-800 text-sm">{nf.number}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Enviada em {formatDate(nf.submittedAt)}
                      </p>
                      {nf.rejectionReason && (
                        <p className="text-xs text-red-500 mt-0.5">{nf.rejectionReason}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="font-bold text-gray-800 text-sm">{formatCurrency(nf.value)}</p>
                    <span className="text-xs font-medium">{cfg.label}</span>
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
