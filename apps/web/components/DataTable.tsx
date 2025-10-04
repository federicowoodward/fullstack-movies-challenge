"use client";

import clsx from "classnames";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

export interface Column<T> {
  key: Extract<keyof T, string>;
  header: string;
  className?: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  emptyLabel?: string;
}

export function DataTable<T>({
  data,
  columns,
  pageSize = 10,
  emptyLabel = "No records found",
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [data.length, pageSize]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={clsx(
                    "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-slate-50">
                  {columns.map((column) => {
                    const value = row[column.key];
                    return (
                      <td
                        key={column.key}
                        className={clsx(
                          "px-4 py-3 text-sm text-slate-800",
                          column.className
                        )}
                      >
                        {column.render
                          ? column.render(row)
                          : String(value ?? "")}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <div>
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            className="rounded border border-slate-200 px-3 py-1 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <button
            className="rounded border border-slate-200 px-3 py-1 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
