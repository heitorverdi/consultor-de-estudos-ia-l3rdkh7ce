import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageTransition } from '@/components/PageTransition'
import { Sparkles, BookOpen, Clock, Target } from 'lucide-react'
import useAppStore, { CORE_SUBJECTS, Subject } from '@/stores/useAppStore'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'

export function Onboarding() {
  const [step, setStep] = useState(1)
  const { updateUser } = useAppStore()

  const [name, setName] = useState('')
  const [schoolYear, setSchoolYear] = useState('')
  const [goal, setGoal] = useState('')
  const [difficultSubjects, setDifficultSubjects] = useState<Subject[]>([])
  const [weeklyStudyHours, setWeeklyStudyHours] = useState(20)
  const [dailyStudyTime, setDailyStudyTime] = useState(4)
  const [peakEnergy, setPeakEnergy] = useState('')
  const [studyPreference, setStudyPreference] = useState('')

  const handleComplete = () => {
    updateUser({
      name,
      schoolYear,
      goal,
      difficultSubjects,
      weeklyStudyHours,
      dailyStudyTime,
      peakEnergy,
      studyPreference,
      onboarded: true,
    })
  }

  return (
    <PageTransition className="flex items-center justify-center min-h-[70vh] py-8">
      <Card className="w-full max-w-xl shadow-elevation border-border/50">
        <CardHeader className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            {step === 1 && <Sparkles className="w-6 h-6 text-primary" />}
            {step === 2 && <Target className="w-6 h-6 text-primary" />}
            {step === 3 && <Clock className="w-6 h-6 text-primary" />}
            {step === 4 && <BookOpen className="w-6 h-6 text-primary" />}
          </div>
          <CardTitle className="text-2xl font-display">
            {step === 1 && 'Bem-vindo ao Consultor IA'}
            {step === 2 && 'Mapeamento de Dificuldades'}
            {step === 3 && 'Sua Rotina de Estudos'}
            {step === 4 && 'Preferências de Estudo'}
          </CardTitle>
          <CardDescription>
            {step === 1 && 'Vamos personalizar sua experiência. Fale um pouco sobre você.'}
            {step === 2 && 'Selecione as matérias que você considera mais difíceis.'}
            {step === 3 && 'Defina sua disponibilidade de tempo para organizarmos a agenda.'}
            {step === 4 && 'Em quais períodos e formatos você estuda melhor?'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="space-y-2">
                <Label>Seu nome</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: João"
                />
              </div>
              <div className="space-y-2">
                <Label>Ano escolar</Label>
                <Input
                  value={schoolYear}
                  onChange={(e) => setSchoolYear(e.target.value)}
                  placeholder="Ex: 3º Ano do Ensino Médio"
                />
              </div>
              <div className="space-y-2">
                <Label>Seu grande objetivo (Vestibular)</Label>
                <Input
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Ex: Medicina USP"
                />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 animate-fade-in-up">
              {CORE_SUBJECTS.map((sub) => (
                <div
                  key={sub}
                  className="flex items-center space-x-2 border p-3 rounded-lg hover:border-primary cursor-pointer transition-colors"
                >
                  <Checkbox
                    id={`sub-${sub}`}
                    checked={difficultSubjects.includes(sub)}
                    onCheckedChange={(c) =>
                      c
                        ? setDifficultSubjects([...difficultSubjects, sub])
                        : setDifficultSubjects(difficultSubjects.filter((s) => s !== sub))
                    }
                  />
                  <Label
                    htmlFor={`sub-${sub}`}
                    className="cursor-pointer font-medium text-xs md:text-sm"
                  >
                    {sub}
                  </Label>
                </div>
              ))}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="space-y-2">
                <Label>Horas de estudo semanais</Label>
                <Input
                  type="number"
                  value={weeklyStudyHours}
                  onChange={(e) => setWeeklyStudyHours(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Média de tempo diário (horas)</Label>
                <Input
                  type="number"
                  value={dailyStudyTime}
                  onChange={(e) => setDailyStudyTime(Number(e.target.value))}
                />
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="space-y-3">
                <Label>Pico de Energia</Label>
                <RadioGroup
                  value={peakEnergy}
                  onValueChange={setPeakEnergy}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  {['Manhã', 'Tarde', 'Noite'].map((p) => (
                    <div key={p} className="flex items-center space-x-2">
                      <RadioGroupItem value={p} id={`peak-${p}`} />
                      <Label htmlFor={`peak-${p}`}>{p}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-3">
                <Label>Formato Preferido</Label>
                <RadioGroup
                  value={studyPreference}
                  onValueChange={setStudyPreference}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  {['Teoria', 'Exercícios', 'Revisão'].map((p) => (
                    <div key={p} className="flex items-center space-x-2">
                      <RadioGroupItem value={p} id={`pref-${p}`} />
                      <Label htmlFor={`pref-${p}`}>{p}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            Voltar
          </Button>
          <Button onClick={() => (step < 4 ? setStep((s) => s + 1) : handleComplete())}>
            {step < 4 ? 'Próximo' : 'Concluir'}
          </Button>
        </CardFooter>
      </Card>
    </PageTransition>
  )
}
