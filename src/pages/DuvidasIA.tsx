import { PageTransition } from '@/components/PageTransition'
import { ChatInterface } from '@/components/ChatInterface'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function DuvidasIA() {
  const HeaderSlot = (
    <Select defaultValue="math">
      <SelectTrigger className="w-[140px] h-8 bg-white/20 border-none text-white focus:ring-0 placeholder:text-white">
        <SelectValue placeholder="Matéria" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="math">Matemática</SelectItem>
        <SelectItem value="bio">Biologia</SelectItem>
        <SelectItem value="hist">História</SelectItem>
      </SelectContent>
    </Select>
  )

  return (
    <PageTransition>
      <ChatInterface
        title="Professor IA"
        description="Sou especialista nas matérias. Me pergunte qualquer conceito."
        themeClass="bg-expert"
        avatarColor="bg-expert-foreground/20"
        suggestions={[
          'Resuma este tópico',
          'Me dê um exemplo passo a passo',
          'Gerar flashcard disso',
        ]}
        headerSlot={HeaderSlot}
      />
    </PageTransition>
  )
}
