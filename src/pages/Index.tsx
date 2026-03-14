import useAppStore from '@/stores/useAppStore'
import { Onboarding } from './Onboarding'
import { Dashboard } from './Dashboard'

export default function Index() {
  const { user } = useAppStore()

  if (!user.onboarded) {
    return <Onboarding />
  }

  return <Dashboard />
}
