import { getRandomInterviewCover } from "@/lib/utils"
import { google } from '@ai-sdk/google'
import { db } from "@/firebase/admin"
import { generateText } from 'ai'


export async function POST(request: Request) {
    const {type, role, level, techstack, amount, userId } = await request.json()

    try {
        const {text: questions } = await generateText({ 
            model: google('gemini-2.0-flash-001'),
            prompt : `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
        `,
        })

        const interview = {
            userId, role, type, level,
            techstack: techstack.split(','),
            questions: JSON.parse(questions),
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString()
        }
        
        const interviewRef = await db.collection('interviews').add(interview)
        
        // Send end meeting message
        await sendEndMeetingMessage(userId, interviewRef.id)

        return Response.json({ success: true, interviewId: interviewRef.id }, {status:200})
    } catch (error) {
        console.log(error)
        return Response.json({ success: false, error}, {status:500})
    }
}