import prismadb from '@/lib/prismadb'
import { DurationForm } from './components/duration-form'

const DurationPage = async ({ params }: { params: Promise<{ durationId: string }> }) => {
  const { durationId } = await params
  const duration = await prismadb.duration.findUnique({
    where: { id: durationId },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <DurationForm initialData={duration} />
      </div>
    </div>
  )
}

export default DurationPage

