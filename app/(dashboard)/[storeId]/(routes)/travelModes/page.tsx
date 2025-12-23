import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { TravelModeClient } from './components/client'
import { TravelModeColumn } from './components/columns'

export const revalidate = 60

const TravelModesPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>
}) => {
  const { storeId } = await params
  const travelModes = await prismadb.size.findMany({
    where: { storeId },
    orderBy: { createdAt: 'desc' },
  })

  const formattedTravelModes: TravelModeColumn[] = travelModes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <TravelModeClient data={formattedTravelModes} />
      </div>
    </div>
  )
}

export default TravelModesPage

