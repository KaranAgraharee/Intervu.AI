"use client"

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { vapi } from '@/lib/vapi.sdk'



enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

interface SavedMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

const Agent = ({ userName, userId, type }: AgentProps) => {
  const router = useRouter()
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
  const [messages, setMessages] = useState<SavedMessage[]>([])



  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE)
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED)

    const onMessage = (message: Message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = { role: message.role, content: message.transcript }
        setMessages((prev) => [...prev, newMessage])
      }
    }
    const onSpeechStart = () => setIsSpeaking(true)
    const onSpeechEnd = () => setIsSpeaking(false)
    const onError = (error: Error) => {
      console.error('Vapi Error:', error)
      setCallStatus(CallStatus.INACTIVE)
    }

    vapi.on('call-start', onCallStart)
    vapi.on('call-end', onCallEnd)
    vapi.on('message', onMessage)
    vapi.on('speech-start', onSpeechStart)
    vapi.on('speech-end', onSpeechEnd)
    vapi.on('error', onError)

    return () => {
      vapi.off('call-start', onCallStart)
      vapi.off('call-end', onCallEnd)
      vapi.off('message', onMessage)
      vapi.off('speech-start', onSpeechStart)
      vapi.off('speech-end', onSpeechEnd)
      vapi.off('error', onError)
    }
  }, [])

  const interview = async () => {
    const transcript = (turns: { role: string; content: string }[]) => {
      return turns.map(turn => `${turn.role}: ${turn.content}`).join('\n')
    }
    console.log("trnscript",transcript)
    await fetch('http://localhost:3000/api/analyze-transcript/route.ts ', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcript,
        userId,
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log('Success:', responseData);
      })
      .catch((error) => {
        console.error('Error:', error);
      })
  }

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      interview()
      router.push('/')
    }
  }, [messages, callStatus, type, userId])

    console.log("Message",messages)

  

  const handleCall = async () => {
    try {
      setCallStatus(CallStatus.CONNECTING)

      if (!process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID) {
        throw new Error('Vapi workflow ID is not configured')
      }

      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID, {
        variableValues: {
          username: userName,
          userId: userId,
        }
      })
    } catch (error) {
      console.error('Failed to start Vapi call:', error)
      setCallStatus(CallStatus.INACTIVE)
    }
  }

  const handleDisconnect = async () => {
    interview()
    setCallStatus(CallStatus.FINISHED)
    vapi.stop()    
  }

  const latestMessage = messages[messages.length - 1]?.content
  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED

  return (
    <>
      <div className='call-view'>
        <div className="card-interviewer">
          <div className="avatar">
            <Image src='/ai-avatar.png'
              width={65} height={54} alt='vapi' className='object-cover' />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>Ai Interview</h3>
        </div>
        <div className="card-border">
          <div className="card-content">
            <Image src="/user-avatar.png" alt="user-avatar" width={540} height={540} className="rounded-full object-cover size-[120px]" />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>
      {messages.length > 0 && (
        <div className='transcript-border'>
          <div className='transcript'>
            <p key={latestMessage} className={cn('transitiom-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>{latestMessage}</p>
          </div>
        </div>
      )}
      <div className="w-full flex justify-center">
        {callStatus !== 'ACTIVE' ? (
          <button className='relative btn-call' onClick={handleCall}>
            <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== 'CONNECTING' && 'hidden')} />
            {isCallInactiveOrFinished ? 'Call' : '...'}
          </button>
        ) : (
          <button className='btn-disconnect' onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  )
}

export default Agent
