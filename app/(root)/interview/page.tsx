import React from 'react'
import Agent from '@/component/UI/Agent'
import { getCurrentUser } from '@/lib/action/auth.action'

const page = async() => {
  const user = await getCurrentUser()
  return (
    <>
      <h3 className='m-10 '>Interview Generation</h3>

      <Agent userName={user?.name} userId={user?.id} type="generate" />
    </>
  )
}

export default page
