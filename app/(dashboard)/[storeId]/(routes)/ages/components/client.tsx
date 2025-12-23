"use client"

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { AgeColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { ApiList } from '@/components/ui/api-list'

interface AgeClientProps {
  data: AgeColumn[]
}

export const AgeClient: React.FC<AgeClientProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Ages (${data?.length})`} description="Manage ages for your store" />
        <Button onClick={() => router.push(`/${params.storeId}/ages/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API calls for Ages" />
      <Separator />
      <ApiList entityName="ages" entityIdName="ageId" />
    </>
  )
}

