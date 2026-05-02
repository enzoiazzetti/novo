export type Driver = {
  id: string;
  name: string;
  cpf: string;
  plate: string;
  email: string;
  phone: string;
  referralCode: string;
  referredBy?: string;
};

export type Payment = {
  id: string;
  driverId: string;
  description: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "paid" | "pending" | "scheduled";
  nfNumber?: string;
};

export type Referral = {
  id: string;
  referrerId: string;
  referredName: string;
  referredCpf: string;
  joinedDate: string;
  loads: number;
  commission: number;
  status: "active" | "pending";
};

export type NF = {
  id: string;
  driverId: string;
  number: string;
  value: number;
  submittedAt: string;
  status: "approved" | "pending" | "rejected";
  rejectionReason?: string;
};

export const drivers: Driver[] = [
  {
    id: "d1",
    name: "Carlos Eduardo Silva",
    cpf: "123.456.789-09",
    plate: "ABC1D23",
    email: "carlos@email.com",
    phone: "(11) 99999-1234",
    referralCode: "CARLOS2024",
  },
  {
    id: "d2",
    name: "Maria das Graças Oliveira",
    cpf: "987.654.321-00",
    plate: "XYZ9A87",
    email: "maria@email.com",
    phone: "(21) 98888-5678",
    referralCode: "MARIA2024",
    referredBy: "CARLOS2024",
  },
  {
    id: "d3",
    name: "José Rodrigues Pereira",
    cpf: "456.789.123-45",
    plate: "DEF4G56",
    email: "jose@email.com",
    phone: "(31) 97777-9012",
    referralCode: "JOSE2024",
  },
];

export const payments: Payment[] = [
  {
    id: "p1",
    driverId: "d1",
    description: "Frete SP → RJ – 05 viagens",
    amount: 4200.0,
    dueDate: "2025-04-10",
    paidDate: "2025-04-10",
    status: "paid",
    nfNumber: "NF-00123",
  },
  {
    id: "p2",
    driverId: "d1",
    description: "Frete SP → BH – 03 viagens",
    amount: 3150.0,
    dueDate: "2025-04-25",
    paidDate: "2025-04-25",
    status: "paid",
    nfNumber: "NF-00145",
  },
  {
    id: "p3",
    driverId: "d1",
    description: "Frete SP → Campinas – 07 viagens",
    amount: 2800.0,
    dueDate: "2025-05-10",
    status: "pending",
  },
  {
    id: "p4",
    driverId: "d1",
    description: "Frete SP → Santos – 04 viagens",
    amount: 1950.0,
    dueDate: "2025-05-25",
    status: "scheduled",
  },
  {
    id: "p5",
    driverId: "d1",
    description: "Comissão – indicação Maria Oliveira",
    amount: 350.0,
    dueDate: "2025-05-25",
    status: "scheduled",
  },
  {
    id: "p6",
    driverId: "d2",
    description: "Frete RJ → SP – 02 viagens",
    amount: 1800.0,
    dueDate: "2025-04-20",
    paidDate: "2025-04-20",
    status: "paid",
    nfNumber: "NF-00201",
  },
  {
    id: "p7",
    driverId: "d2",
    description: "Frete RJ → BH – 03 viagens",
    amount: 2400.0,
    dueDate: "2025-05-15",
    status: "pending",
  },
  {
    id: "p8",
    driverId: "d3",
    description: "Frete BH → SP – 06 viagens",
    amount: 5100.0,
    dueDate: "2025-04-30",
    paidDate: "2025-04-30",
    status: "paid",
    nfNumber: "NF-00301",
  },
  {
    id: "p9",
    driverId: "d3",
    description: "Frete BH → RJ – 02 viagens",
    amount: 2200.0,
    dueDate: "2025-05-20",
    status: "scheduled",
  },
];

export const referrals: Referral[] = [
  {
    id: "r1",
    referrerId: "d1",
    referredName: "Maria das Graças Oliveira",
    referredCpf: "987.654.321-00",
    joinedDate: "2025-03-15",
    loads: 5,
    commission: 350.0,
    status: "active",
  },
  {
    id: "r2",
    referrerId: "d1",
    referredName: "Paulo Henrique Costa",
    referredCpf: "321.654.987-11",
    joinedDate: "2025-04-02",
    loads: 2,
    commission: 140.0,
    status: "active",
  },
  {
    id: "r3",
    referrerId: "d1",
    referredName: "Fernanda Lima",
    referredCpf: "741.852.963-22",
    joinedDate: "2025-04-20",
    loads: 0,
    commission: 0,
    status: "pending",
  },
];

export const nfRecords: NF[] = [
  {
    id: "nf1",
    driverId: "d1",
    number: "NF-00123",
    value: 4200.0,
    submittedAt: "2025-04-08",
    status: "approved",
  },
  {
    id: "nf2",
    driverId: "d1",
    number: "NF-00145",
    value: 3150.0,
    submittedAt: "2025-04-23",
    status: "approved",
  },
];

export function findDriver(query: string): Driver | null {
  const normalized = query.replace(/[\s.\-\/]/g, "").toLowerCase();
  return (
    drivers.find((d) => {
      const cpf = d.cpf.replace(/[\s.\-\/]/g, "").toLowerCase();
      const plate = d.plate.replace(/[\s\-]/g, "").toLowerCase();
      return cpf === normalized || plate === normalized;
    }) ?? null
  );
}

export function getDriverPayments(driverId: string): Payment[] {
  return payments.filter((p) => p.driverId === driverId);
}

export function getDriverReferrals(driverId: string): Referral[] {
  return referrals.filter((r) => r.referrerId === driverId);
}

export function getDriverNFs(driverId: string): NF[] {
  return nfRecords.filter((n) => n.driverId === driverId);
}

export function getPendingTotal(driverId: string): number {
  return payments
    .filter(
      (p) => p.driverId === driverId && (p.status === "pending" || p.status === "scheduled")
    )
    .reduce((sum, p) => sum + p.amount, 0);
}

export function getTotalCommissions(driverId: string): number {
  return referrals
    .filter((r) => r.referrerId === driverId)
    .reduce((sum, r) => sum + r.commission, 0);
}
