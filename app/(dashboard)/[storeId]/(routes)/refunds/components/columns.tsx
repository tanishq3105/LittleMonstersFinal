"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type RefundColumn = {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reason: string;
  status: string;
  adminNote: string;
  products: string;
  totalPrice: string;
  createdAt: string;
};

export const columns: ColumnDef<RefundColumn>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order #",
  },
  {
    accessorKey: "customerName",
    header: "Customer",
  },
  {
    accessorKey: "customerEmail",
    header: "Email",
  },
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "totalPrice",
    header: "Amount",
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <span
        className="max-w-[200px] truncate block"
        title={row.original.reason}
      >
        {row.original.reason}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const colorMap: Record<string, string> = {
        PENDING: "bg-yellow-100 text-yellow-800",
        APPROVED: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
        PROCESSED: "bg-blue-100 text-blue-800",
      };
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            colorMap[status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
