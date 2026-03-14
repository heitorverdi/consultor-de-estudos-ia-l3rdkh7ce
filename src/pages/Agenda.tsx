import { useState } from 'react'
import { PageTransition } from '@/components/PageTransition'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, Sparkles, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import useAppStore, { AgendaEvent, CORE_SUBJECTS } from '@/stores/useAppStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const HOURS = Array.from({ length: 16 }, (_, i) => i + 7)

export default function Agenda() {
  const { events, setEvents, user, addEvent } = useAppStore()
  const [addModal, setAddModal] = useState(false)
  const [newEvent, setNewEvent] = useState<Partial<AgendaEvent>>({
    type: 'study',
    title: '',
    start: 14,
    end: 16,
  })

  const handleAutoSchedule = () => {
    const aiEvents: AgendaEvent[] = [
      { id: Date.now().toString(), title: 'Rotina Matinal', start: 7, end: 8, type: 'routine' },
      {
        id: (Date.now() + 1).toString(),
        title: `Foco: ${user.difficultSubjects[0] || 'Matemática'}`,
        start: 14,
        end: 16,
        type: 'study',
        subject: user.difficultSubjects[0] || 'Matemática',
      },
      {
        id: (Date.now() + 2).toString(),
        title: 'Revisão',
        start: 16.5,
        end: 18,
        type: 'study',
        subject: 'História',
      },
    ]
    setEvents(aiEvents)
    toast.success('IA gerou sua nova agenda com base no seu perfil!')
  }

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault()
    addEvent({ ...newEvent, id: Date.now().toString() } as AgendaEvent)
    setAddModal(false)
    toast.success('Evento adicionado!')
  }

  return (
    <PageTransition className="h-full flex flex-col gap-4">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Agenda Inteligente</h1>
          <p className="text-sm text-muted-foreground">Gerencie seus horários e estudos.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" /> Manual
          </Button>
          <Button
            className="bg-consultant text-white hover:bg-consultant/90"
            onClick={handleAutoSchedule}
          >
            <Sparkles className="w-4 h-4 mr-2" /> Auto-Agendar
          </Button>
        </div>
      </div>

      <Card className="flex flex-col overflow-hidden h-[75vh]">
        <CardHeader className="py-4 border-b bg-muted/20">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-primary" /> Hoje
            </CardTitle>
            <div className="flex gap-3">
              <div className="flex items-center gap-1 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-500" /> Estudo
              </div>
              <div className="flex items-center gap-1 text-xs">
                <div className="w-2 h-2 rounded-full bg-slate-400" /> Rotina
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-y-auto relative bg-background">
          <div className="min-w-[600px] relative h-[960px]">
            {events.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-[1px] z-10">
                <CalendarIcon className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-medium">Sua Agenda está vazia</h3>
                <p className="text-muted-foreground text-sm max-w-sm text-center mb-6 mt-2">
                  Comece adicionando horários de estudo manualmente ou permita que a IA crie uma
                  rotina perfeita.
                </p>
                <div className="flex gap-4">
                  <Button onClick={() => setAddModal(true)}>Adicionar Manual</Button>
                  <Button onClick={handleAutoSchedule} variant="secondary">
                    Usar IA
                  </Button>
                </div>
              </div>
            )}
            {HOURS.map((h, i) => (
              <div
                key={h}
                className="absolute w-full border-t border-border/40 flex"
                style={{ top: `${i * 60}px` }}
              >
                <div className="w-16 -mt-3 text-right pr-2 text-xs text-muted-foreground">
                  {h.toString().padStart(2, '0')}:00
                </div>
              </div>
            ))}
            {events.map((ev) => (
              <div
                key={ev.id}
                className={cn(
                  'absolute left-16 right-4 rounded-lg p-2 text-sm shadow-sm border',
                  ev.type === 'study'
                    ? 'bg-primary/10 border-primary/20 text-primary-foreground animate-in'
                    : 'bg-secondary border-border',
                )}
                style={{
                  top: `${(ev.start - 7) * 60}px`,
                  height: `${(ev.end - ev.start) * 60 - 4}px`,
                  marginTop: '2px',
                }}
              >
                <div className="font-bold truncate">{ev.title}</div>
                <div className="text-xs opacity-80">
                  {ev.start}h - {ev.end}h {ev.subject && `• ${ev.subject}`}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={addModal} onOpenChange={setAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Horário</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleManualAdd} className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                required
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Ex: Revisão"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={newEvent.type}
                  onValueChange={(v: any) => setNewEvent({ ...newEvent, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="study">Estudo</SelectItem>
                    <SelectItem value="routine">Rotina</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newEvent.type === 'study' && (
                <div className="space-y-2">
                  <Label>Matéria</Label>
                  <Select
                    value={newEvent.subject}
                    onValueChange={(v: any) => setNewEvent({ ...newEvent, subject: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {CORE_SUBJECTS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Início (7 a 22)</Label>
                <Input
                  type="number"
                  min={7}
                  max={22}
                  required
                  value={newEvent.start || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, start: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Fim</Label>
                <Input
                  type="number"
                  min={8}
                  max={23}
                  required
                  value={newEvent.end || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, end: Number(e.target.value) })}
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Adicionar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </PageTransition>
  )
}
