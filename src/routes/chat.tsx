import { createFileRoute, redirect } from '@tanstack/react-router'
import { FieldApi, useForm } from '@tanstack/react-form'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useEffect, useRef } from 'react'
import { z } from 'zod'

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

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em className="text-red-500">{field.state.meta.errors.join(", ")}</em>
      ) : null}
      {/* {field.state.meta.isValidating ? 'Validating...' : null} */}
    </>
  )
}

const messageSchema = z.string()
  .min(1, 'Message must not be empty')
  .max(255, 'Message must not have more than 255 characters')
  
const schema = z.object({
  message: messageSchema
})
  .refine((value) => value.message.trim() !== '', {
    message: 'Message must not contain only whitespaces',
    path: ['message']
  })

function FormNewMessage({ userFirstName, userId }: { userFirstName: string, userId: string }) {
  const sendMessage = useMutation(api.chat.sendMessage)

  const form = useForm({
    defaultValues: {
      message: '',
    },
    validators: {
      onSubmit: schema,
      onChangeAsync: schema,
      // onChangeAsync({ value, formApi }) {
      //   if (formApi.state.submissionAttempts > 0 && formApi.state.isDirty) {
      //     return schema.safeParse(value).error?.message
      //   }
        
      //   return undefined
      // },
      onChangeAsyncDebounceMs: 200,
    },
    onSubmit: async ({ value }) => {
      await sendMessage({ user: userFirstName, userId, body: value.message })
    },
  })
  
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
        // form.reset()
      }}
    >
      <form.Field
        name="message"
        children={(field) => (
          <>
            <input
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={e => field.handleChange(e.target.value)}
              placeholder="Write a message…"
            />
            <FieldInfo field={field} />
          </>
        )}
      />
      
      <form.Subscribe
        selector={(state) => [state.isSubmitting]}
        children={([isSubmitting]) => (
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '...' : 'Send'}
          </button>
        )}
      />
    </form>
  )
}

function Messages({ currentUserId }: { currentUserId: string }) {
  const messages = useQuery(api.chat.getMessages)
  const ref = useRef<HTMLDivElement>(null)

  function getDateIntoString(timestamp: number) {
    const date = new Date(timestamp)
    return date.toLocaleDateString('pt-BR').split('/').slice(0, 2).join('/')
  }

  function getDateIntoIso(timestamp: number) {
    const date = new Date(timestamp)
    return date.toISOString()
  }
  
  useEffect(() => {
    const observe = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
      })
    })

    if (ref.current) {
      observe.observe(ref.current, { childList: true })
    }

    return () => observe.disconnect()
  }, [ref])

  return (
    <div ref={ref}>
      {messages?.map((message) => (
        <article
          key={message._id}
          className={message.userId === currentUserId ? 'message-mine' : ''}
        >
          <div>
            {message.user}{', '}
            <time
              dateTime={getDateIntoIso(message._creationTime)}
              className="text-muted-foreground"
            >
              {getDateIntoString(message._creationTime)}
            </time>
          </div>

          <p>{message.body}</p>
        </article>
      ))}
    </div>
  )
}
