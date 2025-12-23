import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { AgeClient } from './components/client'
import { AgeColumn } from './components/columns'

export const revalidate = 60

const AgesPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>
}) => {
  const { storeId } = await params
  const ages = await prismadb.age.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedAges: AgeColumn[] = ages.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <AgeClient data={formattedAges} />
      </div>
    </div>
  )
}

export default AgesPage

