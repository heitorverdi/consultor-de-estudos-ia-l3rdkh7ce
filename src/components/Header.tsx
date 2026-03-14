import { Bell, Flame } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import useAppStore from '@/stores/useAppStore'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function Header() {
  const { user } = useAppStore()
  const today = format(new Date(), "dd 'de' MMMM", { locale: ptBR })

  return (
    <header className="h-16 glass sticky top-0 z-40 flex items-center justify-between px-4 md:px-8">
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {today}
        </span>
        <h2 className="text-sm font-bold md:text-base">Olá, {user.name} 👋</h2>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20">
          <Flame className="w-4 h-4 fill-orange-500" />
          <span className="text-sm font-bold">{user.streak}</span>
        </div>

        <button className="relative p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-background"></span>
        </button>

        <Avatar className="w-9 h-9 border-2 border-primary/20 cursor-pointer hover:border-primary transition-colors">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>ST</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
