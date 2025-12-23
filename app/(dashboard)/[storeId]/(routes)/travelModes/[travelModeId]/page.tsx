import prismadb from '@/lib/prismadb'
import { TravelModeForm } from './components/travel-mode-form'

const TravelModePage = async ({ params }: { params: Promise<{ travelModeId: string }> }) => {
  const { travelModeId } = await params
  const travelMode = await prismadb.size.findUnique({
    where: { id: travelModeId },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <TravelModeForm initialData={travelMode} />
      </div>
    </div>
  )
}

export default TravelModePage

