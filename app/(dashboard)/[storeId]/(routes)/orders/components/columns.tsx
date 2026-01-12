"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  paymentMethod: string;
  status: string;
  totalPrice: string;
  products: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment",
    cell: ({ row }) => (
      <span
        className={
          row.original.paymentMethod === "COD"
            ? "text-orange-600 font-medium"
            : "text-green-600 font-medium"
        }
      >
        {row.original.paymentMethod}
      </span>
    ),
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  {
    accessorKey: "status",
    header: "Status",
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
