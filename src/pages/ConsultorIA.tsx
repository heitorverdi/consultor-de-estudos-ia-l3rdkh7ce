import { PageTransition } from '@/components/PageTransition'
import { ChatInterface } from '@/components/ChatInterface'

export default function ConsultorIA() {
  return (
    <PageTransition>
      <ChatInterface
        title="Consultor Estratégico"
        description="Sou focado em organizar sua rotina e métodos de estudo."
        themeClass="bg-consultant"
        avatarColor="bg-consultant-foreground/20"
        suggestions={['Gerar plano semanal', 'Estou cansado, ajuste hoje', 'Como estudar redação?']}
      />
    </PageTransition>
  )
}
