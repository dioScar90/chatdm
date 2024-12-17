import { createFileRoute, redirect } from '@tanstack/react-router'
import { ChatBubble } from '../components/chat-bubble'
import { ChatVoiceMessage } from '../components/chat-voice-message'

export const Route = createFileRoute('/chat')({
  component: Chat,
  beforeLoad({ context }) {
    if (!context.isAuthenticated) {
      return redirect({ to: '/', replace: true })
    }
  },
})

function Chat() {
  return (
    <div className="p-2">
      <h3>Chat</h3>

      <div className="p-2 border-2 border-indigo-600 w-[95vw] md:max-w-[800px]">
        <ChatBubble>Oi</ChatBubble>
        <ChatBubble right>Tduo bem?</ChatBubble>
        <ChatVoiceMessage></ChatVoiceMessage>
        <ChatBubble>Aff de novo mandando áudio...</ChatBubble>
      </div>
    </div>
  )
}
