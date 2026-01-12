import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";

const ProductPage = async ({
  params,
}: {
  params: Promise<{ productId: string; storeId: string }>;
}) => {
  const { storeId, productId } = await params;

  // Run all queries in parallel for better performance
  const [product, categories, sizes, durations, ages, destinations, colors] =
    await Promise.all([
      prismadb.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          images: true,
        },
      }),
      prismadb.category.findMany({
        where: {
          storeId: storeId,
        },
      }),
      prismadb.size.findMany({
        where: {
          storeId: storeId,
        },
      }),
      prismadb.duration.findMany({
        where: {
          storeId,
        },
      }),
      prismadb.age.findMany({
        where: {
          storeId,
        },
      }),
      prismadb.destination.findMany({
        where: {
          storeId,
        },
      }),
      prismadb.color.findMany({
        where: {
          storeId: storeId,
        },
      }),
    ]);

  const safeProduct = product
    ? {
        ...product,
        price: Number(product.price), // Decimal → number, all other keys preserved
      }
    : null;

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ProductForm
          initialData={safeProduct}
          colors={colors}
          sizes={sizes}
          durations={durations}
          ages={ages}
          destinations={destinations}
          categories={categories}
        />
      </div>
    </div>
  );
};

export default ProductPage;
