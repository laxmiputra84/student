"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Building2, TrendingUp, Search, Calendar, CheckCircle2, AlertCircle, Clock, Users, GraduationCap, UserPlus, BookOpen, Settings as SettingsIcon, MapPin, CalendarCheck, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import RealTimeAdminStats from "@/components/real-time-admin-stats";
import LiveActivityFeed from "@/components/live-activity-feed";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
    const { role, user } = useAuth();
    const router = useRouter();
    const [deptStats, setDeptStats] = useState<{ dept: string, value: number, students: number }[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        // Basic protection
        if (role !== "admin" && role !== "dual") {
            router.push("/login");
        }
    }, [role, router]);

    useEffect(() => {
        async function fetchDeptStats() {
            try {
                const { data, error } = await supabase.from('students').select('branch, attendance');
                if (data) {
                    const groups = data.reduce((acc: any, curr: any) => {
                        const branch = curr.branch || "Unknown";
                        if (!acc[branch]) acc[branch] = { sum: 0, count: 0 };
                        acc[branch].sum += Number(curr.attendance || 0);
                        acc[branch].count += 1;
                        return acc;
                    }, {});

                    const stats = Object.keys(groups).map(branch => ({
                        dept: branch === "CSE" ? "Computer Science" :
                            branch === "ECE" ? "Electronics" :
                                branch === "ME" ? "Mechanical" : branch,
                        value: Math.round(groups[branch].sum / groups[branch].count),
                        students: groups[branch].count
                    }));
                    setDeptStats(stats);
                }
            } catch (err) {
                console.error("Error fetching dept stats:", err);
            } finally {
                setLoadingStats(false);
            }
        }
        fetchDeptStats();
    }, []);

    if (role !== "admin" && role !== "dual") {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-muted-foreground font-medium animate-pulse">Verifying Credentials...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                        Admin <span className="gradient-text">Console</span>
                    </h1>
                    <p className="text-muted-foreground font-medium">Welcome back, {user?.name}. System-wide overview active.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="font-bold">Generate Report</Button>
                    <Button className="bg-primary hover:bg-primary/90 font-bold px-6">System Settings</Button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-2">
                {[
                    { label: "New Student", icon: <UserPlus size={18} />, href: "/admin/students", color: "from-blue-600 to-blue-400" },
                    { label: "New Staff", icon: <Users size={18} />, href: "/admin/staff", color: "from-purple-600 to-purple-400" },
                    { label: "New Subject", icon: <BookOpen size={18} />, href: "/admin/subjects", color: "from-emerald-600 to-emerald-400" },
                    { label: "Academic Works", icon: <Briefcase size={18} />, href: "/admin/works", color: "from-cyan-600 to-cyan-400" },
                    { label: "Transport", icon: <MapPin size={18} />, href: "/admin/transport", color: "from-orange-600 to-orange-400" },
                    { label: "Mark Attendance", icon: <CalendarCheck size={18} />, href: "/admin/attendance/mark", color: "from-rose-600 to-rose-400" },
                    { label: "Global Settings", icon: <SettingsIcon size={18} />, href: "/admin/settings", color: "from-amber-600 to-amber-400" },
                ].map((action, i) => (
                    <button
                        key={i}
                        onClick={() => router.push(action.href)}
                        className="group relative h-24 rounded-2xl border border-white/5 bg-card/30 backdrop-blur-md p-4 transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden"
                    >
                        <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br", action.color)} />
                        <div className="flex flex-col items-center justify-center gap-2 relative z-10">
                            <div className="p-2 rounded-xl bg-muted/50 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all">
                                {action.icon}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">{action.label}</span>
                        </div>
                    </button>
                ))}
            </div>

            <RealTimeAdminStats />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-white/5 bg-card/50">
                    <CardHeader className="border-b border-border/50 pb-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Attendance Compliance</CardTitle>
                                <CardDescription>Department-wise metrics for semester 6.</CardDescription>
                            </div>
                            <Badge variant="outline" className="animate-pulse px-2 py-0 h-5 text-[8px] border-emerald-500/50 text-emerald-500 bg-emerald-500/10">Live Node Active</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {loadingStats ? (
                                <div className="py-10 text-center animate-pulse font-bold text-muted-foreground uppercase tracking-widest text-xs">
                                    Calculating Compliance...
                                </div>
                            ) : deptStats.length > 0 ? deptStats.map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="font-bold text-sm tracking-tight">{item.dept}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.1em] opacity-60">{item.students} Enrolled</p>
                                        </div>
                                        <span className={`text-sm font-black italic ${item.value < 75 ? 'text-destructive' : 'text-emerald-500'}`}>
                                            {item.value}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-muted/50 rounded-full overflow-hidden p-0.5 border border-white/5">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${item.value < 75 ? 'bg-destructive' : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                                }`}
                                            style={{ width: `${item.value}%` }}
                                        />
                                    </div>
                                </div>
                            )) : (
                                <div className="py-10 text-center text-muted-foreground italic text-sm">
                                    No department data available.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/5 bg-card/40 backdrop-blur-md">
                    <CardHeader className="border-b border-border/50 pb-6 mb-6 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Live Activity</CardTitle>
                            <CardDescription>Real-time system event logs</CardDescription>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    </CardHeader>
                    <CardContent className="p-6">
                        <LiveActivityFeed />
                        <Button variant="ghost" className="w-full mt-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-dashed border-border/50 hover:border-primary/40 hover:text-primary transition-all">
                            Initialize Full Audit
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
