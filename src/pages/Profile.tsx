import { PageTransition } from '@/components/PageTransition'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import useAppStore from '@/stores/useAppStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MOCK_SUBJECTS } from '@/lib/mockData'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function Profile() {
  const { user, updateUser, theme, toggleTheme } = useAppStore()

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
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
            <Button variant="outline">Mudar Foto</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input value={user.name} onChange={(e) => updateUser({ name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Objetivo Principal</Label>
              <Input value={user.goal} onChange={(e) => updateUser({ goal: e.target.value })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Matriz de Dificuldades</CardTitle>
          <CardDescription>O Consultor IA usa isso para focar nas suas fraquezas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {MOCK_SUBJECTS.map((sub) => (
            <div
              key={sub.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border bg-secondary/20 gap-3"
            >
              <span className="font-medium">{sub.name}</span>
              <RadioGroup defaultValue={sub.difficulty} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id={`${sub.id}-low`} />
                  <Label htmlFor={`${sub.id}-low`} className="text-xs">
                    Fácil
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id={`${sub.id}-med`} />
                  <Label htmlFor={`${sub.id}-med`} className="text-xs">
                    Média
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id={`${sub.id}-high`} />
                  <Label htmlFor={`${sub.id}-high`} className="text-xs">
                    Difícil
                  </Label>
                </div>
              </RadioGroup>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-0.5">
              <Label>Modo Escuro</Label>
              <p className="text-xs text-muted-foreground">Ajuste o visual da plataforma.</p>
            </div>
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-0.5">
              <Label>Notificações de Estudo</Label>
              <p className="text-xs text-muted-foreground">Receba alertas antes das sessões.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </PageTransition>
  )
}
