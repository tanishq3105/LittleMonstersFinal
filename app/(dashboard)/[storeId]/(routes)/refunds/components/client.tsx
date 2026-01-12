"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { RefundColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface RefundClientProps {
  data: RefundColumn[];
}

export const RefundClient: React.FC<RefundClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Refund Requests (${data?.length})`}
        description="Manage refund requests for your store"
      />
      <Separator />
      <DataTable columns={columns} data={data} searchKey="customerEmail" />
    </>
  );
};
