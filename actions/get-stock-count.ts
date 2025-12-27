import prismadb from "@/lib/prismadb";

export const getStockCount = async (storeId: string) => {
    const salesCount = await prismadb.product.count({
        where: {
            storeId,
        }
    });
    console.log("Stock Count for storeId", storeId, "is", salesCount);

    return salesCount;
}