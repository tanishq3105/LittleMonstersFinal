import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { DestinationClient } from './components/client'
import { DestinationColumn } from './components/columns'

export const revalidate = 60

const DestinationsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>
}) => {
  const { storeId } = await params
  const destinations = await prismadb.destination.findMany({
    where: { storeId },
    orderBy: { createdAt: 'desc' },
  })

  const formattedDestinations: DestinationColumn[] = destinations.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <DestinationClient data={formattedDestinations} />
      </div>
    </div>
  )
}

export default DestinationsPage

