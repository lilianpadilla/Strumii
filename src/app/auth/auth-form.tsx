"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

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
}

export function AuthCard({
  title,
  children,
  successMsg,
  errorMsg,
  footer,
  className,
}: AuthCardProps) {
  // Internal toast queue (very small + simple)
  const idRef = useRef(0);

  useEffect(() => {
    if (errorMsg) toast.error(errorMsg);
  }, [errorMsg]);

  useEffect(() => {
    if (successMsg) toast.success(successMsg);
  }, [successMsg]);

  return (
    <div className="flex justify-center items-center h-[60vh] md:h-[90vh]">
      <div className={`p-6 max-w-md rounded-2xl border border-neutral ${className ?? ""}`}>
        {title && <h2 className="mb-4 text-xl font-bold">{title}</h2>}
        {children}
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
}