import { getRandomInterviewCover } from "@/lib/utils"

export async function GET() {
    return Response.json({sucess:true, data:'TH'})
}

export async function POST() {
    const {type, role, level, techstack, amount, userid } = await result.json()

    try {
        const {text: questions } = await genrateText({ 
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
            role, type, level,
            techstack: techstack.split(','),
            questiom: JSON.parse(questions),
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString()
        }
        
        await db.collection('interviews').add(interview)

        return Response.json({ sucess: true}, {status:200})
    } catch (error) {
        console.log(error)
        return Response.json({ sucess:false, error}, {status:500})
    }
    
}