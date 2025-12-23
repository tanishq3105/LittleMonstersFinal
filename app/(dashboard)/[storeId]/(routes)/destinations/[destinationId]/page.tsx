import prismadb from '@/lib/prismadb'
import { DestinationForm } from './components/destination-form'

const DestinationPage = async ({ params }: { params: Promise<{ destinationId: string }> }) => {
  const { destinationId } = await params
  const destination = await prismadb.destination.findUnique({
    where: { id: destinationId },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <DestinationForm initialData={destination} />
      </div>
    </div>
  )
}

export default DestinationPage

