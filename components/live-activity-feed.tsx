"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle2, AlertCircle, Info, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface ActivityLog {
    id: string;
    user_name: string;
    action: string;
    target: string;
    created_at: string;
}

export default function LiveActivityFeed() {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchLogs() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('activity_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(6);

            if (error) throw error;
            setLogs(data || []);
        } catch (err) {
            console.error("Error fetching logs:", err);
            // Fallback for visual demo
            setLogs([
                { id: "1", user_name: "Admin", action: "Logged In", target: "Main Terminal", created_at: new Date().toISOString() },
                { id: "2", user_name: "Admin", action: "Added Student", target: "Laxmiputra", created_at: new Date(Date.now() - 120000).toISOString() },
            ]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLogs();
        const channel = supabase
            .channel('public:activity_logs')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_logs' }, (payload) => {
                setLogs(prev => [payload.new as ActivityLog, ...prev].slice(0, 6));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const getTimeAgo = (timestamp: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
        if (seconds < 60) return "Just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return new Date(timestamp).toLocaleDateString();
    };

    return (
        <div className="space-y-4">
            {loading && logs.length === 0 ? (
                <div className="py-10 text-center opacity-50">
                    <RefreshCw className="animate-spin mx-auto mb-2 text-primary" size={24} />
                    <p className="text-[10px] uppercase font-black tracking-widest italic">Scanning Network...</p>
                </div>
            ) : logs.map((log) => (
                <div
                    key={log.id}
                    className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex gap-4 items-start group hover:bg-white/[0.04] transition-all animate-in fade-in slide-in-from-right-4 duration-500"
                >
                    <div className="p-2 rounded-lg shrink-0 bg-primary/10 text-primary">
                        <Info size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                            <span className="font-black text-[10px] uppercase opacity-60 mr-2 text-muted-foreground">{log.user_name}</span>
                            {log.action}: <span className="italic opacity-80">{log.target}</span>
                        </p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-bold uppercase mt-1">
                            <Clock size={10} /> {getTimeAgo(log.created_at)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
