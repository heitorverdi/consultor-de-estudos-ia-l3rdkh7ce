import { useState } from 'react'
import { PageTransition } from '@/components/PageTransition'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { MOCK_DECKS } from '@/lib/mockData'
import { Sparkles, Plus, PlayCircle, X } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

export default function Flashcards() {
  const [studyMode, setStudyMode] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [aiModalOpen, setAiModalOpen] = useState(false)

  const handleStudy = () => setStudyMode(true)
  const handleExitStudy = () => {
    setStudyMode(false)
    setFlipped(false)
  }

  const handleAnswer = (diff: string) => {
    toast.success(`Marcado como ${diff}. Próximo card!`)
    setFlipped(false)
  }

  const handleGenerateAI = (e: React.FormEvent) => {
    e.preventDefault()
    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: 'Gerando flashcards com IA...',
      success: '5 cards gerados e adicionados ao deck!',
      error: 'Erro ao gerar',
    })
    setAiModalOpen(false)
  }

  if (studyMode) {
    return (
      <PageTransition className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto">
        <div className="w-full flex justify-between items-center mb-6">
          <span className="text-sm font-medium text-muted-foreground">
            Fórmulas de Física • 1/12
          </span>
          <Button variant="ghost" size="icon" onClick={handleExitStudy}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <Card
          className="w-full h-96 flex items-center justify-center cursor-pointer hover-card-effect relative"
          onClick={() => setFlipped(!flipped)}
        >
          <CardContent className="text-center p-8">
            <h2 className="text-3xl font-display font-medium leading-tight">
              {flipped ? 'F = m * a' : 'Qual a fórmula da Segunda Lei de Newton?'}
            </h2>
            <p className="absolute bottom-4 left-0 right-0 text-xs text-muted-foreground">
              {flipped ? 'Frente' : 'Clique para virar'}
            </p>
          </CardContent>
        </Card>

        {flipped && (
          <div className="flex gap-4 mt-8 w-full animate-fade-in-up">
            <Button
              variant="outline"
              className="flex-1 border-red-200 hover:bg-red-50 text-red-600"
              onClick={() => handleAnswer('Difícil')}
            >
              Difícil
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-yellow-200 hover:bg-yellow-50 text-yellow-600"
              onClick={() => handleAnswer('Médio')}
            >
              Médio
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-green-200 hover:bg-green-50 text-green-600"
              onClick={() => handleAnswer('Fácil')}
            >
              Fácil
            </Button>
          </div>
        )}
      </PageTransition>
    )
  }

  return (
    <PageTransition className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold">Seus Decks</h1>
          <p className="text-sm text-muted-foreground">Repetição espaçada inteligente.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            className="bg-expert hover:bg-expert/90 text-white"
            onClick={() => setAiModalOpen(true)}
          >
            <Sparkles className="w-4 h-4 mr-2" /> IA Cria
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_DECKS.map((deck) => (
          <Card key={deck.id} className="hover-card-effect flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg leading-tight">{deck.title}</CardTitle>
                {deck.dueToday > 0 && (
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center font-bold shrink-0">
                    {deck.dueToday}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{deck.subject}</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end space-y-4 pt-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Domínio</span>
                  <span className="font-medium">{deck.progress}%</span>
                </div>
                <Progress value={deck.progress} className="h-2" />
              </div>
              <Button
                className="w-full"
                variant={deck.dueToday > 0 ? 'default' : 'secondary'}
                onClick={handleStudy}
              >
                <PlayCircle className="w-4 h-4 mr-2" />{' '}
                {deck.dueToday > 0 ? 'Revisar Agora' : 'Estudar'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-expert" /> Gerador Mágico
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleGenerateAI} className="space-y-4 mt-4">
            <Input placeholder="Ex: Fotossíntese, Revolução Francesa..." required />
            <Button type="submit" className="w-full bg-expert hover:bg-expert/90 text-white">
              Gerar Cards
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </PageTransition>
  )
}
