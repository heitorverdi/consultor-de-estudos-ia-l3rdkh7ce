import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Calendar, Layers, Sparkles, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

const mobileItems = [
  { path: '/', icon: LayoutDashboard, label: 'Início' },
  { path: '/agenda', icon: Calendar, label: 'Agenda' },
  { path: '/flashcards', icon: Layers, label: 'Cards' },
  { path: '/consultor', icon: Sparkles, label: 'Consultor' },
  { path: '/duvidas', icon: MessageSquare, label: 'Dúvidas' },
]

export function MobileNav({ className }: { className?: string }) {
  const location = useLocation()

  return (
    <nav className={cn('md:hidden fixed bottom-0 left-0 right-0 glass pb-safe', className)}>
      <div className="flex items-center justify-around p-2">
        {mobileItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center w-16 h-12 gap-1 rounded-xl transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <item.icon className={cn('w-5 h-5', isActive && 'fill-primary/20')} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
