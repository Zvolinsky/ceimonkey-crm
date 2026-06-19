'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const tabs = [
    { href: '/dashboard/caregivers', label: 'Familias' },
    { href: '/dashboard/leads', label: 'Leads' },
]

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <div>
            <nav className="border-b px-8 pt-4">
                <div className="flex gap-1">
                    {tabs.map(tab => {
                        const isActive = pathname.startsWith(tab.href)
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={cn(
                                    'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                                    isActive
                                        ? 'border-primary text-foreground'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                )}
                            >
                                {tab.label}
                            </Link>
                        )
                    })}
                </div>
            </nav>
            {children}
        </div>
    )
}