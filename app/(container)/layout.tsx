'use client'
import { useSafeArea } from "@/provider/safeAreaProvider";
import React, { useMemo } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { safeAreaClasses } = useSafeArea();

    const combinedPaddingTop = `calc(var(--inset-top, 0px) + 4rem)`; // 4rem equivalent to pt-16
    const combinedPaddingBottom = `calc(var(--inset-bottom, 0px) + 6rem)`; // 6rem equivalent to pb-24

    return (
        <div 
            className={`w-full h-full ${safeAreaClasses}`} 
            style={{
                paddingTop: combinedPaddingTop,
                paddingBottom: combinedPaddingBottom,
            }}
        >
            {children}
        </div>
    );
}