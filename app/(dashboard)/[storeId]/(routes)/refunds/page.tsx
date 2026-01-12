import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { RefundClient } from "./components/client";
import { RefundColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

export const revalidate = 60;

const RefundsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  const refundRequests = await prismadb.refundRequest.findMany({
    where: {
      order: {
        storeId: storeId,
      },
    },
    include: {
      order: {
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedRefunds: RefundColumn[] = refundRequests.map((item) => ({
    id: item.id,
    orderId: item.orderId,
    orderNumber: item.orderId.slice(0, 8),
    customerName: item.order.name,
    customerEmail: item.order.email,
    customerPhone: item.order.phone,
    reason: item.reason,
    status: item.status,
    adminNote: item.adminNote || "",
    products: item.order.orderItems
      .map(
        (orderItem) =>
          `${orderItem.product.name}${
            orderItem.quantity > 1 ? ` (x${orderItem.quantity})` : ""
          }`
      )
      .join(", "),
    totalPrice: formatter.format(
      item.order.orderItems.reduce(
        (total, orderItem) =>
          total + Number(orderItem.product.price) * orderItem.quantity,
        0
      )
    ),
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <RefundClient data={formattedRefunds} />
      </div>
    </div>
  );
};

export default RefundsPage;
