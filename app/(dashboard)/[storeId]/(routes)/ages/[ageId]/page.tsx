import prismadb from '@/lib/prismadb'
import { AgeForm } from './components/age-form'

const AgePage = async ({ params }: { params: Promise<{ ageId: string }> }) => {
  const { ageId } = await params
  const age = await prismadb.age.findUnique({
    where: {
      id: ageId,
    },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <AgeForm initialData={age} />
      </div>
    </div>
  )
}

export default AgePage

