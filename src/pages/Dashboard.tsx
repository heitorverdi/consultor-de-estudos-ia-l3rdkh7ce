import { PageTransition } from '@/components/PageTransition'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { CheckCircle2, Circle, PlayCircle, BrainCircuit, PlusCircle } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts'
import { Link } from 'react-router-dom'
import useAppStore from '@/stores/useAppStore'
import { useState } from 'react'

export function Dashboard() {
  const { user, events, decks, tasks, setTasks } = useAppStore()
  const [newTask, setNewTask] = useState('')

  const prog = user.weeklyStudyHours > 0 ? (15 / user.weeklyStudyHours) * 100 : 0
  const chartData = [{ name: 'Progresso', value: Math.min(prog, 100), fill: 'var(--color-value)' }]
  const chartConfig = { value: { label: 'Concluído', color: 'hsl(var(--primary))' } }

  const currentSession = events.find((e) => e.type === 'study')
  const toggleTask = (id: string) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), title: newTask.trim(), completed: false }])
      setNewTask('')
    }
  }

  return (
    <PageTransition className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-transparent bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-none relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <BrainCircuit className="w-32 h-32" />
          </div>
          <CardHeader>
            <CardTitle className="text-xl">Sessão Atual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            {currentSession ? (
              <>
                <div>
                  <h3 className="text-3xl font-display font-bold text-foreground">
                    {currentSession.title}
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    {currentSession.start}:00 - {currentSession.end}:00 • {currentSession.subject}
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button size="lg" className="rounded-full font-bold shadow-lg shadow-primary/20">
                    <PlayCircle className="w-5 h-5 mr-2" /> Iniciar Agora
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-4 space-y-4">
                <p className="text-muted-foreground">
                  Nenhuma sessão de estudo programada para agora.
                </p>
                <Link to="/agenda">
                  <Button variant="outline" className="rounded-full bg-background/50 backdrop-blur">
                    Organizar Agenda
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover-card-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Meta Semanal
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-0">
            <div className="h-[120px] w-full">
              <ChartContainer config={chartConfig} className="h-full">
                <RadialBarChart
                  data={chartData}
                  innerRadius="70%"
                  outerRadius="100%"
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    background={{ fill: 'hsl(var(--secondary))' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground font-display font-bold text-2xl"
                  >
                    {Math.round(prog)}%
                  </text>
                </RadialBarChart>
              </ChartContainer>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Meta de {user.weeklyStudyHours}h semanais.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover-card-effect">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Prioridades<Badge variant="secondary">IA</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.difficultSubjects.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">Nenhuma dificuldade mapeada.</p>
                <Link
                  to="/perfil"
                  className="text-xs text-primary hover:underline mt-2 inline-block"
                >
                  Mapear no Perfil
                </Link>
              </div>
            ) : (
              user.difficultSubjects.map((sub) => (
                <div key={sub} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full bg-red-500`} />
                    <span className="font-medium text-sm">{sub}</span>
                  </div>
                  <Badge variant="outline" className="border-red-200 text-red-600">
                    Atenção
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="hover-card-effect">
          <CardHeader>
            <CardTitle className="text-lg">Flashcards Pendentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {decks.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">Nenhum deck criado.</p>
                <Link
                  to="/flashcards"
                  className="text-xs text-primary hover:underline mt-2 inline-block"
                >
                  Criar Flashcards
                </Link>
              </div>
            ) : (
              decks.slice(0, 3).map((deck) => (
                <div
                  key={deck.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-secondary/30"
                >
                  <div>
                    <p className="font-medium text-sm">{deck.title}</p>
                    <p className="text-xs text-muted-foreground">{deck.subject}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="default">{deck.cards.length} cards</Badge>
                    <Link to="/flashcards">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <PlayCircle className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="hover-card-effect">
        <CardHeader>
          <CardTitle className="text-lg">Tarefas Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Input
              placeholder="Adicionar nova tarefa..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <Button size="icon" onClick={addTask}>
              <PlusCircle className="w-4 h-4" />
            </Button>
          </div>
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma tarefa no momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-secondary/50 cursor-pointer group"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                  )}
                  <span
                    className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'font-medium'}`}
                  >
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageTransition>
  )
}
