import {
  pgTable,
  pgEnum,
  uuid,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
  doublePrecision,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// ===================== ENUM =====================
export const roleEnum = pgEnum("role_enum", [
  "SUPER_ADMIN",
  "ADMINISTRATOR",
  "REVIEWER",
  "ANGGOTA",
]);

export const positionEnum = pgEnum("position_enum", [
  "PEMBINA",
  "KETUA",
  "SEKRETARIS",
  "BENDAHARA",
  "ANGGOTA",
]);

export const paymentStatusEnum = pgEnum("payment_status_enum", [
  "UNPAID",
  "PENDING",
  "PAID",
]);

export const periodStatusEnum = pgEnum("period_status_enum", [
  "OPEN",
  "CLOSED",
]);

export const expenseCategoryEnum = pgEnum("expense_category_enum", [
  "SAKIT",
  "BANTUAN",
  "HADIAH",
  "LAINNYA",
]);

export const relationshipEnum = pgEnum("relationship_enum", [
  "SUAMI",
  "ISTRI",
  "ANAK",
  "BAPAK",
  "IBU",
  "SAUDARA",
  "LAINNYA",
]);

export const meetingStatusEnum = pgEnum("meeting_status_enum", [
  "PLANNED",
  "DONE",
  "CANCELLED",
]);

// ===================== USERS =====================
// Semua akun adalah anggota arisan.
// Role menentukan hak akses aplikasi, position menentukan jabatan di pohon arisan.
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  role: roleEnum("role").notNull().default("ANGGOTA"),
  position: positionEnum("position").notNull().default("ANGGOTA"),
  photoUrl: text("photo_url"),
  gender: varchar("gender", { length: 12 }),
  birthDate: timestamp("birth_date", { mode: "date" }),
  address: text("address"),
  occupation: varchar("occupation", { length: 150 }),
  parentId: uuid("parent_id").references((): any => users.id, {
    onDelete: "set null",
  }),
  isActive: boolean("is_active").notNull().default(true),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ===================== OTP WHATSAPP =====================
export const otpCodes = pgTable(
  "otp_codes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    phone: varchar("phone", { length: 20 }).notNull(),
    codeHash: text("code_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    attempts: integer("attempts").notNull().default(0),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("otp_phone_idx").on(table.phone)]
);

// ===================== PERIODE IURAN =====================
export const arisanPeriods = pgTable("arisan_periods", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  iuranAmount: integer("iuran_amount").notNull(),
  startDate: timestamp("start_date", { mode: "date" }).notNull(),
  dueDate: timestamp("due_date", { mode: "date" }).notNull(),
  endDate: timestamp("end_date", { mode: "date" }).notNull(),
  status: periodStatusEnum("status").notNull().default("OPEN"),
  description: text("description"),
  winnerMemberId: uuid("winner_member_id").references((): any => users.id),
  wonAt: timestamp("won_at", { withTimezone: true }),
  grossPrizeAmount: integer("gross_prize_amount"),
  deductionsAmount: integer("deductions_amount"),
  netPrizeAmount: integer("net_prize_amount"),
  cycleNumber: integer("cycle_number").default(1),
  createdById: uuid("created_by_id").references((): any => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ===================== PEMBAYARAN IURAN =====================
export const periodPayments = pgTable(
  "period_payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    periodId: uuid("period_id")
      .notNull()
      .references((): any => arisanPeriods.id, { onDelete: "cascade" }),
    memberId: uuid("member_id")
      .notNull()
      .references((): any => users.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    status: paymentStatusEnum("status").notNull().default("UNPAID"),
    transferProofUrl: text("transfer_proof_url"),
    note: text("note"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    verifiedById: uuid("verified_by_id").references((): any => users.id),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("period_payment_unique").on(table.periodId, table.memberId),
    index("payment_member_idx").on(table.memberId),
    index("payment_period_idx").on(table.periodId),
  ]
);

// ===================== BIAYA SOSIAL =====================
export const socialExpenses = pgTable("social_expenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  category: expenseCategoryEnum("category").notNull(),
  recipientId: uuid("recipient_id").references((): any => users.id),
  amount: integer("amount").notNull(),
  expenseDate: timestamp("expense_date", { mode: "date" }).notNull(),
  description: text("description").notNull(),
  proofUrl: text("proof_url"),
  recordedById: uuid("recorded_by_id").references((): any => users.id),
  reviewedById: uuid("reviewed_by_id").references((): any => users.id),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ===================== LOKASI / JADWAL ARISAN =====================
export const arisanMeetings = pgTable("arisan_meetings", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 150 }).notNull(),
  hostMemberId: uuid("host_member_id")
    .notNull()
    .references((): any => users.id),
  address: text("address").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
  status: meetingStatusEnum("status").notNull().default("PLANNED"),
  notes: text("notes"),
  createdById: uuid("created_by_id")
    .notNull()
    .references((): any => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ===================== KELUARGA BAHAGIA =====================
export const familyMembers = pgTable(
  "family_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references((): any => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    relationship: relationshipEnum("relationship").notNull(),
    photoUrl: text("photo_url"),
    birthDate: timestamp("birth_date", { mode: "date" }),
    gender: varchar("gender", { length: 12 }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("family_member_user_idx").on(table.userId)]
);

// ===================== PENGATURAN APLIKASI =====================
export const appSettings = pgTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
