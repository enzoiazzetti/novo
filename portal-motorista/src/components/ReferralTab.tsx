"use client";

import { useState } from "react";
import { Referral } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/validators";
import { Users, Copy, CheckCheck, TrendingUp, UserPlus, AlertCircle } from "lucide-react";

type Props = {
  referrals: Referral[];
  referralCode: string;
  totalCommissions: number;
};

export default function ReferralTab({ referrals, referralCode, totalCommissions }: Props) {
  const [copied, setCopied] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const referralLink = `https://motorista.entregaja.com.br/cadastro?ref=${referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleIndicate = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!newName.trim()) {
      setError("Informe o nome do motorista.");
      return;
    }
    if (newPhone.replace(/\D/g, "").length < 10) {
      setError("Informe um telefone válido.");
      return;
    }
    setSent(true);
    setNewName("");
    setNewPhone("");
    setTimeout(() => setSent(false), 4000);
  };

  const active = referrals.filter((r) => r.status === "active");
  const pending = referrals.filter((r) => r.status === "pending");

  return (
    <div className="space-y-6">
      {/* Commission summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <p className="text-xs text-purple-600 font-medium mb-1">Total em comissões</p>
          <p className="text-2xl font-bold text-purple-800">{formatCurrency(totalCommissions)}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-blue-600 font-medium mb-1">Indicados ativos</p>
          <p className="text-2xl font-bold text-blue-800">{active.length}</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-600 font-medium mb-1">Aguardando cadastro</p>
          <p className="text-2xl font-bold text-gray-800">{pending.length}</p>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-5 text-white">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Como funciona a indicação?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="font-semibold mb-1">1. Indique</p>
            <p className="text-purple-100">Compartilhe seu link ou indique pelo formulário abaixo.</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="font-semibold mb-1">2. Motorista cadastra</p>
            <p className="text-purple-100">O indicado se cadastra e realiza a primeira viagem.</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="font-semibold mb-1">3. Você ganha</p>
            <p className="text-purple-100">Receba R$ 70 por viagem realizada pelo indicado (até 5 viagens).</p>
          </div>
        </div>
      </div>

      {/* Referral link */}
      <div>
        <h3 className="text-base font-semibold text-gray-700 mb-3">Seu link de indicação</h3>
        <div className="flex gap-2">
          <div className="flex-1 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 truncate font-mono">
            {referralLink}
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              copied
                ? "bg-emerald-500 text-white"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copiado!" : "Copiar"}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1.5">
          Código: <span className="font-mono font-semibold text-gray-700">{referralCode}</span>
        </p>
      </div>

      {/* Direct indication form */}
      <div className="border border-gray-200 rounded-xl p-5">
        <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-orange-500" />
          Indicar diretamente
        </h3>
        {sent && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
            <CheckCheck className="w-4 h-4" />
            Indicação enviada! Nossa equipe entrará em contato com o motorista.
          </div>
        )}
        <form onSubmit={handleIndicate} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do motorista
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ex.: João da Silva"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp do motorista
            </label>
            <input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="(11) 99999-0000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            Enviar indicação
          </button>
        </form>
      </div>

      {/* Referrals list */}
      {referrals.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            Seus indicados
          </h3>
          <div className="space-y-3">
            {referrals.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3.5 bg-white"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 truncate">{r.referredName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Cadastrado em {formatDate(r.joinedDate)} · {r.loads} viagem(ns)
                  </p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="font-bold text-purple-700">{formatCurrency(r.commission)}</p>
                  <span
                    className={`text-xs font-medium ${
                      r.status === "active" ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {r.status === "active" ? "Ativo" : "Pendente"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
