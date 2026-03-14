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
import { Sparkles, BookOpen, Clock } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'

export function Onboarding() {
  const [step, setStep] = useState(1)
  const { updateUser } = useAppStore()
  const [goal, setGoal] = useState('')

  const handleComplete = () => {
    updateUser({ goal, onboarded: true })
  }

  return (
    <PageTransition className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-lg shadow-elevation border-border/50">
        <CardHeader className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            {step === 1 && <Sparkles className="w-6 h-6 text-primary" />}
            {step === 2 && <BookOpen className="w-6 h-6 text-primary" />}
            {step === 3 && <Clock className="w-6 h-6 text-primary" />}
          </div>
          <CardTitle className="text-2xl font-display">
            {step === 1 && 'Bem-vindo ao Consultor IA'}
            {step === 2 && 'Mapeamento de Dificuldades'}
            {step === 3 && 'Definição de Rotina'}
          </CardTitle>
          <CardDescription>
            {step === 1 && 'Vamos personalizar sua experiência. Qual é o seu objetivo principal?'}
            {step === 2 && 'Selecione as matérias que você considera mais difíceis.'}
            {step === 3 && 'Em quais períodos você tem mais energia para estudar?'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal">Seu grande objetivo (Ex: ENEM, Medicina USP)</Label>
                <Input
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Ex: ENEM 2024"
                  className="h-12 text-lg"
                />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="grid grid-cols-2 gap-3">
              {['Matemática', 'Física', 'Química', 'Biologia', 'História', 'Redação'].map((sub) => (
                <div
                  key={sub}
                  className="flex items-center space-x-2 border p-3 rounded-lg hover:border-primary cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label className="cursor-pointer font-medium">{sub}</Label>
                </div>
              ))}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              {['Manhã', 'Tarde', 'Noite'].map((period) => (
                <div
                  key={period}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <span className="font-medium">{period}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8">
                      Baixa
                    </Button>
                    <Button variant="outline" size="sm" className="h-8">
                      Média
                    </Button>
                    <Button variant="default" size="sm" className="h-8">
                      Alta
                    </Button>
                  </div>
                </div>
              ))}
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
          <Button onClick={() => (step < 3 ? setStep((s) => s + 1) : handleComplete())}>
            {step < 3 ? 'Próximo' : 'Concluir'}
          </Button>
        </CardFooter>
      </Card>
    </PageTransition>
  )
}
