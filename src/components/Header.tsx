import { Bell, Flame, User as UserIcon, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import useAppStore from '@/stores/useAppStore'
import { useAuth } from '@/hooks/use-auth'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { getInitials } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const { user: localUser } = useAppStore()
  const { profile, signOut } = useAuth()
  const today = format(new Date(), "dd 'de' MMMM", { locale: ptBR })

  const displayName = profile?.full_name || localUser.name || 'Estudante'
  const displayAvatar = profile?.avatar_url || localUser.avatar
  const initials = getInitials(displayName)

  return (
    <header className="h-16 glass sticky top-0 z-40 flex items-center justify-between px-4 md:px-8">
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {today}
        </span>
        <h2 className="text-sm font-bold md:text-base">Olá, {displayName} 👋</h2>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20">
          <Flame className="w-4 h-4 fill-orange-500" />
          <span className="text-sm font-bold">{localUser.streak}</span>
        </div>

        <button className="relative p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-background"></span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="w-9 h-9 border-2 border-primary/20 cursor-pointer hover:border-primary transition-colors">
              <AvatarImage src={displayAvatar} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                {initials ? initials : <UserIcon className="w-4 h-4" />}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut()}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
