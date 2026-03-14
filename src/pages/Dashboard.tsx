import { PageTransition } from '@/components/PageTransition'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle, PlayCircle, BrainCircuit } from 'lucide-react'
import { MOCK_SUBJECTS, MOCK_TASKS, MOCK_DECKS } from '@/lib/mockData'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts'
import { Link } from 'react-router-dom'

const chartData = [{ name: 'Progresso', value: 65, fill: 'var(--color-value)' }]
const chartConfig = { value: { label: 'Concluído', color: 'hsl(var(--primary))' } }

export function Dashboard() {
  return (
    <PageTransition className="space-y-6">
      {/* Top Row: Main Summary & Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-transparent bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-none relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <BrainCircuit className="w-32 h-32" />
          </div>
          <CardHeader>
            <CardTitle className="text-xl">Sessão Atual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-3xl font-display font-bold text-foreground">
                Revisão de Matemática
              </h3>
              <p className="text-muted-foreground mt-1">
                14:00 - 16:00 • Foco em Geometria Espacial
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button size="lg" className="rounded-full font-bold shadow-lg shadow-primary/20">
                <PlayCircle className="w-5 h-5 mr-2" /> Iniciar Agora
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full bg-background/50 backdrop-blur"
              >
                Ver Detalhes
              </Button>
            </div>
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
                    65%
                  </text>
                </RadialBarChart>
              </ChartContainer>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Você estudou 15h de 22h propostas.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Middle Row: Priority & Flashcards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover-card-effect">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Prioridades de Hoje
              <Badge variant="secondary">IA Sugere</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {MOCK_SUBJECTS.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${sub.color.split(' ')[0]}`} />
                  <span className="font-medium">{sub.name}</span>
                </div>
                <Badge
                  variant="outline"
                  className={sub.difficulty === 'high' ? 'border-red-200 text-red-600' : ''}
                >
                  {sub.difficulty === 'high' ? 'Atenção Máxima' : 'Revisão'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="hover-card-effect">
          <CardHeader>
            <CardTitle className="text-lg">Flashcards Pendentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {MOCK_DECKS.filter((d) => d.dueToday > 0).map((deck) => (
              <div
                key={deck.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-secondary/30"
              >
                <div>
                  <p className="font-medium text-sm">{deck.title}</p>
                  <p className="text-xs text-muted-foreground">{deck.subject}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="default">{deck.dueToday} p/ revisar</Badge>
                  <Link to="/flashcards">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <PlayCircle className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Tasks */}
      <Card className="hover-card-effect">
        <CardHeader>
          <CardTitle className="text-lg">Tarefas Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_TASKS.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group"
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
        </CardContent>
      </Card>
    </PageTransition>
  )
}
