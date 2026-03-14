import { Outlet } from 'react-router-dom'
import { DesktopSidebar } from './DesktopSidebar'
import { MobileNav } from './MobileNav'
import { Header } from './Header'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function Layout() {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <ScrollArea className="flex-1 px-4 py-6 md:px-8 md:py-8 mb-16 md:mb-0 bg-secondary/30">
          <Outlet />
        </ScrollArea>
        <MobileNav />
      </div>
    </div>
  )
}
