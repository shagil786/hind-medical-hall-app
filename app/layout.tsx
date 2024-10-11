import type { Metadata } from "next";
import { Playfair_Display } from 'next/font/google';
import "./globals.css";
import BottomNav from "@/common/BottomNav";
import TopBar from "@/common/TopBar";
import { CartProvider } from "@/provider/cartProvider";
import { NotificationProvider } from "@/provider/notificationProvider";
import { NotificationDisplay } from "@/common/Notification/Notification";
import { HomeProvider } from "@/provider/homeProvider";
import { Cart } from "@/common/Cart";
import { AddressProvider } from "@/provider/addressProvider";
import { Toaster } from "@/components/ui/toaster";
import { SafeAreaProvider } from "@/provider/safeAreaProvider";
import { AuthProvider } from "@/provider/authProvider";
import { AuthModal } from "@/common/AuthModal/AuthModal";

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair-display',
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={playfairDisplay.variable}>
      <CartProvider>
        <NotificationProvider>
          <AddressProvider>
            <HomeProvider>
              <AuthProvider>
                <body className="font-playfair-display antialiased">
                  <SafeAreaProvider>
                    <NotificationDisplay />
                    <Cart />
                    <TopBar />
                    <main className={`flex flex-col gap-8 row-start-2 items-center sm:items-start h-full`}>
                      {children}
                    </main>
                    <BottomNav />
                    <AuthModal />
                    <Toaster />
                  </SafeAreaProvider>
                </body>
              </AuthProvider>
            </HomeProvider>
          </AddressProvider>
        </NotificationProvider>
      </CartProvider>
    </html>
  );
}