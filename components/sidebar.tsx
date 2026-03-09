"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CalendarCheck,
    Megaphone,
    Home as HomeIcon,
    User,
    LogOut,
    BookMarked,
    ShieldAlert,
    Users as UsersIcon,
    Settings as SettingsIcon,
    Building2,
    ChevronRight,
    LogIn,
    BookOpen
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Sidebar() {
    const pathname = usePathname();
    const { role, user, logout } = useAuth();

    // Hide sidebar on login/register pages
    if (pathname === "/login" || pathname === "/register") return null;

    const studentItems = [
        { name: "My Profile", href: "/dashboard", icon: <User size={18} /> },
        { name: "Attendance", href: "/attendance", icon: <CalendarCheck size={18} /> },
        { name: "Courses", href: "/courses", icon: <BookMarked size={18} /> },
        { name: "Staff Directory", href: "/admin/staff", icon: <UsersIcon size={18} /> },
        { name: "Curriculum", href: "/admin/subjects", icon: <BookOpen size={18} /> },
        { name: "Notices", href: "/announcements", icon: <Megaphone size={18} /> },
    ];

    const adminItems = [
        { name: "Admin Dashboard", href: "/admin/dashboard", icon: <ShieldAlert size={18} /> },
        { name: "Students Central", href: "/admin/students", icon: <UsersIcon size={18} /> },
        { name: "Staff & Faculty", href: "/admin/staff", icon: <UsersIcon size={18} /> },
        { name: "Curriculum Map", href: "/admin/subjects", icon: <BookOpen size={18} /> },
        { name: "Academic Works", href: "/admin/works", icon: <BookMarked size={18} /> },
        { name: "Live Attendance", href: "/admin/attendance/mark", icon: <CalendarCheck size={18} /> },
        { name: "Transport Hub", href: "/admin/transport", icon: <Building2 size={18} /> },
        { name: "Settings", href: "/admin/settings", icon: <SettingsIcon size={18} /> },
    ];

    const isStudent = role === "student" || role === "dual";
    const isAdmin = role === "admin" || role === "dual";
    const isGuest = role === "guest";

    return (
        <aside className="w-64 border-r border-border flex flex-col fixed h-screen bg-card/30 backdrop-blur-3xl z-50">
            <div className="p-8 border-b border-border/50">
                <h1 className="text-2xl font-black gradient-text tracking-tighter uppercase italic">Aura</h1>
                <p className="text-[9px] text-muted-foreground tracking-[0.3em] font-black uppercase opacity-60">Management OS</p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {isGuest && (
                    <div className="p-6 text-center space-y-4">
                        <p className="text-xs text-muted-foreground font-medium">Please sign in to access your portal features.</p>
                        <Link href="/login">
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                                <LogIn size={18} /> Login
                            </button>
                        </Link>
                    </div>
                )}

                {/* Student Section */}
                {isStudent && (
                    <div className="px-4 py-6">
                        <p className="px-4 mb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 flex items-center gap-2">
                            <span className="w-1 h-3 bg-primary rounded-full" /> Student Portal
                        </p>
                        <nav className="space-y-1">
                            {studentItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group duration-300",
                                        pathname === item.href
                                            ? "text-foreground bg-white/[0.05] border-r-2 border-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={cn(
                                            "transition-all duration-300",
                                            pathname === item.href ? "text-primary scale-110" : "group-hover:scale-110 group-hover:text-primary"
                                        )}>
                                            {item.icon}
                                        </span>
                                        <span>{item.name}</span>
                                    </div>
                                    <ChevronRight size={14} className={cn(
                                        "transition-all duration-300",
                                        pathname === item.href ? "opacity-100 translate-x-0" : "opacity-0 group-hover:opacity-40 -translate-x-2 group-hover:translate-x-0"
                                    )} />
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}

                {/* Admin Section */}
                {isAdmin && (
                    <div className="px-4 py-6 border-t border-border/10">
                        <p className="px-4 mb-3 text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <span className="w-1 h-3 bg-primary rounded-full" /> Admin Suite
                        </p>
                        <nav className="space-y-1">
                            {adminItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group duration-300",
                                        pathname === item.href
                                            ? "text-foreground bg-primary/[0.05] border-r-2 border-primary shadow-[inset_0_0_20px_rgba(var(--primary),0.02)]"
                                            : "text-muted-foreground hover:text-foreground hover:bg-primary/[0.03]"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={cn(
                                            "transition-all duration-300",
                                            pathname === item.href ? "text-primary scale-110 italic font-bold" : "group-hover:scale-110 group-hover:text-primary italic font-bold"
                                        )}>
                                            {item.icon}
                                        </span>
                                        <span>{item.name}</span>
                                    </div>
                                    <ChevronRight size={14} className={cn(
                                        "transition-all duration-300",
                                        pathname === item.href ? "opacity-100 translate-x-0" : "opacity-0 group-hover:opacity-40 -translate-x-2 group-hover:translate-x-0"
                                    )} />
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </div>

            {/* User Profile Footer */}
            {!isGuest && (
                <div className="p-4 border-t border-border/50 bg-white/[0.02]">
                    <div className="flex items-center gap-3 p-3 rounded-2xl border border-white/5 bg-card/50">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-lg overflow-hidden shrink-0">
                            <User size={20} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-black truncate uppercase tracking-tight">{user?.name || "User"}</p>
                            <Badge variant="outline" className="text-[8px] h-4 px-1 leading-none uppercase font-bold opacity-60 border-primary/20">
                                {role}
                            </Badge>
                        </div>
                        <button
                            onClick={logout}
                            className="text-muted-foreground hover:text-destructive transition-colors shrink-0 p-1"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            )}
        </aside>
    );
}
