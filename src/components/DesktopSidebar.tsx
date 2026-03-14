import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  BrainCircuit,
  MessageSquare,
  Layers,
  User,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/agenda', label: 'Agenda', icon: Calendar },
  { path: '/flashcards', label: 'Flashcards', icon: Layers },
  { path: '/consultor', label: 'Consultor IA', icon: Sparkles, highlight: 'text-violet-500' },
  { path: '/duvidas', label: 'Dúvidas IA', icon: MessageSquare, highlight: 'text-emerald-500' },
  { path: '/perfil', label: 'Perfil', icon: User },
]

export function DesktopSidebar({ className }: { className?: string }) {
  const location = useLocation()

  return (
    <aside
      className={cn(
        'w-64 border-r border-border/50 bg-card/50 backdrop-blur-xl hidden md:flex flex-col',
        className,
      )}
    >
      <div className="p-6">
        <div className="flex items-center gap-2 font-display font-bold text-lg">
          <BrainCircuit className="w-6 h-6 text-primary" />
          <span>Consultor IA</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className={cn('w-5 h-5', isActive ? 'text-primary' : item.highlight)} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20">
        <p className="text-xs font-medium text-foreground mb-1">Dica do Consultor</p>
        <p className="text-xs text-muted-foreground">
          Mantenha a hidratação! Beba água durante os estudos.
        </p>
      </div>
    </aside>
  )
}
