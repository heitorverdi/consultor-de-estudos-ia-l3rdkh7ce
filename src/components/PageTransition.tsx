import React from 'react'
import { cn } from '@/lib/utils'

export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('animate-fade-in-up w-full max-w-7xl mx-auto', className)}>{children}</div>
  )
}
