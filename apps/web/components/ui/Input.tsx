"use client";

import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import clsx from "classnames";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx(
        "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
