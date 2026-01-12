"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";

import { OrderColumn } from "./columns";

interface CellActionProps {
  data: OrderColumn;
}

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);

  const onStatusChange = async (newStatus: string) => {
    try {
      setLoading(true);
      await axios.patch(`/api/${params.storeId}/orders/${data.id}`, {
        status: newStatus,
      });
      toast.success(`Order status updated to ${newStatus}`);
      router.refresh();
    } catch (error: any) {
      toast.error("Failed to update order status");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-normal text-gray-500">
          Update Status
        </DropdownMenuLabel>
        {STATUS_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            disabled={loading || data.status === option.value}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
