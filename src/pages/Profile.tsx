import { useState, useEffect } from 'react'
import { PageTransition } from '@/components/PageTransition'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/hooks/use-auth'
import useAppStore, { CORE_SUBJECTS } from '@/stores/useAppStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { User as UserIcon, Save, Loader2 } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import { toast } from 'sonner'

export default function Profile() {
  const { user: localUser, updateUser, theme, toggleTheme } = useAppStore()
  const { profile, updateProfile, loading } = useAuth()

  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setAvatarUrl(profile.avatar_url || '')
    }
  }, [profile])

  const handleSaveDb = async () => {
    setSaving(true)
    const { error } = await updateProfile({ full_name: fullName, avatar_url: avatarUrl })
    if (error) toast.error('Erro ao salvar perfil no banco de dados.')
    else toast.success('Perfil salvo com sucesso!')
    setSaving(false)
  }

  const toggleDifficulty = (sub: any) => {
    const isDif = localUser.difficultSubjects.includes(sub)
    if (isDif)
      updateUser({ difficultSubjects: localUser.difficultSubjects.filter((s) => s !== sub) })
    else updateUser({ difficultSubjects: [...localUser.difficultSubjects, sub] })
  }

  if (loading) return null
  const initials = getInitials(fullName || localUser.name)

  return (
    <PageTransition className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold">Configurações e Perfil</h1>
        <Button onClick={handleSaveDb} disabled={saving} className="bg-primary hover:bg-primary/90">
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Salvar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Identidade do Estudante (Sincronizado)</CardTitle>
          <CardDescription>Seus dados principais são salvos no Supabase.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={avatarUrl || localUser.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">
                {initials ? initials : <UserIcon className="w-8 h-8" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2 max-w-sm">
              <Label>URL do Avatar</Label>
              <Input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Ano Escolar (Local)</Label>
              <Input
                value={localUser.schoolYear}
                onChange={(e) => updateUser({ schoolYear: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Matérias de Maior Dificuldade (Local)</CardTitle>
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
                  checked={localUser.difficultSubjects.includes(sub)}
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
                value={localUser.weeklyStudyHours}
                onChange={(e) => updateUser({ weeklyStudyHours: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Média Diária (horas)</Label>
              <Input
                type="number"
                value={localUser.dailyStudyTime}
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
