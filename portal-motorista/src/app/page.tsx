"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { findDriver } from "@/lib/mockData";
import { validateCPF, validatePlate, formatCPF, formatPlate } from "@/lib/validators";
import { Truck, AlertCircle, ArrowRight, Shield } from "lucide-react";

type InputMode = "cpf" | "plate";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<InputMode>("cpf");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setError("");
    if (mode === "cpf") {
      setValue(formatCPF(raw));
    } else {
      setValue(formatPlate(raw));
    }
  };

  const handleModeSwitch = (m: InputMode) => {
    setMode(m);
    setValue("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "cpf" && !validateCPF(value)) {
      setError("CPF inválido. Verifique os números e tente novamente.");
      return;
    }
    if (mode === "plate" && !validatePlate(value)) {
      setError("Placa inválida. Use o formato ABC-1234 ou ABC-1D23.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const driver = findDriver(value);
    if (!driver) {
      setError("Nenhum motorista encontrado com esse dado. Verifique e tente novamente.");
      setLoading(false);
      return;
    }

    localStorage.setItem("driverQuery", value);
    router.push("/dashboard");
  };

  const placeholder = mode === "cpf" ? "000.000.000-00" : "ABC-1D23";
  const maxLength = mode === "cpf" ? 14 : 8;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Truck className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold text-white">Entrega Já</h1>
          <p className="text-orange-100 mt-1">Portal do Motorista</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Acessar minha conta</h2>
          <p className="text-sm text-gray-500 mb-6">
            Informe seu CPF ou a placa do seu veículo para entrar.
          </p>

          {/* Mode toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-5">
            <button
              type="button"
              onClick={() => handleModeSwitch("cpf")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === "cpf"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              CPF
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch("plate")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === "plate"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Placa do veículo
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {mode === "cpf" ? "Seu CPF" : "Placa do veículo"}
              </label>
              <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                maxLength={maxLength}
                className={`w-full border rounded-xl px-4 py-3 text-lg font-mono tracking-wider focus:outline-none focus:ring-2 transition-all ${
                  error
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-orange-400 focus:border-transparent"
                }`}
                autoComplete="off"
                inputMode={mode === "cpf" ? "numeric" : "text"}
              />
              {error && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !value}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Acessar portal
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 font-medium mb-1">Dados para teste:</p>
            <p className="text-xs text-gray-600 font-mono">CPF: 123.456.789-09</p>
            <p className="text-xs text-gray-600 font-mono">Placa: ABC-1D23</p>
          </div>
        </div>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 mt-6 text-orange-100 text-xs">
          <Shield className="w-3.5 h-3.5" />
          <span>Seus dados estão protegidos e criptografados</span>
        </div>
      </div>
    </div>
  );
}
