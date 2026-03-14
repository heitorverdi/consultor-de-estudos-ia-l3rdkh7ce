import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { cn, getInitials } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'

interface Message {
  id: string
  role: 'user' | 'assistant'
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
  const { user, profile } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [chatId, setChatId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const initials = getInitials(profile?.full_name || 'Usuário')

  useEffect(() => {
    const initChat = async () => {
      if (!user) return
      setLoading(true)
      let { data: chats } = await supabase
        .from('ai_chats')
        .select('*')
        .eq('title', title)
        .eq('user_id', user.id)
        .limit(1)
      let currentChat = chats?.[0]

      if (!currentChat) {
        const { data: newChat } = await supabase
          .from('ai_chats')
          .insert({ user_id: user.id, title })
          .select()
          .single()
        currentChat = newChat
        if (newChat) {
          const initMsg = {
            chat_id: newChat.id,
            role: 'assistant',
            content: `Olá! Eu sou o seu ${title}. ${description} Como posso ajudar hoje?`,
          }
          await supabase.from('chat_messages').insert(initMsg)
        }
      }

      if (currentChat) {
        setChatId(currentChat.id)
        const { data: msgs } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('chat_id', currentChat.id)
          .order('created_at', { ascending: true })
        if (msgs) setMessages(msgs as Message[])
      }
      setLoading(false)
    }
    initChat()
  }, [user, title, description])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const handleSend = async (text: string) => {
    if (!text.trim() || !chatId) return
    const userMsg = { chat_id: chatId, role: 'user', content: text }

    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', content: text }])
    setInput('')
    await supabase.from('chat_messages').insert(userMsg)

    // Simulate AI thinking and reply
    setTimeout(async () => {
      const aiReplyText =
        'Entendido. Estou analisando seu histórico no banco de dados e ajustando as recomendações!'
      const aiMsg = { chat_id: chatId, role: 'assistant', content: aiReplyText }
      const { data } = await supabase.from('chat_messages').insert(aiMsg).select().single()
      if (data) setMessages((prev) => [...prev, data as Message])
    }, 1000)
  }

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
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4 rounded-xl" />
            <Skeleton className="h-12 w-1/2 rounded-xl ml-auto" />
          </div>
        ) : (
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
                  {msg.role === 'assistant' ? (
                    <AvatarFallback className={avatarColor}>
                      <Bot className="w-4 h-4 text-white" />
                    </AvatarFallback>
                  ) : (
                    <>
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                        {initials}
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div
                  className={cn(
                    'p-3 rounded-2xl text-sm whitespace-pre-wrap',
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
        )}
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
            disabled={loading}
            className="rounded-full pr-12 bg-secondary/50 border-border/50 focus-visible:ring-1"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 top-1 w-8 h-8 rounded-full"
            disabled={!input.trim() || loading}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
