import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

export const getSalesCount = unstable_cache(
    async (storeId: string) => {
        const salesCount = await prismadb.order.count({
            where: {
                storeId,
                isPaid: true,
            }
        });

        return salesCount;
    },
    ["sales-count"],
    { revalidate: 300, tags: ["orders"] }
);