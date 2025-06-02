import  { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/action/auth.action'

const layout = async({children}:{children: ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated()

  if(isUserAuthenticated) redirect('/')
  
  return (
    <div>
     {children}
    </div>
  )
}

export default layout
