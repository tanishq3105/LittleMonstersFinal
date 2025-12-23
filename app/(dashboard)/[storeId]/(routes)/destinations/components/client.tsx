"use client"

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { DestinationColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { ApiList } from '@/components/ui/api-list'

interface DestinationClientProps {
  data: DestinationColumn[]
}

export const DestinationClient: React.FC<DestinationClientProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Destinations (${data?.length})`} description="Manage destinations for your store" />
        <Button onClick={() => router.push(`/${params.storeId}/destinations/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API calls for Destinations" />
      <Separator />
      <ApiList entityName="destinations" entityIdName="destinationId" />
    </>
  )
}

