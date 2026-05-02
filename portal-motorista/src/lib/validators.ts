export function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(digits[10]);
}

export function validatePlate(plate: string): boolean {
  const normalized = plate.replace(/[\s\-]/g, "").toUpperCase();
  // Old format: ABC1234
  const old = /^[A-Z]{3}\d{4}$/.test(normalized);
  // Mercosul format: ABC1D23
  const mercosul = /^[A-Z]{3}\d[A-Z]\d{2}$/.test(normalized);
  return old || mercosul;
}

export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function formatPlate(value: string): string {
  const clean = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 7);
  if (clean.length <= 3) return clean;
  return `${clean.slice(0, 3)}-${clean.slice(3)}`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export function validateNFXML(xml: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!xml.includes("<nfeProc") && !xml.includes("<NFe")) {
    errors.push("Arquivo não reconhecido como NF-e válida.");
  }
  if (!xml.includes("<CNPJ>") && !xml.includes("<CPF>")) {
    errors.push("Emitente não identificado no XML.");
  }
  if (!xml.includes("<vNF>")) {
    errors.push("Valor total da nota não encontrado.");
  }
  if (!xml.includes("<chNFe>") && !/<Id>NFe\d/.test(xml)) {
    errors.push("Chave de acesso da NF-e não encontrada.");
  }

  return { valid: errors.length === 0, errors };
}

export function extractNFValue(xml: string): number | null {
  const match = xml.match(/<vNF>([\d.]+)<\/vNF>/);
  if (!match) return null;
  return parseFloat(match[1]);
}

export function extractNFNumber(xml: string): string | null {
  const match = xml.match(/<nNF>(\d+)<\/nNF>/);
  if (!match) return null;
  return `NF-${match[1].padStart(5, "0")}`;
}
