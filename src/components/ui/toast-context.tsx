"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  toast: (options: { title: string; description?: string; type?: ToastType }) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ title, description, type = "info" }: { title: string; description?: string; type?: ToastType }) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, description, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const success = useCallback((title: string, description?: string) => addToast({ title, description, type: "success" }), [addToast]);
  const error = useCallback((title: string, description?: string) => addToast({ title, description, type: "error" }), [addToast]);
  const info = useCallback((title: string, description?: string) => addToast({ title, description, type: "info" }), [addToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info }}>
      {children}
      {/* Toast Overlay */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none p-4">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg transition-all animate-in slide-in-from-bottom-5 duration-200 bg-white",
              item.type === "success" && "border-emerald-200 bg-emerald-50/90 text-emerald-900",
              item.type === "error" && "border-rose-200 bg-rose-50/90 text-rose-900",
              item.type === "info" && "border-blue-200 bg-blue-50/90 text-blue-900"
            )}
          >
            {item.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />}
            {item.type === "error" && <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />}
            {item.type === "info" && <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />}

            <div className="flex-1">
              <p className="text-sm font-semibold leading-tight">{item.title}</p>
              {item.description && <p className="text-xs mt-1 opacity-85 leading-relaxed">{item.description}</p>}
            </div>

            <button
              onClick={() => removeToast(item.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-md"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
