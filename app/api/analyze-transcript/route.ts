import { OpenAI } from 'openai'
import { NextRequest, NextResponse } from 'next/server'

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY! })

export async function POST(req: NextRequest) {
  const { transcript } = await req.json()

  const prompt = `
Here is a mock interview transcript:

"${transcript}"

Extract:
{
  "role": "",
  "techstack":[],
  "type": "",
  "level of experience":"",
  "questions":[],
  "answer":[]
}
`

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  })

  return NextResponse.json({
    analysis: completion.choices[0].message.content,
  })
}
