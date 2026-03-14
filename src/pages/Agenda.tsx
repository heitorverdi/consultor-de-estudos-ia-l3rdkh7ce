import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { PageTransition } from '@/components/PageTransition'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarIcon, Plus, CheckCircle2, Circle, Trash2, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date: string
}

export default function Agenda() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [addModal, setAddModal] = useState(false)
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    status: 'pending',
    priority: 'medium',
  })

  const fetchTasks = async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (error) toast.error('Erro ao carregar tarefas')
    else setTasks(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchTasks()
  }, [user])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    const { error } = await supabase.from('tasks').insert({ ...newTask, user_id: user.id })
    if (error) {
      toast.error('Erro ao criar tarefa')
    } else {
      toast.success('Tarefa adicionada!')
      setAddModal(false)
      setNewTask({ title: '', status: 'pending', priority: 'medium' })
      fetchTasks()
    }
  }

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', task.id)
    if (!error) {
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)))
      toast.success(newStatus === 'completed' ? 'Tarefa concluída!' : 'Tarefa reaberta.')
    }
  }

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (!error) {
      setTasks(tasks.filter((t) => t.id !== id))
      toast.success('Tarefa removida')
    }
  }

  return (
    <PageTransition className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold">Tarefas & Agenda</h1>
          <p className="text-sm text-muted-foreground">Gerencie seus estudos e revisões.</p>
        </div>
        <Button onClick={() => setAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Nova Tarefa
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <CalendarIcon className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-medium">Nenhuma tarefa encontrada</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6 mt-2">
            Sua agenda está livre. Adicione metas para manter a constância.
          </p>
          <Button onClick={() => setAddModal(true)}>Adicionar Tarefa</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className={cn('transition-all', task.status === 'completed' && 'opacity-75')}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <button
                  onClick={() => toggleStatus(task)}
                  className="shrink-0 hover:scale-110 transition-transform"
                >
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <h4
                    className={cn(
                      'font-medium truncate',
                      task.status === 'completed' && 'line-through text-muted-foreground',
                    )}
                  >
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-xs text-muted-foreground truncate">{task.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge
                    variant="outline"
                    className={cn(
                      task.priority === 'high'
                        ? 'border-red-200 text-red-600'
                        : task.priority === 'medium'
                          ? 'border-yellow-200 text-yellow-600'
                          : 'border-blue-200 text-blue-600',
                    )}
                  >
                    {task.priority === 'high'
                      ? 'Alta'
                      : task.priority === 'medium'
                        ? 'Média'
                        : 'Baixa'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={addModal} onOpenChange={setAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                required
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Ex: Revisar crase"
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição (Opcional)</Label>
              <Input
                value={newTask.description || ''}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Detalhes da tarefa..."
              />
            </div>
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select
                value={newTask.priority}
                onValueChange={(v: any) => setNewTask({ ...newTask, priority: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Criar Tarefa
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </PageTransition>
  )
}
