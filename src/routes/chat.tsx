import { createFileRoute, redirect } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useEffect } from 'react'

export const Route = createFileRoute('/chat')({
  component: Chat,
  beforeLoad({ context }) {
    if (!context.isAuthenticated) {
      return redirect({ to: '/', replace: true })
    }
  },
  loader({ context }) {
    return context?.user!
  }
})

function Messages({ currentUserId }: { currentUserId: string }) {
  const messages = useQuery(api.chat.getMessages)

  useEffect(() => {
    // Make sure scrollTo works on button click in Chrome
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
    }, 0)
  }, [messages])

  return (
    <>
      {messages?.map((message) => (
        <article
          key={message._id}
          className={message.userId === currentUserId ? 'message-mine' : ''}
        >
          <div>{message.user}</div>

          <p>{message.body}</p>
        </article>
      ))}
    </>
  )
}

function FormNewMessage({ userFirstName, userId }: { userFirstName: string, userId: string }) {
  const sendMessage = useMutation(api.chat.sendMessage)

  const form = useForm({
    defaultValues: {
      body: '',
    },
    onSubmit: async ({ value }) => {
      await sendMessage({ user: userFirstName, userId, body: value.body })
    },
  })
  
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="body"
        validators={{
          onChange({ value }) {
            if (!value) {
              return 'Message must not be empty'
            }

            if (value?.trim() === '') {
              return 'Message must not contain only whitespaces'
            }

            if (value.length > 255) {
              return 'Message must not have more than 255 characters'
            }

            return undefined
          }
        }}
        children={(field) => (
          <>
            <input
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={e => field.handleChange(e.target.value)}
              placeholder="Write a message…"
            />
            {field.state.meta.errors && (
              <p className="text-red-500 text-sm">{field.state.meta.errors.join(', ')}</p>
            )}
          </>
        )}
      />

      <button type="submit" disabled={form.state.isSubmitting}>
        Send
      </button>
    </form>
  )
}

function Chat() {
  const user = Route.useLoaderData()
  
  return (
    <>
      <div className="chat">
        <header>
          <h1>Convex Chat</h1>
          <p>
            Connected as <strong>{user.firstName}</strong>
          </p>
        </header>

        <Messages currentUserId={user.id} />
        
        <FormNewMessage userFirstName={user.firstName!} userId={user.id} />
      </div>
    </>
  );
}
