import { PageTransition } from '@/components/PageTransition'
import { ChatInterface } from '@/components/ChatInterface'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CORE_SUBJECTS } from '@/stores/useAppStore'

export default function DuvidasIA() {
  const HeaderSlot = (
    <Select defaultValue={CORE_SUBJECTS[0]}>
      <SelectTrigger className="w-[160px] h-8 bg-white/20 border-none text-white focus:ring-0 placeholder:text-white text-xs">
        <SelectValue placeholder="Matéria" />
      </SelectTrigger>
      <SelectContent>
        {CORE_SUBJECTS.map((sub) => (
          <SelectItem key={sub} value={sub}>
            {sub}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  return (
    <PageTransition>
      <ChatInterface
        title="Professor IA"
        description="Sou especialista nas matérias do vestibular. Me pergunte qualquer conceito."
        themeClass="bg-expert"
        avatarColor="bg-expert-foreground/20"
        suggestions={[
          'Resuma este tópico',
          'Me dê um exemplo passo a passo',
          'Explique de forma simples',
        ]}
        headerSlot={HeaderSlot}
      />
    </PageTransition>
  )
}
