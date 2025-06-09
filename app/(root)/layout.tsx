import { ReactNode } from "react"
import Link from "next/link"  
import Image from "next/image"
import { isAuthenticated } from "@/lib/action/auth.action"
import { redirect } from "next/navigation"

const RootLayout = async({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated()

  if(!isUserAuthenticated) redirect('/sign-in')
  return (
    <div className="root-Layout">
      <nav>
        <Link href='/' className='flex item-centre gap-2'/>
      </nav>
      {children}
    </div>
  )
}

export default RootLayout
