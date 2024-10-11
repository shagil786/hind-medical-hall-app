"use client"
import React from 'react';
import { Bell, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/provider/cartProvider';
import { useNotificationManager } from '@/provider/notificationProvider';
import { useSafeArea } from '@/provider/safeAreaProvider';
import logo from '@/public/images/icon.png'

// Add cartItemCount prop
const TopBar = () => {
    const { totalCount, setShowCart } = useCart();
    const { notificationCount, toggleNotificationComponent } = useNotificationManager();
    const { safeAreaClasses } = useSafeArea();
    return (
        <div className={`fixed top-0 left-0 right-0 z-10 ${safeAreaClasses} pad-top`}>
            <div className="flex items-center justify-between px-4 py-2 max-w-md mx-auto">
                <div className="bg-black rounded-full p-2 relative" onClick={toggleNotificationComponent}>
                    <Bell className="h-6 w-6 text-white" />
                    {notificationCount > 0 && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-2 w-2 flex items-center justify-center" />
                    )}
                </div>

                <div className="flex items-center">
                    <Image
                        src={logo} // Replace with your actual icon path
                        alt="App Icon"
                        width={40}
                        height={40}
                        className="mr-2"
                    />
                    <span className="font-semibold text-md">Hind Medical Hall</span>
                </div>

                <div className="bg-black rounded-full p-2 relative">
                    <ShoppingCart className="h-6 w-6 text-white" onClick={() => setShowCart(true)} />
                    {totalCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {totalCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBar;
