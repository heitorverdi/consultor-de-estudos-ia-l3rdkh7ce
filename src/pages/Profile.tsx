import { PageTransition } from '@/components/PageTransition'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import useAppStore, { CORE_SUBJECTS } from '@/stores/useAppStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { User as UserIcon } from 'lucide-react'
import { getInitials } from '@/lib/utils'

export default function Profile() {
  const { user, updateUser, theme, toggleTheme } = useAppStore()
  const initials = getInitials(user.name)

  const toggleDifficulty = (sub: any) => {
    const isDif = user.difficultSubjects.includes(sub)
    if (isDif) updateUser({ difficultSubjects: user.difficultSubjects.filter((s) => s !== sub) })
    else updateUser({ difficultSubjects: [...user.difficultSubjects, sub] })
  }

  return (
    <PageTransition className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-display font-bold">Configurações e Perfil</h1>

      <Card>
        <CardHeader>
          <CardTitle>Identidade do Estudante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">
                {initials ? initials : <UserIcon className="w-8 h-8" />}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline">Mudar Foto</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input value={user.name} onChange={(e) => updateUser({ name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Ano Escolar</Label>
              <Input
                value={user.schoolYear}
                onChange={(e) => updateUser({ schoolYear: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Objetivo Principal (Vestibular)</Label>
              <Input value={user.goal} onChange={(e) => updateUser({ goal: e.target.value })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Matérias de Maior Dificuldade</CardTitle>
          <CardDescription>O Consultor IA usa isso para focar nas suas fraquezas.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CORE_SUBJECTS.map((sub) => (
              <div
                key={sub}
                className="flex items-center space-x-2 p-2 border rounded-lg hover:border-primary transition-colors"
              >
                <Checkbox
                  id={`dif-${sub}`}
                  checked={user.difficultSubjects.includes(sub)}
                  onCheckedChange={() => toggleDifficulty(sub)}
                />
                <Label htmlFor={`dif-${sub}`} className="text-sm font-medium cursor-pointer">
                  {sub}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferências e Rotina</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Horas de Estudo Semanais</Label>
              <Input
                type="number"
                value={user.weeklyStudyHours}
                onChange={(e) => updateUser({ weeklyStudyHours: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Média Diária (horas)</Label>
              <Input
                type="number"
                value={user.dailyStudyTime}
                onChange={(e) => updateUser({ dailyStudyTime: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-0.5">
                <Label>Modo Escuro</Label>
                <p className="text-xs text-muted-foreground">Ajuste o visual da plataforma.</p>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
          </div>
        </CardContent>
      </Card>
    </PageTransition>
  )
}
