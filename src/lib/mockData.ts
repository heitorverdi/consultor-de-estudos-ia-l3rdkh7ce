export const MOCK_SUBJECTS = [
  { id: 'math', name: 'Matemática', difficulty: 'high', color: 'bg-red-100 text-red-700' },
  { id: 'bio', name: 'Biologia', difficulty: 'medium', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'hist', name: 'História', difficulty: 'low', color: 'bg-green-100 text-green-700' },
]

export const MOCK_AGENDA_EVENTS = [
  { id: '1', title: 'Escola', start: 7, end: 12, type: 'routine', energy: 'high' },
  { id: '2', title: 'Almoço', start: 12, end: 13, type: 'routine', energy: 'medium' },
  { id: '3', title: 'Revisão Matemática', start: 14, end: 16, type: 'study', energy: 'high' },
  { id: '4', title: 'Exercícios Biologia', start: 16.5, end: 18, type: 'study', energy: 'medium' },
]

export const MOCK_DECKS = [
  { id: 'd1', title: 'Fórmulas de Física', subject: 'Física', progress: 75, dueToday: 12 },
  { id: 'd2', title: 'Revolução Industrial', subject: 'História', progress: 40, dueToday: 5 },
  { id: 'd3', title: 'Citologia Básica', subject: 'Biologia', progress: 90, dueToday: 0 },
]

export const MOCK_TASKS = [
  { id: 't1', title: 'Imprimir lista de Química', completed: false },
  { id: 't2', title: 'Renovar assinatura da plataforma', completed: true },
  { id: 't3', title: 'Organizar mesa de estudos', completed: false },
]
