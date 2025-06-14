import { getInterviewById } from '@/lib/action/general.action'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async({params}: RouteParams) => {
  const {id} = await params
  const interview = await getInterviewById(id)

  if(!interview) redirect('/')
  return (
    <div>
      
    </div>
  )
}

export default page
