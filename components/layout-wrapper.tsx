"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { cn } from "@/lib/utils";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === "/login" || pathname === "/register";

    return (
        <div className="flex">
            <Sidebar />
            <main className={cn(
                "flex-1 overflow-y-auto bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-background to-background min-h-screen transition-all duration-300",
                isAuthPage ? "p-0" : "p-10 ml-64"
            )}>
                <div className={cn("mx-auto animate-fade-in-up", isAuthPage ? "w-full" : "max-w-6xl")}>
                    {children}
                </div>
            </main>
        </div>
    );
}
