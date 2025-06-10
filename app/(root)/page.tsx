import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { dummyInterviews } from '@/constants'
import InterviewCard from '@/component/UI/InterviewCard'
import { getCurrentUser, getInterviewByUserId } from '@/lib/action/auth.action'



const page = async() => {
  const user = await getCurrentUser()
  const userInterview = await getInterviewByUserId(user?.id)

  const hasPastInterviews = userInterview && userInterview.length > 0
  
  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
        <h2>Get Interview-Ready with Ai-Powered Practice & Feedback</h2>
        <p className='text-lg'>
          Practice on real interview question & get instant Feedback
        </p>
        <button className='btn-primary max-sm:w-full'>
          <Link href='/interview'> Start an Interview</Link>
        </button>
        </div>
          <Image
          src='/robot.png'
          alt='ai-robo'
          height={400}
          width={400}
          className='max-sm:hidden'
          />
      </section>
      <section className='flex flex-col gap'>
        <h2>Your Interviews</h2>
        <div className="interview-section">
          {hasPastInterviews ? userInterview?.map((interview) => (
            <InterviewCard {...interview} key={interview.id}/>
          )) : (
            <p>You haven&apos;t taken any interview yet</p>
          )}
        </div>
      </section>
      <section>
        <h2 className='flex flex-col gap-6 mt-8'>Take an Interview</h2>
        <div className='interview-section'>
          {dummyInterviews.length > 0 ? dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id}/>
          )) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>
    </>
  )
}

export default page
