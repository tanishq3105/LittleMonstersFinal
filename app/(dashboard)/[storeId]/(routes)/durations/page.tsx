import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { DurationClient } from './components/client'
import { DurationColumn } from './components/columns'

export const revalidate = 60

const DurationsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>
}) => {
  const { storeId } = await params
  const durations = await prismadb.duration.findMany({
    where: { storeId },
    orderBy: { createdAt: 'desc' },
  })

  const formattedDurations: DurationColumn[] = durations.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <DurationClient data={formattedDurations} />
      </div>
    </div>
  )
}

export default DurationsPage

