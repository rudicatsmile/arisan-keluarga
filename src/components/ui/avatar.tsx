import * as React from "react";
import { cn } from "@/lib/utils";

export function Avatar({
  className,
  src,
  alt = "Avatar",
  fallback,
  size = "default",
}: {
  className?: string;
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "sm" | "default" | "lg" | "xl";
}) {
  const [hasError, setHasError] = React.useState(false);

  const sizes = {
    sm: "h-8 w-8 text-xs",
    default: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
    xl: "h-20 w-20 text-2xl",
  };

  const getInitials = (text?: string) => {
    if (!text) return "AK";
    const parts = text.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 items-center justify-center font-semibold text-slate-700 select-none shadow-xs",
        sizes[size],
        className
      )}
    >
      {src && !hasError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <span>{fallback ? getInitials(fallback) : "AK"}</span>
      )}
    </div>
  );
}

export function Label({
  className,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-sm font-medium leading-none text-slate-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none", className)}
      {...props}
    >
      {children}
    </label>
  );
}
