"use client"
import React from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import FormField from './FormField'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase/client'
import { signUp, signIn } from '@/lib/action/auth.action'




const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  })
}


const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter()
  const formSchema = authFormSchema(type)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    try {
      if (type === 'sign-up') {
        const {name, email, password} = values

        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
        
        const result = await signUp({
          uid: userCredentials.user.uid,
          name:name!,
          email, 
          password
        })

        if(result?.success){
          toast.error(result?.message)
          return
        }
        toast.success('Account created sucessfully, Please Sign IN')
        router.push('/sign-in')
      } else {
        const {email, password} = values

        const userCredentials =await signInWithEmailAndPassword(auth,email, password)

        const idToken = await userCredentials.user.getIdToken()

        if(!idToken){
          toast.error('Sign in failed')
          return
        }
        
        await signIn({
          email, idToken
        })

        toast.success('Sing in sucessfully.')
        router.push('/')
      }
      
    } catch (error) {
      console.log(error)
      toast.error(`there was an error: ${error}`)

    }
  }


  const isSignIn = type === 'sign-in'


  return (
    <div className="w-full max-w-[566px] mx-auto px-4 sm:px-6">
      <div className='flex flex-col gap-8 card py-8 sm:py-12 px-6 sm:px-10'>
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/logo.png"
            alt="logo"
            height={1000}
            width={1000}
            className="w-48 h-32 sm:w-64 sm:h-42 object-contain"
            priority
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-light-100">Practice job interview with AI</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
            {!isSignIn && (
              <FormField
                control={form.control}
                name='name'
                label='Name'
                placeholder='Your name'
              />
            )}
            <FormField
              control={form.control}
              name='email'
              label='Email'
              placeholder='Your email address'
              type='email'
            />
            <FormField
              control={form.control}
              name='password'
              label='Password'
              placeholder='Enter your Password' 
              type='password'
            />
            <Button 
              type="submit" 
              className="w-full py-6 text-base font-bold bg-primary-200 text-dark-100 hover:bg-primary-200/80 rounded-full"
            >
              {isSignIn ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm sm:text-base text-light-100">
          {isSignIn ? 'No account yet?' : 'Have an account already?'}{' '}
          <Link 
            href={!isSignIn ? '/sign-in' : '/sign-up'}
            className="text-primary-100 hover:text-primary-200 font-medium ml-1 transition-colors"
          >
            {!isSignIn ? 'Sign In' : 'Sign Up'}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm
