import { PageTransition } from '@/components/PageTransition'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MOCK_AGENDA_EVENTS } from '@/lib/mockData'
import { Calendar as CalendarIcon, Sparkles, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const HOURS = Array.from({ length: 16 }, (_, i) => i + 7) // 7am to 10pm

export default function Agenda() {
  const handleAutoSchedule = () => {
    toast.success('Consultor IA gerou sua nova agenda com base no seu nível de energia!')
  }

  return (
    <PageTransition className="h-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Sua Agenda Inteligente</h1>
          <p className="text-sm text-muted-foreground">
            Arrastar e soltar suportado. IA otimiza seus horários.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none">
            <Plus className="w-4 h-4 mr-2" /> Rotina
          </Button>
          <Button
            className="flex-1 sm:flex-none bg-consultant hover:bg-consultant/90 text-white"
            onClick={handleAutoSchedule}
          >
            <Sparkles className="w-4 h-4 mr-2" /> Auto-Agendar
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Main Calendar View */}
        <Card className="lg:col-span-3 flex flex-col overflow-hidden">
          <CardHeader className="py-4 border-b border-border/50 bg-muted/20">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-primary" /> Hoje
              </CardTitle>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div> Estudo
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></div> Rotina
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-y-auto relative bg-background">
            <div className="min-w-[600px] relative h-[960px]">
              {' '}
              {/* 16 hours * 60px */}
              {/* Grid Lines */}
              {HOURS.map((hour, i) => (
                <div
                  key={hour}
                  className="absolute w-full border-t border-border/40 flex"
                  style={{ top: `${i * 60}px` }}
                >
                  <div className="w-16 -mt-3 text-right pr-2 text-xs text-muted-foreground font-medium">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  <div className="flex-1 bg-gradient-to-r from-transparent to-transparent hover:bg-secondary/30 transition-colors"></div>
                </div>
              ))}
              {/* Events */}
              {MOCK_AGENDA_EVENTS.map((event) => {
                const top = (event.start - 7) * 60
                const height = (event.end - event.start) * 60
                const isStudy = event.type === 'study'

                return (
                  <div
                    key={event.id}
                    className={cn(
                      'absolute left-16 right-4 rounded-lg p-2 text-sm shadow-sm transition-transform hover:scale-[1.01] cursor-pointer border',
                      isStudy
                        ? 'bg-primary/10 border-primary/20 text-primary-foreground dark:text-primary animate-pulse'
                        : 'bg-secondary border-border text-foreground',
                    )}
                    style={{ top: `${top}px`, height: `${height - 4}px`, marginTop: '2px' }}
                  >
                    <div className="font-bold truncate text-foreground">{event.title}</div>
                    <div className="text-xs opacity-80">
                      {event.start}h - {event.end}h
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Side Panel */}
        <Card className="hidden lg:block bg-gradient-to-b from-card to-secondary/30">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Mapa de Energia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              A IA utiliza este mapa para posicionar matérias difíceis nos seus picos de energia.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm p-2 rounded bg-card border">
                <span>Manhã</span> <Badge className="bg-green-500 hover:bg-green-600">Alta</Badge>
              </div>
              <div className="flex justify-between items-center text-sm p-2 rounded bg-card border">
                <span>Tarde</span> <Badge variant="secondary">Média</Badge>
              </div>
              <div className="flex justify-between items-center text-sm p-2 rounded bg-card border">
                <span>Noite</span>{' '}
                <Badge variant="outline" className="text-red-500 border-red-200">
                  Baixa
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
