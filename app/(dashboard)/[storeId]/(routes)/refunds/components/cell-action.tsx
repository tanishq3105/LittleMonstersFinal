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
import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  DollarSign,
} from "lucide-react";

import { RefundColumn } from "./columns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CellActionProps {
  data: RefundColumn;
}

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending", icon: MoreHorizontal },
  { value: "APPROVED", label: "Approved", icon: CheckCircle },
  { value: "REJECTED", label: "Rejected", icon: XCircle },
  { value: "PROCESSED", label: "Processed (Refunded)", icon: DollarSign },
];

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [adminNote, setAdminNote] = useState(data.adminNote || "");
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const onStatusChange = async (newStatus: string) => {
    setPendingStatus(newStatus);
    setNoteOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatus) return;

    try {
      setLoading(true);
      await axios.patch(`/api/${params.storeId}/refunds/${data.id}`, {
        status: pendingStatus,
        adminNote: adminNote,
      });
      toast.success(`Refund status updated to ${pendingStatus}`);
      setNoteOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error("Failed to update refund status");
      console.error(error);
    } finally {
      setLoading(false);
      setPendingStatus(null);
    }
  };

  return (
    <>
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Refund Request Details</DialogTitle>
            <DialogDescription>Order #{data.orderNumber}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-500">Customer Name</Label>
                <p className="font-medium">{data.customerName}</p>
              </div>
              <div>
                <Label className="text-gray-500">Email</Label>
                <p className="font-medium">{data.customerEmail}</p>
              </div>
              <div>
                <Label className="text-gray-500">Phone</Label>
                <p className="font-medium">{data.customerPhone}</p>
              </div>
              <div>
                <Label className="text-gray-500">Amount</Label>
                <p className="font-medium">{data.totalPrice}</p>
              </div>
            </div>
            <div>
              <Label className="text-gray-500">Products</Label>
              <p className="font-medium">{data.products}</p>
            </div>
            <div>
              <Label className="text-gray-500">Refund Reason</Label>
              <p className="font-medium p-3 bg-gray-50 rounded-md">
                {data.reason}
              </p>
            </div>
            {data.adminNote && (
              <div>
                <Label className="text-gray-500">Admin Note</Label>
                <p className="font-medium p-3 bg-blue-50 rounded-md">
                  {data.adminNote}
                </p>
              </div>
            )}
            <div>
              <Label className="text-gray-500">Status</Label>
              <p className="font-medium">{data.status}</p>
            </div>
            <div>
              <Label className="text-gray-500">Requested On</Label>
              <p className="font-medium">{data.createdAt}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Refund Status</DialogTitle>
            <DialogDescription>
              Change status to: {pendingStatus}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="adminNote">Admin Note (Optional)</Label>
              <Textarea
                id="adminNote"
                placeholder="Add a note about this refund decision..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNoteOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={confirmStatusChange} disabled={loading}>
              {loading ? "Updating..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
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
              <option.icon className="mr-2 h-4 w-4" />
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
