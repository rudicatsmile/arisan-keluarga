"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined);

export function Dialog({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {open && children}
    </DialogContext.Provider>
  );
}

export function DialogContent({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error("DialogContent must be used within Dialog");

  // Close on Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") context.onOpenChange(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [context]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => context.onOpenChange(false)}
      />
      {/* Modal Box */}
      <div
        className={cn(
          "relative z-50 w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl transition-all animate-in zoom-in-95 max-h-[90vh] overflow-y-auto",
          className
        )}
      >
        <button
          onClick={() => context.onOpenChange(false)}
          className="absolute right-4 top-4 rounded-md p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Tutup"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-4", className)}
      {...props}
    />
  );
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-lg font-semibold leading-none tracking-tight text-slate-900", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-slate-500", className)}
      {...props}
    />
  );
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-6", className)}
      {...props}
    />
  );
}
