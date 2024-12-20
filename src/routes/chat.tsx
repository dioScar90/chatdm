import { createFileRoute, redirect } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/chat')({
  component: Chat,
  beforeLoad({ context }) {
    if (!context.isAuthenticated) {
      return redirect({ to: '/', replace: true })
    }
  },
  loader: ({ context }) => context?.user!,
})

function Chat() {
  const user = Route.useLoaderData()
  
  const messages = useQuery(api.chat.getMessages);
  
  const sendMessage = useMutation(api.chat.sendMessage);

  const [newMessageText, setNewMessageText] = useState('');

  useEffect(() => {
    // Make sure scrollTo works on button click in Chrome
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 0);
  }, [messages]);
  
  return (
    <>
      <div className="chat">
        <header>
          <h1>Convex Chat</h1>
          <p>
            Connected as <strong>{user.firstName}</strong>
          </p>
        </header>
        {messages?.map((message) => (
          <article
            key={message._id}
            className={message.userId === user.id ? "message-mine" : ""}
          >
            <div>{message.user}</div>

            <p>{message.body}</p>
          </article>
        ))}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await sendMessage({ user: user.firstName!, userId: user.id, body: newMessageText });
            setNewMessageText("");
          }}
        >
          <input
            value={newMessageText}
            onChange={async (e) => {
              const text = e.target.value;
              setNewMessageText(text);
            }}
            placeholder="Write a message…"
          />
          <button type="submit" disabled={!newMessageText}>
            Send
          </button>
        </form>
      </div>
    </>
  );
}
