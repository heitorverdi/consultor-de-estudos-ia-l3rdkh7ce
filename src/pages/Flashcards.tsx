import { useState } from 'react'
import { PageTransition } from '@/components/PageTransition'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Sparkles, Plus, PlayCircle, Layers } from 'lucide-react'
import { toast } from 'sonner'
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
import useAppStore, { CORE_SUBJECTS } from '@/stores/useAppStore'

export default function Flashcards() {
  const { decks, addDeck, updateDeck } = useAppStore()
  const [studyMode, setStudyMode] = useState<string | null>(null)
  const [flipped, setFlipped] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [newDeckModal, setNewDeckModal] = useState(false)
  const [newCardModal, setNewCardModal] = useState(false)
  const [aiModalOpen, setAiModalOpen] = useState(false)

  const [deckForm, setDeckForm] = useState({ title: '', subject: CORE_SUBJECTS[0] })
  const [cardForm, setCardForm] = useState({ front: '', back: '' })
  const [aiTopic, setAiTopic] = useState('')

  const activeDeck = decks.find((d) => d.id === studyMode)

  const handleStudy = (id: string) => {
    setStudyMode(id)
    setCurrentIndex(0)
    setFlipped(false)
  }
  const handleExitStudy = () => {
    setStudyMode(null)
    setFlipped(false)
  }
  const handleAnswer = () => {
    if (currentIndex < activeDeck!.cards.length - 1) {
      setCurrentIndex((c) => c + 1)
      setFlipped(false)
    } else {
      toast.success('Revisão concluída!')
      handleExitStudy()
    }
  }

  if (studyMode && activeDeck) {
    if (activeDeck.cards.length === 0) {
      return (
        <PageTransition className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
          <Layers className="w-12 h-12 text-muted-foreground opacity-50" />
          <h2 className="text-2xl font-display font-medium">Deck Vazio</h2>
          <p className="text-muted-foreground mb-6">
            Você ainda não tem flashcards nesta matéria. Deseja criar agora?
          </p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleExitStudy}>
              Voltar
            </Button>
            <Button onClick={() => setAiModalOpen(true)} className="bg-expert text-white">
              <Sparkles className="w-4 h-4 mr-2" /> Gerar IA
            </Button>
            <Button onClick={() => setNewCardModal(true)}>Criar Manual</Button>
          </div>
          {renderModals()}
        </PageTransition>
      )
    }

    const card = activeDeck.cards[currentIndex]
    return (
      <PageTransition className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto py-8">
        <div className="w-full flex justify-between items-center mb-6">
          <span className="text-sm font-medium text-muted-foreground">
            {activeDeck.title} • {currentIndex + 1}/{activeDeck.cards.length}
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleExitStudy}>
              Continuar depois
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                toast.success('Revisão encerrada.')
                handleExitStudy()
              }}
            >
              Encerrar
            </Button>
          </div>
        </div>
        <Card
          className="w-full h-96 flex items-center justify-center cursor-pointer hover:shadow-lg transition-all relative"
          onClick={() => setFlipped(!flipped)}
        >
          <CardContent className="text-center p-8">
            <h2 className="text-3xl font-display font-medium leading-tight">
              {flipped ? card.back : card.front}
            </h2>
            <p className="absolute bottom-4 left-0 right-0 text-xs text-muted-foreground">
              {flipped ? 'Resposta' : 'Clique para virar'}
            </p>
          </CardContent>
        </Card>
        {flipped ? (
          <div className="flex gap-4 mt-8 w-full animate-fade-in-up">
            <Button
              variant="outline"
              className="flex-1 border-red-200 text-red-600"
              onClick={handleAnswer}
            >
              Difícil
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-yellow-200 text-yellow-600"
              onClick={handleAnswer}
            >
              Médio
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-green-200 text-green-600"
              onClick={handleAnswer}
            >
              Fácil
            </Button>
          </div>
        ) : (
          <div className="flex justify-between w-full mt-8">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentIndex((c) => c - 1)
                setFlipped(false)
              }}
              disabled={currentIndex === 0}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCurrentIndex((c) => c + 1)
                setFlipped(false)
              }}
              disabled={currentIndex === activeDeck.cards.length - 1}
            >
              Próximo
            </Button>
          </div>
        )}
      </PageTransition>
    )
  }

  function renderModals() {
    return (
      <>
        <Dialog open={newDeckModal} onOpenChange={setNewDeckModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Deck</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                addDeck({
                  id: Date.now().toString(),
                  title: deckForm.title,
                  subject: deckForm.subject,
                  cards: [],
                  progress: 0,
                  dueToday: 0,
                })
                setNewDeckModal(false)
                toast.success('Deck criado!')
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  required
                  value={deckForm.title}
                  onChange={(e) => setDeckForm({ ...deckForm, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Matéria</Label>
                <Select
                  value={deckForm.subject}
                  onValueChange={(v: any) => setDeckForm({ ...deckForm, subject: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
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
              <Button type="submit" className="w-full">
                Criar Deck
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={newCardModal} onOpenChange={setNewCardModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Card Manual</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (activeDeck) {
                  updateDeck(activeDeck.id, {
                    cards: [
                      ...activeDeck.cards,
                      { id: Date.now().toString(), front: cardForm.front, back: cardForm.back },
                    ],
                  })
                  setNewCardModal(false)
                  setCardForm({ front: '', back: '' })
                  toast.success('Card adicionado!')
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Frente (Pergunta)</Label>
                <Input
                  required
                  value={cardForm.front}
                  onChange={(e) => setCardForm({ ...cardForm, front: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Verso (Resposta)</Label>
                <Input
                  required
                  value={cardForm.back}
                  onChange={(e) => setCardForm({ ...cardForm, back: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">
                Adicionar
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-expert" /> Gerador Mágico
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                toast.promise(new Promise((r) => setTimeout(r, 2000)), {
                  loading: 'Gerando...',
                  success: () => {
                    if (activeDeck) {
                      updateDeck(activeDeck.id, {
                        cards: [
                          ...activeDeck.cards,
                          {
                            id: Date.now().toString(),
                            front: `Pergunta IA sobre ${aiTopic}?`,
                            back: 'Resposta detalhada gerada.',
                          },
                        ],
                      })
                      setAiModalOpen(false)
                      return 'Cards gerados!'
                    }
                    return ''
                  },
                })
              }}
              className="space-y-4 mt-4"
            >
              <Input
                placeholder="Tópico. Ex: Fotossíntese"
                required
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
              />
              <Button type="submit" className="w-full bg-expert hover:bg-expert/90 text-white">
                Gerar Cards
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <PageTransition className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold">Seus Decks</h1>
          <p className="text-sm text-muted-foreground">Repetição espaçada inteligente.</p>
        </div>
        <Button onClick={() => setNewDeckModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Novo Deck
        </Button>
      </div>
      {decks.length === 0 ? (
        <Card className="w-full flex flex-col items-center justify-center p-12 text-center border-dashed">
          <Layers className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-display font-medium">Nenhum deck encontrado</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
            Crie seu primeiro deck para começar a praticar.
          </p>
          <Button onClick={() => setNewDeckModal(true)}>
            <Plus className="w-4 h-4 mr-2" /> Criar Primeiro Deck
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <Card key={deck.id} className="hover-card-effect flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg leading-tight">{deck.title}</CardTitle>
                </div>
                <p className="text-xs text-muted-foreground">
                  {deck.subject} • {deck.cards.length} cards
                </p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end space-y-4 pt-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Domínio</span>
                    <span className="font-medium">{deck.progress}%</span>
                  </div>
                  <Progress value={deck.progress} className="h-2" />
                </div>
                <Button className="w-full" onClick={() => handleStudy(deck.id)}>
                  <PlayCircle className="w-4 h-4 mr-2" /> Iniciar Revisão
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {renderModals()}
    </PageTransition>
  )
}
