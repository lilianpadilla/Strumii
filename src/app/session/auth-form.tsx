"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * Lightweight, reusable auth card that accepts arbitrary children.
 * Provides DaisyUI-style toast notifications for error/success messages.
 */

type ToastItem = {
  id: number;
  type: "success" | "error";
  message: string;
  fading?: boolean;
};
export interface AuthCardProps {
  title?: string;
  children: React.ReactNode;
  /** Pass strings to trigger toasts (they auto-dismiss). */
  successMsg?: string | null;
  errorMsg?: string | null;
  /** Optional footer (e.g., links) */
  footer?: React.ReactNode;
  /** Extra classes for the inner card */
  className?: string;
  /** Called when a toast is dismissed. Useful for clearing your local state. */
  onToastDismiss?: (type: "success" | "error") => void;
}

export function AuthCard({
  title,
  children,
  successMsg,
  errorMsg,
  footer,
  className,
  onToastDismiss,
}: AuthCardProps) {
  // Internal toast queue (very small + simple)
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  function pushToast(type: ToastItem["type"], message: string) {
  const id = ++idRef.current;
  setToasts((t) => [...t, { id, type, message, fading: false }]);

  // Start fade-out 3.5s in, then remove after 0.5s
  setTimeout(() => {
    setToasts((t) =>
      t.map((toast) =>
        toast.id === id ? { ...toast, fading: true } : toast
      )
    );

    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
      onToastDismiss?.(type);
    }, 500); // matches fade duration
  }, 3500);
}

  useEffect(() => {
    if (errorMsg) pushToast("error", errorMsg);
  }, [errorMsg]);

  useEffect(() => {
    if (successMsg) pushToast("success", successMsg);
  }, [successMsg]);

  return (
    <div className="flex justify-center items-center h-[60vh] md:h-[90vh]">
      {/* Toasts (DaisyUI) */}
      <div className="toast toast-bottom toast-end z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`alert ${
              t.type === "success" ? "alert-success" : "alert-error"
            } transition-opacity duration-500 ${t.fading ? "opacity-0" : "opacity-100"}`}
          >
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      <div className={`p-6 w-[95%] max-w-md rounded-2xl border border-neutral ${className ?? ""}`}>
        {title && <h2 className="mb-4 text-xl font-bold">{title}</h2>}
        {children}
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
}