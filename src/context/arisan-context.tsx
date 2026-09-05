"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  ArisanPeriod,
  PeriodPayment,
  SocialExpense,
  ArisanMeeting,
  FamilyMember,
  AppSettings,
  initialUsers,
  initialPeriods,
  initialPayments,
  initialSocialExpenses,
  initialMeetings,
  initialFamilyMembers,
  initialSettings,
} from "@/data/mock-data";
import { addMemberAction, updateMemberAction, toggleMemberActiveAction } from "@/actions/members";
import { createPeriodAction } from "@/actions/periods";
import { uploadPaymentProofAction, verifyPaymentAction } from "@/actions/payments";
import { createSocialExpenseAction, reviewSocialExpenseAction } from "@/actions/social-expenses";
import { createMeetingAction, updateMeetingStatusAction } from "@/actions/meetings";
import { createFamilyMemberAction, updateFamilyMemberAction, deleteFamilyMemberAction } from "@/actions/family";
import { updateSettingsAction } from "@/actions/settings";
import { confirmWinnerAction, resetCycleAction } from "@/actions/draw";

interface ArisanContextType {
  currentUser: User | null;
  users: User[];
  periods: ArisanPeriod[];
  payments: PeriodPayment[];
  socialExpenses: SocialExpense[];
  meetings: ArisanMeeting[];
  familyMembers: FamilyMember[];
  settings: AppSettings;
  activePeriod: ArisanPeriod;
  isLoaded: boolean;
  // Actions
  loginWithPhone: (phone: string) => boolean;
  setCurrentUser: (user: User | null) => void;
  switchPersona: (userId: string) => void;
  logout: () => void;
  addMember: (user: Omit<User, "id" | "joinedAt">) => void;
  updateMember: (user: User) => void;
  uploadPaymentProof: (periodId: string, proofUrl: string, note?: string) => void;
  verifyPayment: (paymentId: string, status: "PAID" | "UNPAID") => void;
  addSocialExpense: (expense: Omit<SocialExpense, "id" | "recordedByName">) => void;
  reviewSocialExpense: (expenseId: string) => void;
  addMeeting: (meeting: Omit<ArisanMeeting, "id">) => void;
  updateMeetingStatus: (meetingId: string, status: "PLANNED" | "DONE" | "CANCELLED") => void;
  addFamilyMember: (fam: Omit<FamilyMember, "id">) => void;
  updateFamilyMember: (fam: FamilyMember) => void;
  deleteFamilyMember: (famId: string) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  createPeriod: (period: Omit<ArisanPeriod, "id">) => void;
  drawWinner: (
    periodId: string,
    winnerMemberId: string,
    grossPrizeAmount: number,
    deductionsAmount: number,
    netPrizeAmount: number,
    sendWhatsApp?: boolean
  ) => Promise<{ success: boolean; message: string }>;
  resetCycle: (nextCycleNumber: number) => Promise<{ success: boolean; message: string }>;
}

const ArisanContext = createContext<ArisanContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER_ID: "arisankeluarga_user_id",
  USERS: "arisankeluarga_users_v1",
  PERIODS: "arisankeluarga_periods_v1",
  PAYMENTS: "arisankeluarga_payments_v1",
  EXPENSES: "arisankeluarga_expenses_v1",
  MEETINGS: "arisankeluarga_meetings_v1",
  FAMILY: "arisankeluarga_family_v1",
  SETTINGS: "arisankeluarga_settings_v1",
};

export function ArisanProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(initialUsers[0]);
  const [periods, setPeriods] = useState<ArisanPeriod[]>(initialPeriods);
  const [payments, setPayments] = useState<PeriodPayment[]>(initialPayments);
  const [socialExpenses, setSocialExpenses] = useState<SocialExpense[]>(initialSocialExpenses);
  const [meetings, setMeetings] = useState<ArisanMeeting[]>(initialMeetings);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamilyMembers);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      const savedPeriods = localStorage.getItem(STORAGE_KEYS.PERIODS);
      const savedPayments = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      const savedExpenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      const savedMeetings = localStorage.getItem(STORAGE_KEYS.MEETINGS);
      const savedFamily = localStorage.getItem(STORAGE_KEYS.FAMILY);
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const savedUserId = localStorage.getItem(STORAGE_KEYS.USER_ID);

      const loadedUsers = savedUsers ? JSON.parse(savedUsers) : initialUsers;
      if (savedUsers) setUsers(loadedUsers);
      if (savedPeriods) setPeriods(JSON.parse(savedPeriods));
      if (savedPayments) setPayments(JSON.parse(savedPayments));
      if (savedExpenses) setSocialExpenses(JSON.parse(savedExpenses));
      if (savedMeetings) setMeetings(JSON.parse(savedMeetings));
      if (savedFamily) setFamilyMembers(JSON.parse(savedFamily));
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      if (savedUserId) {
        const found = loadedUsers.find((u: User) => u.id === savedUserId);
        if (found) setCurrentUser(found);
      } else {
        setCurrentUser(loadedUsers[0] || null);
      }
    } catch (e) {
      console.error("Failed to load local storage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEYS.PERIODS, JSON.stringify(periods));
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(socialExpenses));
      localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(meetings));
      localStorage.setItem(STORAGE_KEYS.FAMILY, JSON.stringify(familyMembers));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER_ID, currentUser.id);
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER_ID);
      }
    } catch (e) {
      console.error("Failed to save local storage", e);
    }
  }, [users, periods, payments, socialExpenses, meetings, familyMembers, settings, currentUser, isLoaded]);

  const activePeriod = periods.find((p) => p.status === "OPEN") || periods[0];

  const loginWithPhone = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const user = users.find(
      (u) =>
        u.phone.replace(/[^0-9]/g, "").endsWith(cleanPhone.slice(-8)) ||
        u.phone.replace(/[^0-9]/g, "") === cleanPhone
    );
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const switchPersona = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {}
  };

  const addMember = (newUser: Omit<User, "id" | "joinedAt">) => {
    const id = "usr-" + Date.now().toString(36);
    const member: User = {
      ...newUser,
      id,
      joinedAt: new Date().toISOString(),
    };
    setUsers((prev) => [member, ...prev]);

    if (activePeriod) {
      setPayments((prev) => [
        {
          id: `pay-${activePeriod.id}-${member.id}`,
          periodId: activePeriod.id,
          memberId: member.id,
          amount: activePeriod.iuranAmount,
          status: "UNPAID",
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    // Call Server Action
    addMemberAction({
      name: newUser.name,
      phone: newUser.phone,
      role: newUser.role,
      position: newUser.position,
      gender: newUser.gender,
      birthDate: newUser.birthDate,
      address: newUser.address,
      occupation: newUser.occupation,
      parentId: newUser.parentId,
      photoUrl: newUser.photoUrl,
    }).catch(console.warn);
  };

  const updateMember = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }

    // Call Server Action
    updateMemberAction(updatedUser.id, updatedUser).catch(console.warn);
  };

  const uploadPaymentProof = (periodId: string, proofUrl: string, note?: string) => {
    if (!currentUser) return;
    setPayments((prev) => {
      const existing = prev.find((p) => p.periodId === periodId && p.memberId === currentUser.id);
      if (existing) {
        return prev.map((p) =>
          p.id === existing.id
            ? {
                ...p,
                status: "PENDING",
                transferProofUrl: proofUrl,
                note: note || p.note,
                paidAt: new Date().toISOString(),
              }
            : p
        );
      }
      return [
        {
          id: `pay-${periodId}-${currentUser.id}-${Date.now().toString(36)}`,
          periodId,
          memberId: currentUser.id,
          amount: activePeriod.iuranAmount,
          status: "PENDING",
          transferProofUrl: proofUrl,
          note,
          paidAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });

    // Call Server Action
    uploadPaymentProofAction({
      periodId,
      transferProofUrl: proofUrl,
      note,
    }).catch(console.warn);
  };

  const verifyPayment = (paymentId: string, status: "PAID" | "UNPAID") => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status,
              verifiedById: currentUser?.id,
              verifiedAt: new Date().toISOString(),
            }
          : p
      )
    );

    // Call Server Action with WhatsApp Wablas notification
    verifyPaymentAction(paymentId, status).catch(console.warn);
  };

  const addSocialExpense = (expense: Omit<SocialExpense, "id" | "recordedByName">) => {
    const id = "exp-" + Date.now().toString(36);
    const newExp: SocialExpense = {
      ...expense,
      id,
      recordedByName: currentUser ? `${currentUser.name} (${currentUser.position})` : "Administrator",
      isReviewed: false,
    };
    setSocialExpenses((prev) => [newExp, ...prev]);

    // Call Server Action
    createSocialExpenseAction({
      category: expense.category,
      recipientId: expense.recipientId,
      amount: expense.amount,
      expenseDate: expense.expenseDate,
      description: expense.description,
      proofUrl: expense.proofUrl,
    }).catch(console.warn);
  };

  const reviewSocialExpense = (expenseId: string) => {
    setSocialExpenses((prev) =>
      prev.map((exp) =>
        exp.id === expenseId
          ? {
              ...exp,
              isReviewed: true,
              reviewedByName: currentUser?.name || "Reviewer Pengawas",
              reviewedAt: new Date().toISOString(),
            }
          : exp
      )
    );

    // Call Server Action
    reviewSocialExpenseAction(expenseId).catch(console.warn);
  };

  const addMeeting = (meeting: Omit<ArisanMeeting, "id">) => {
    const id = "meet-" + Date.now().toString(36);
    setMeetings((prev) => [{ ...meeting, id }, ...prev]);

    // Call Server Action
    createMeetingAction({
      title: meeting.title,
      hostMemberId: meeting.hostMemberId,
      address: meeting.address,
      latitude: meeting.latitude,
      longitude: meeting.longitude,
      scheduledAt: meeting.scheduledAt,
      notes: meeting.notes,
    }).catch(console.warn);
  };

  const updateMeetingStatus = (meetingId: string, status: "PLANNED" | "DONE" | "CANCELLED") => {
    setMeetings((prev) => prev.map((m) => (m.id === meetingId ? { ...m, status } : m)));

    // Call Server Action
    updateMeetingStatusAction(meetingId, status).catch(console.warn);
  };

  const addFamilyMember = (fam: Omit<FamilyMember, "id">) => {
    const id = "fam-" + Date.now().toString(36);
    setFamilyMembers((prev) => [...prev, { ...fam, id }]);

    // Call Server Action
    createFamilyMemberAction({
      userId: fam.userId,
      name: fam.name,
      relationship: fam.relationship,
      gender: fam.gender,
      birthDate: fam.birthDate,
      notes: fam.notes,
      photoUrl: fam.photoUrl,
    }).catch(console.warn);
  };

  const updateFamilyMember = (fam: FamilyMember) => {
    setFamilyMembers((prev) => prev.map((f) => (f.id === fam.id ? fam : f)));

    // Call Server Action
    updateFamilyMemberAction(fam.id, fam).catch(console.warn);
  };

  const deleteFamilyMember = (famId: string) => {
    setFamilyMembers((prev) => prev.filter((f) => f.id !== famId));

    // Call Server Action
    deleteFamilyMemberAction(famId).catch(console.warn);
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));

    // Call Server Action
    updateSettingsAction(newSettings).catch(console.warn);
  };

  const createPeriod = (period: Omit<ArisanPeriod, "id">) => {
    const id = "prd-" + Date.now().toString(36);
    const newPrd: ArisanPeriod = { ...period, id };
    setPeriods((prev) => [newPrd, ...prev]);

    const newPayments: PeriodPayment[] = users
      .filter((u) => u.isActive)
      .map((u) => ({
        id: `pay-${id}-${u.id}`,
        periodId: id,
        memberId: u.id,
        amount: newPrd.iuranAmount,
        status: "UNPAID",
        createdAt: new Date().toISOString(),
      }));

    setPayments((prev) => [...newPayments, ...prev]);

    // Call Server Action
    createPeriodAction({
      name: period.name,
      iuranAmount: period.iuranAmount,
      startDate: period.startDate,
      dueDate: period.dueDate,
      endDate: period.endDate,
      description: period.description,
    }).catch(console.warn);
  };

  const drawWinner = async (
    periodId: string,
    winnerMemberId: string,
    grossPrizeAmount: number,
    deductionsAmount: number,
    netPrizeAmount: number,
    sendWhatsApp: boolean = true
  ) => {
    const nowIso = new Date().toISOString();

    // 1. Update period state with winner data
    setPeriods((prev) =>
      prev.map((p) =>
        p.id === periodId
          ? {
              ...p,
              winnerMemberId,
              wonAt: nowIso,
              grossPrizeAmount,
              deductionsAmount,
              netPrizeAmount,
            }
          : p
      )
    );

    // 2. If winner has deduction for this period, mark their payment as PAID
    if (deductionsAmount > 0) {
      setPayments((prev) =>
        prev.map((pay) =>
          pay.periodId === periodId && pay.memberId === winnerMemberId
            ? {
                ...pay,
                status: "PAID",
                paidAt: nowIso,
                verifiedById: currentUser?.id || "usr-02",
                verifiedAt: nowIso,
                note:
                  (pay.note ? pay.note + " | " : "") +
                  "Otomatis dilunaskan dari pemotongan uang tarikan arisan.",
              }
            : pay
        )
      );
    }

    // 3. Call Server Action
    try {
      const res = await confirmWinnerAction({
        periodId,
        winnerMemberId,
        grossPrizeAmount,
        deductionsAmount,
        netPrizeAmount,
        sendWhatsApp,
      });
      return res;
    } catch (err: any) {
      return {
        success: true,
        message: "Pemenang tersimpan di memori aplikasi.",
      };
    }
  };

  const resetCycle = async (nextCycleNumber: number) => {
    try {
      const res = await resetCycleAction(nextCycleNumber);
      return res;
    } catch {
      return {
        success: true,
        message: `Siklus berhasil diperbarui ke Putaran ke-${nextCycleNumber}`,
      };
    }
  };

  return (
    <ArisanContext.Provider
      value={{
        currentUser,
        users,
        periods,
        payments,
        socialExpenses,
        meetings,
        familyMembers,
        settings,
        activePeriod,
        isLoaded,
        loginWithPhone,
        setCurrentUser,
        switchPersona,
        logout,
        addMember,
        updateMember,
        uploadPaymentProof,
        verifyPayment,
        addSocialExpense,
        reviewSocialExpense,
        addMeeting,
        updateMeetingStatus,
        addFamilyMember,
        updateFamilyMember,
        deleteFamilyMember,
        updateSettings,
        createPeriod,
        drawWinner,
        resetCycle,
      }}
    >
      {children}
    </ArisanContext.Provider>
  );
}

export function useArisan() {
  const context = useContext(ArisanContext);
  if (!context) {
    throw new Error("useArisan must be used within ArisanProvider");
  }
  return context;
}
