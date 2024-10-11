"use client";
import React, { useMemo } from 'react';
import { Home, Plus, MessageSquare, User, ListOrderedIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSafeArea } from '@/provider/safeAreaProvider';

const navItems = [
    { id: 'home', icon: Home, href: '/' },
    { id: 'add', icon: Plus, href: '/products' },
    { id: 'messages', icon: ListOrderedIcon, href: '/orders' },
    { id: 'profile', icon: User, href: '/profile' },
];

const BottomNav = () => {
    const pathname = usePathname();
    const { safeAreaClasses } = useSafeArea();
    const activeTab = useMemo(() => {
        const path = pathname.split('/').pop() || 'home';
        return navItems.find(item => item.id === path || item.href === pathname)?.id || 'home';
    }, [pathname]);

    return (
        <div className={`fixed bottom-0 left-0 right-0 bg-gray-900 rounded-xl z-10 ${safeAreaClasses} pad-bottom`}>
            <nav className="flex justify-between p-4 max-w-md mx-auto">
                {navItems.map(({ id, icon: Icon, href }) => (
                    <Link href={href} key={id}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`${activeTab === id
                                ? "bg-red-500 text-white"
                                : "text-gray-400"
                            } w-12 h-12 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-200`}
                        >
                            <Icon className="h-6 w-6" />
                        </Button>
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default BottomNav;