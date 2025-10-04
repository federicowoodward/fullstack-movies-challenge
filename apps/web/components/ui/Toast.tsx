"use client";

import clsx from "classnames";
import { PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type ToastVariant = "info" | "success" | "error";

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (options: { title: string; description?: string; variant?: ToastVariant; duration?: number }) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const variantStyles: Record<ToastVariant, string> = {
  info: "border-slate-200 bg-white text-slate-900",
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
};

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback(
    ({ title, description, variant = "info", duration = 3000 }: { title: string; description?: string; variant?: ToastVariant; duration?: number }) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setToasts((items) => [...items, { id, title, description, variant }]);
      window.setTimeout(() => {
        setToasts((items) => items.filter((item) => item.id !== id));
      }, duration);
    },
    []
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div className="pointer-events-none fixed bottom-4 right-4 flex w-80 flex-col gap-3">
            {toasts.map((toastItem) => (
              <div
                key={toastItem.id}
                className={clsx(
                  "pointer-events-auto rounded-lg border px-4 py-3 shadow-lg transition-all",
                  variantStyles[toastItem.variant]
                )}
              >
                <p className="text-sm font-semibold">{toastItem.title}</p>
                {toastItem.description ? <p className="mt-1 text-sm opacity-80">{toastItem.description}</p> : null}
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context.toast;
}
