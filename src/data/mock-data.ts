export type Role = "SUPER_ADMIN" | "ADMINISTRATOR" | "REVIEWER" | "ANGGOTA";
export type Position = "PEMBINA" | "KETUA" | "SEKRETARIS" | "BENDAHARA" | "ANGGOTA";
export type PaymentStatus = "UNPAID" | "PENDING" | "PAID";
export type PeriodStatus = "OPEN" | "CLOSED";
export type ExpenseCategory = "SAKIT" | "BANTUAN" | "HADIAH" | "LAINNYA";
export type Relationship = "SUAMI" | "ISTRI" | "ANAK" | "BAPAK" | "IBU" | "SAUDARA" | "LAINNYA";
export type MeetingStatus = "PLANNED" | "DONE" | "CANCELLED";

export interface User {
  id: string;
  phone: string;
  name: string;
  role: Role;
  position: Position;
  photoUrl: string;
  gender: "Laki-laki" | "Perempuan";
  birthDate: string;
  address: string;
  occupation: string;
  parentId: string | null;
  isActive: boolean;
  joinedAt: string;
}

export interface ArisanPeriod {
  id: string;
  name: string;
  iuranAmount: number;
  startDate: string;
  dueDate: string;
  endDate: string;
  status: PeriodStatus;
  description: string;
  winnerMemberId?: string;
  wonAt?: string;
  grossPrizeAmount?: number;
  deductionsAmount?: number;
  netPrizeAmount?: number;
  cycleNumber?: number;
}

export interface PeriodPayment {
  id: string;
  periodId: string;
  memberId: string;
  amount: number;
  status: PaymentStatus;
  transferProofUrl?: string;
  note?: string;
  paidAt?: string;
  verifiedById?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface SocialExpense {
  id: string;
  category: ExpenseCategory;
  recipientId: string;
  recipientName: string;
  amount: number;
  expenseDate: string;
  description: string;
  proofUrl?: string;
  recordedByName: string;
  isReviewed?: boolean;
  reviewedByName?: string;
  reviewedAt?: string;
}

export interface ArisanMeeting {
  id: string;
  title: string;
  hostMemberId: string;
  hostMemberName: string;
  address: string;
  latitude: number;
  longitude: number;
  scheduledAt: string;
  status: MeetingStatus;
  notes: string;
}

export interface FamilyMember {
  id: string;
  userId: string;
  name: string;
  relationship: Relationship;
  photoUrl?: string;
  birthDate?: string;
  gender?: "Laki-laki" | "Perempuan";
  notes?: string;
}

export interface AppSettings {
  arisanName: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  whatsappContact: string;
  monthlyAmount: number;
  arisanDescription: string;
}

// -------------------------------------------------------------
// DATA AWAL DUMMY (Berbahasa Indonesia & Relevan Keluarga)
// -------------------------------------------------------------

export const initialUsers: User[] = [
  {
    id: "usr-01",
    phone: "6281234000010",
    name: "H. Bambang Sutrisno",
    role: "SUPER_ADMIN",
    position: "KETUA",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    gender: "Laki-laki",
    birthDate: "1968-05-14",
    address: "Indonesia Raya",
    occupation: "Wiraswasta / Tokoh Masyarakat",
    parentId: null,
    isActive: true,
    joinedAt: "2024-01-01",
  },
  {
    id: "usr-02",
    phone: "6281234000011",
    name: "Ibu Ratna Kusuma",
    role: "ADMINISTRATOR",
    position: "BENDAHARA",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
    gender: "Perempuan",
    birthDate: "1975-09-22",
    address: "Jl. Dago Atas No. 88, Coblong, Bandung",
    occupation: "Pengusaha Kuliner & Akuntan",
    parentId: "usr-01",
    isActive: true,
    joinedAt: "2024-01-01",
  },
  {
    id: "usr-03",
    phone: "6281234000012",
    name: "Pak Agus Wijaya",
    role: "ADMINISTRATOR",
    position: "SEKRETARIS",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    gender: "Laki-laki",
    birthDate: "1980-03-10",
    address: "Jl. Anggrek No. 45, Riau, Bandung",
    occupation: "Staf Administrasi Pendidikan",
    parentId: "usr-01",
    isActive: true,
    joinedAt: "2024-01-01",
  },
  {
    id: "usr-04",
    phone: "6281234000015",
    name: "Hj. Siti Aminah",
    role: "REVIEWER",
    position: "PEMBINA",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    gender: "Perempuan",
    birthDate: "1955-11-04",
    address: "Jl. Ganesa No. 5, Sumur Bandung",
    occupation: "Pensiunan Guru & Sesepuh Keluarga",
    parentId: null,
    isActive: true,
    joinedAt: "2024-01-01",
  },
  {
    id: "usr-05",
    phone: "6281234000013",
    name: "Bu Dewi Anggraini",
    role: "ANGGOTA",
    position: "ANGGOTA",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
    gender: "Perempuan",
    birthDate: "1986-07-19",
    address: "Jl. Cihampelas No. 102, Sukajadi, Bandung",
    occupation: "Arsitek & Desainer Interior",
    parentId: "usr-02",
    isActive: true,
    joinedAt: "2024-02-15",
  },
  {
    id: "usr-06",
    phone: "6281234000014",
    name: "Mas Eko Prasetyo",
    role: "ANGGOTA",
    position: "ANGGOTA",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80",
    gender: "Laki-laki",
    birthDate: "1991-12-08",
    address: "Jl. Buah Batu No. 67, Lengkong, Bandung",
    occupation: "Software Engineer",
    parentId: "usr-03",
    isActive: true,
    joinedAt: "2024-03-01",
  },
  {
    id: "usr-07",
    phone: "6281234000016",
    name: "Rina Marlina",
    role: "ANGGOTA",
    position: "ANGGOTA",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    gender: "Perempuan",
    birthDate: "1972-02-28",
    address: "Indonesia Raya",
    occupation: "Ibu Rumah Tangga",
    parentId: "usr-01",
    isActive: true,
    joinedAt: "2024-01-01",
  },
  {
    id: "usr-08",
    phone: "6281234000017",
    name: "Hendra Gunawan",
    role: "ANGGOTA",
    position: "ANGGOTA",
    photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80",
    gender: "Laki-laki",
    birthDate: "1984-04-12",
    address: "Jl. Cihampelas No. 102, Sukajadi, Bandung",
    occupation: "Pegawai Swasta",
    parentId: "usr-05",
    isActive: true,
    joinedAt: "2024-02-15",
  },
];

export const initialPeriods: ArisanPeriod[] = [
  {
    id: "prd-12",
    name: "Periode 12 – Juni 2026",
    iuranAmount: 150000,
    startDate: "2026-06-01",
    dueDate: "2026-06-15",
    endDate: "2026-06-30",
    status: "OPEN",
    description: "Iuran rutin arisan keluarga ke-12 tahun buku 2026. Arisan akan diundi pada tanggal 20 Juni di Kediaman H. Bambang Sutrisno.",
    cycleNumber: 1,
  },
  {
    id: "prd-11",
    name: "Periode 11 – Mei 2026",
    iuranAmount: 150000,
    startDate: "2026-05-01",
    dueDate: "2026-05-15",
    endDate: "2026-05-31",
    status: "CLOSED",
    description: "Iuran bulan Mei 2026 bertepatan dengan silaturahmi Idul Adha keluarga.",
    winnerMemberId: "usr-02",
    wonAt: "2026-05-20T10:30:00Z",
    grossPrizeAmount: 1200000,
    deductionsAmount: 0,
    netPrizeAmount: 1200000,
    cycleNumber: 1,
  },
  {
    id: "prd-10",
    name: "Periode 10 – April 2026",
    iuranAmount: 150000,
    startDate: "2026-04-01",
    dueDate: "2026-04-15",
    endDate: "2026-04-30",
    status: "CLOSED",
    description: "Iuran bulan April 2026.",
    winnerMemberId: "usr-06",
    wonAt: "2026-04-18T14:00:00Z",
    grossPrizeAmount: 1200000,
    deductionsAmount: 0,
    netPrizeAmount: 1200000,
    cycleNumber: 1,
  },
];

export const initialPayments: PeriodPayment[] = [
  {
    id: "pay-12-01",
    periodId: "prd-12",
    memberId: "usr-01",
    amount: 150000,
    status: "PAID",
    transferProofUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
    note: "Transfer via BCA Mobile a.n Bambang Sutrisno",
    paidAt: "2026-06-02T10:30:00Z",
    verifiedById: "usr-02",
    verifiedAt: "2026-06-02T11:00:00Z",
    createdAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "pay-12-02",
    periodId: "prd-12",
    memberId: "usr-02",
    amount: 150000,
    status: "PAID",
    transferProofUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
    note: "Setor langsung kas",
    paidAt: "2026-06-02T09:00:00Z",
    verifiedById: "usr-01",
    verifiedAt: "2026-06-02T09:15:00Z",
    createdAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "pay-12-03",
    periodId: "prd-12",
    memberId: "usr-03",
    amount: 150000,
    status: "PAID",
    transferProofUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
    note: "Transfer via Mandiri",
    paidAt: "2026-06-03T14:20:00Z",
    verifiedById: "usr-02",
    verifiedAt: "2026-06-03T15:00:00Z",
    createdAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "pay-12-04",
    periodId: "prd-12",
    memberId: "usr-04",
    amount: 150000,
    status: "PAID",
    transferProofUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
    note: "Transfer BSI Mobile",
    paidAt: "2026-06-04T08:15:00Z",
    verifiedById: "usr-02",
    verifiedAt: "2026-06-04T09:00:00Z",
    createdAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "pay-12-05",
    periodId: "prd-12",
    memberId: "usr-05",
    amount: 150000,
    status: "PENDING",
    transferProofUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
    note: "Sudah ditransfer dari rekening BCA Bu Dewi Anggraini, mohon diverifikasi Bu Bendahara.",
    paidAt: "2026-06-05T11:45:00Z",
    createdAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "pay-12-06",
    periodId: "prd-12",
    memberId: "usr-06",
    amount: 150000,
    status: "UNPAID",
    note: "Menunggu pembayaran sebelum 15 Juni 2026",
    createdAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "pay-12-07",
    periodId: "prd-12",
    memberId: "usr-07",
    amount: 150000,
    status: "UNPAID",
    note: "Menunggu pembayaran",
    createdAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "pay-12-08",
    periodId: "prd-12",
    memberId: "usr-08",
    amount: 150000,
    status: "UNPAID",
    note: "Menunggu pembayaran",
    createdAt: "2026-06-01T00:00:00Z",
  },
];

export const initialSocialExpenses: SocialExpense[] = [
  {
    id: "exp-01",
    category: "SAKIT",
    recipientId: "usr-02",
    recipientName: "Ibu Ratna Kusuma",
    amount: 500000,
    expenseDate: "2026-05-18",
    description: "Santunan tali kasih rawat inap di RS Al-Islam Bandung akibat demam berdarah.",
    proofUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80",
    recordedByName: "Pak Agus Wijaya (Sekretaris)",
    isReviewed: true,
    reviewedByName: "Hj. Siti Aminah (Reviewer)",
    reviewedAt: "2026-05-20T10:00:00Z",
  },
  {
    id: "exp-02",
    category: "HADIAH",
    recipientId: "usr-01",
    recipientName: "Salsabila Sutrisno (Putri H. Bambang)",
    amount: 300000,
    expenseDate: "2026-04-25",
    description: "Hadiah kelulusan sarjana kedokteran Unpad dengan predikat cumlaude.",
    proofUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80",
    recordedByName: "Ibu Ratna Kusuma (Bendahara)",
    isReviewed: true,
    reviewedByName: "Hj. Siti Aminah (Reviewer)",
    reviewedAt: "2026-04-28T14:30:00Z",
  },
  {
    id: "exp-03",
    category: "BANTUAN",
    recipientId: "usr-06",
    recipientName: "Mas Eko Prasetyo",
    amount: 750000,
    expenseDate: "2026-06-01",
    description: "Bantuan perlengkapan bayi dan syukuran kelahiran putra pertama.",
    proofUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80",
    recordedByName: "Ibu Ratna Kusuma (Bendahara)",
    isReviewed: false,
  },
];

export const initialMeetings: ArisanMeeting[] = [
  {
    id: "meet-01",
    title: "Pertemuan Rutin & Kocokan Arisan Periode 12",
    hostMemberId: "usr-01",
    hostMemberName: "H. Bambang Sutrisno",
    address: "Jl. layur",
    latitude: -6.9175,
    longitude: 107.6191,
    scheduledAt: "2026-06-20T10:00:00Z",
    status: "PLANNED",
    notes: "Diharapkan hadir tepat waktu pukul 10:00 WIB. Acara dilanjutkan dengan makan siang bersama dan pengundian pemenang arisan periode 12.",
  },
  {
    id: "meet-02",
    title: "Pertemuan Halal Bihalal & Kocokan Periode 11",
    hostMemberId: "usr-03",
    hostMemberName: "Pak Agus Wijaya",
    address: "Jl. Anggrek No. 45, Riau, Bandung",
    latitude: -6.9125,
    longitude: 107.625,
    scheduledAt: "2026-05-20T09:30:00Z",
    status: "DONE",
    notes: "Alhamdulillah berjalan lancar, pemenang undian periode 11 adalah Bu Ratna Kusuma.",
  },
  {
    id: "meet-03",
    title: "Silaturahmi Keluarga & Kocokan Periode 10",
    hostMemberId: "usr-02",
    hostMemberName: "Ibu Ratna Kusuma",
    address: "Jl. Dago Atas No. 88, Coblong, Bandung",
    latitude: -6.885,
    longitude: 107.615,
    scheduledAt: "2026-04-18T13:00:00Z",
    status: "DONE",
    notes: "Pemenang undian adalah Mas Eko Prasetyo.",
  },
];

export const initialFamilyMembers: FamilyMember[] = [
  {
    id: "fam-01",
    userId: "usr-01",
    name: "Rina Marlina",
    relationship: "ISTRI",
    birthDate: "1972-02-28",
    gender: "Perempuan",
    notes: "Istri tercinta H. Bambang Sutrisno",
  },
  {
    id: "fam-02",
    userId: "usr-01",
    name: "Aditya Sutrisno",
    relationship: "ANAK",
    birthDate: "1998-08-12",
    gender: "Laki-laki",
    notes: "Anak pertama, berprofesi sebagai arsitek",
  },
  {
    id: "fam-03",
    userId: "usr-01",
    name: "Salsabila Sutrisno",
    relationship: "ANAK",
    birthDate: "2001-04-03",
    gender: "Perempuan",
    notes: "Anak kedua, dokter muda Unpad",
  },
  {
    id: "fam-04",
    userId: "usr-05",
    name: "Hendra Gunawan",
    relationship: "SUAMI",
    birthDate: "1984-04-12",
    gender: "Laki-laki",
    notes: "Suami Bu Dewi Anggraini",
  },
  {
    id: "fam-05",
    userId: "usr-05",
    name: "Kenzie Pratama",
    relationship: "ANAK",
    birthDate: "2015-06-20",
    gender: "Laki-laki",
    notes: "Anak sulung, kelas 4 SD",
  },
  {
    id: "fam-06",
    userId: "usr-05",
    name: "Aurel Putri",
    relationship: "ANAK",
    birthDate: "2019-10-15",
    gender: "Perempuan",
    notes: "Anak bungsu",
  },
  {
    id: "fam-07",
    userId: "usr-06",
    name: "Nabila Zahra",
    relationship: "ISTRI",
    birthDate: "1994-01-14",
    gender: "Perempuan",
    notes: "Istri Mas Eko Prasetyo",
  },
  {
    id: "fam-08",
    userId: "usr-06",
    name: "Raffasya Eko",
    relationship: "ANAK",
    birthDate: "2026-05-25",
    gender: "Laki-laki",
    notes: "Putra pertama baru lahir",
  },
];

export const initialSettings: AppSettings = {
  arisanName: "Arisan Sedulur Akur",
  bankName: "Bank Central Asia (BCA)",
  accountNumber: "8830-1928-4411",
  accountHolder: "Ibu Ratna Kusuma (Bendahara)",
  whatsappContact: "0812-3400-0011",
  monthlyAmount: 150000,
  arisanDescription:
    "Aplikasi resmi pengelolaan dana kas, iuran bulanan, santunan sosial, jadwal pertemuan, dan silaturahmi keluarga besar secara transparan dan akuntabel.",
};
