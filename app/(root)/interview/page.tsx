import React from 'react'
import Agent from '@/component/UI/Agent'
const page = () => {
  return (
    <>
      <h3>Interview Generation</h3>

      <Agent userName="You" userId='user1' type="generate" />
    </>
  )
}

export default page
