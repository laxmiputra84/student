"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, Activity, Zap, BookOpen, GraduationCap, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function RealTimeAdminStats() {
    const [stats, setStats] = useState([
        { id: 'students', label: "Total Students", value: 0, icon: <GraduationCap className="text-blue-400" />, delta: 0 },
        { id: 'staff', label: "Total Personnel", value: 0, icon: <Users className="text-purple-400" />, delta: 0 },
        { id: 'subjects', label: "Curriculum Map", value: 0, icon: <BookOpen className="text-emerald-400" />, delta: 0 },
        { id: 'works', label: "Active Works", value: 0, icon: <Briefcase className="text-amber-400" />, delta: 0 },
    ]);

    async function fetchDatabaseStats() {
        try {
            const [
                { count: studentsCount },
                { count: staffCount },
                { count: subjectsCount },
                { count: worksCount }
            ] = await Promise.all([
                supabase.from('students').select('*', { count: 'exact', head: true }),
                supabase.from('staff').select('*', { count: 'exact', head: true }),
                supabase.from('subjects').select('*', { count: 'exact', head: true }),
                supabase.from('academic_works').select('*', { count: 'exact', head: true }),
            ]);

            setStats(prev => prev.map(s => {
                let newValue = 0;
                if (s.id === 'students') newValue = studentsCount || 0;
                if (s.id === 'staff') newValue = staffCount || 0;
                if (s.id === 'subjects') newValue = subjectsCount || 0;
                if (s.id === 'works') newValue = worksCount || 0;

                return { ...s, value: newValue, delta: newValue - s.value };
            }));
        } catch (err) {
            console.error("Error fetching admin stats:", err);
            // Fallback for demo
            setStats(prev => prev.map(s => ({ ...s, value: s.value || 12 })));
        }
    }

    useEffect(() => {
        fetchDatabaseStats();
        // Refresh every minute for stats
        const interval = setInterval(fetchDatabaseStats, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
                <Card key={i} className="group hover:border-primary/30 transition-all duration-300 border-white/5 bg-card/50 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <CardContent className="p-6 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center border border-border group-hover:scale-110 transition-transform duration-500 shadow-inner">
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-black tabular-nums tracking-tighter italic">
                                    {stat.value.toLocaleString()}
                                </p>
                                {stat.delta !== 0 && (
                                    <span className={cn(
                                        "text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter",
                                        stat.delta > 0 ? "text-emerald-500 bg-emerald-500/10" : "text-destructive bg-destructive/10"
                                    )}>
                                        {stat.delta > 0 ? "Sync+" : ""}{stat.delta}
                                    </span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
