import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

export const getStockCount = unstable_cache(
    async (storeId: string) => {
        const stockCount = await prismadb.product.count({
            where: {
                storeId,
            }
        });

        return stockCount;
    },
    ["stock-count"],
    { revalidate: 300, tags: ["products"] }
);