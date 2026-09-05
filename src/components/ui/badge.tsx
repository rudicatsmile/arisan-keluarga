import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "lunas" | "menunggu" | "belum" | "jadwal" | "selesai" | "admin";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-blue-600 text-white",
    secondary: "border-transparent bg-slate-100 text-slate-800",
    destructive: "border-transparent bg-rose-600 text-white",
    outline: "text-slate-800 border-slate-300",
    // Status Arisan
    lunas: "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold",
    menunggu: "bg-amber-50 text-amber-700 border-amber-200 font-semibold",
    belum: "bg-rose-50 text-rose-700 border-rose-200 font-semibold",
    jadwal: "bg-blue-50 text-blue-700 border-blue-200 font-semibold",
    selesai: "bg-slate-100 text-slate-700 border-slate-200 font-semibold",
    admin: "bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
