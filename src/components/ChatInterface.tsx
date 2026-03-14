import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn, getInitials } from '@/lib/utils'
import useAppStore from '@/stores/useAppStore'

interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
}

interface ChatInterfaceProps {
  title: string
  description: string
  themeClass: string
  avatarColor: string
  suggestions: string[]
  headerSlot?: React.ReactNode
}

export function ChatInterface({
  title,
  description,
  themeClass,
  avatarColor,
  suggestions,
  headerSlot,
}: ChatInterfaceProps) {
  const { user } = useAppStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: `Olá! Eu sou o seu ${title}. ${description} Como posso ajudar hoje?`,
    },
  ])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const initials = getInitials(user.name)

  const handleSend = (text: string) => {
    if (!text.trim()) return
    const newMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    setMessages((prev) => [...prev, newMsg])
    setInput('')

    // Mock AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'ai',
          content:
            'Entendido. Estou analisando seu perfil e ajustando as recomendações. Isso é apenas uma simulação para demonstrar a interface!',
        },
      ])
    }, 1000)
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden">
      <div
        className={cn(
          'p-4 border-b border-border/50 flex items-center justify-between',
          themeClass,
        )}
      >
        <div className="flex items-center gap-3">
          <Avatar className={cn('w-10 h-10 border-2', avatarColor)}>
            <AvatarFallback>
              <Bot className="w-5 h-5 text-white" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-white">{title}</h3>
            <p className="text-xs text-white/80">Online agora</p>
          </div>
        </div>
        {headerSlot}
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4 pb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-3 max-w-[85%]',
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : '',
              )}
            >
              <Avatar className="w-8 h-8 shrink-0">
                {msg.role === 'ai' ? (
                  <AvatarFallback className={avatarColor}>
                    <Bot className="w-4 h-4 text-white" />
                  </AvatarFallback>
                ) : (
                  <>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                      {initials ? initials : <UserIcon className="w-4 h-4" />}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              <div
                className={cn(
                  'p-3 rounded-2xl text-sm',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-muted text-foreground rounded-tl-sm',
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 bg-card border-t border-border/50">
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-secondary hover:bg-muted transition-colors text-muted-foreground whitespace-nowrap"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend(input)
          }}
          className="flex gap-2 relative"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="rounded-full pr-12 bg-secondary/50 border-border/50 focus-visible:ring-1"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 top-1 w-8 h-8 rounded-full"
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
