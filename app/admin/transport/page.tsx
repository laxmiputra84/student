"use client";

import { useState, useEffect } from "react";
import {
    MapPin,
    Bus,
    Plus,
    Trash2,
    Edit3,
    X,
    ChevronRight,
    Clock,
    Users,
    Search,
    RefreshCcw,
    Database
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Stop {
    id: string;
    route_id: string;
    name: string;
    arrival_time: string;
    student_count: number;
}

interface Route {
    id: string;
    name: string;
    bus_no: string;
    driver: string;
    status: string;
    transport_stops?: Stop[];
}

export default function TransportManagement() {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStopModalOpen, setIsStopModalOpen] = useState(false);
    const [activeRoute, setActiveRoute] = useState<Route | null>(null);

    const [routeForm, setRouteForm] = useState({
        name: "",
        bus_no: "",
        driver: "",
        status: "Active"
    });

    const [stopForm, setStopForm] = useState({
        name: "",
        arrival_time: "08:00 AM",
        student_count: "0"
    });

    async function fetchRoutes() {
        setLoading(true);
        try {
            const { data, error: sbError } = await supabase
                .from('transport_routes')
                .select(`
          *,
          transport_stops (*)
        `)
                .order('name');

            if (sbError) throw sbError;
            setRoutes(data || []);
        } catch (err: any) {
            console.error("Error fetching routes:", err.message);
            // Fallback
            setRoutes([
                { id: "1", name: "North Route (Route A)", bus_no: "KA-01-F-1234", driver: "Manjunath", status: "Active", transport_stops: [] },
            ]);
        } finally {
            setLoading(false);
        }
    }

    // Route Actions
    const handleSaveRoute = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (activeRoute) {
                const { error: sbError } = await supabase
                    .from('transport_routes')
                    .update(routeForm)
                    .eq('id', activeRoute.id);
                if (sbError) throw sbError;
            } else {
                const { error: sbError } = await supabase
                    .from('transport_routes')
                    .insert([routeForm]);
                if (sbError) throw sbError;
            }
            setIsModalOpen(false);
            setActiveRoute(null);
            fetchRoutes();
        } catch (err: any) {
            console.error("Error saving route:", err.message);
            setIsModalOpen(false);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRoute = async (id: any) => {
        if (!confirm("Delete this entire transport route?")) return;
        try {
            const { error: sbError } = await supabase
                .from('transport_routes')
                .delete()
                .eq('id', id);
            if (sbError) throw sbError;
            fetchRoutes();
        } catch (err) {
            setRoutes(routes.filter(r => r.id !== id));
        }
    };

    // Stop Actions
    const handleSaveStop = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!activeRoute) return;
            const payload = {
                ...stopForm,
                route_id: activeRoute.id,
                student_count: parseInt(stopForm.student_count)
            };

            const { error: sbError } = await supabase
                .from('transport_stops')
                .insert([payload]);

            if (sbError) throw sbError;

            setIsStopModalOpen(false);
            setStopForm({ name: "", arrival_time: "08:00 AM", student_count: "0" });
            fetchRoutes();
        } catch (err: any) {
            console.error("Error saving stop:", err.message);
            setIsStopModalOpen(false);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStop = async (id: any) => {
        if (!confirm("Remove this stop from the route?")) return;
        try {
            const { error: sbError } = await supabase
                .from('transport_stops')
                .delete()
                .eq('id', id);
            if (sbError) throw sbError;
            fetchRoutes();
        } catch (err) {
            console.error("Delete stop error:", err);
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    return (
        <div className="space-y-10 pb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                        Transport <span className="gradient-text">Logistics</span>
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2 font-medium">
                        <Database size={14} className="text-primary" />
                        {loading ? "Syncing..." : "Live transport network active."}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchRoutes} disabled={loading} className="gap-2 font-bold h-11 px-6">
                        <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => { setActiveRoute(null); setRouteForm({ name: "", bus_no: "", driver: "", status: "Active" }); setIsModalOpen(true); }}
                        className="bg-primary hover:bg-primary/90 font-black px-8 h-11 gap-2 uppercase italic tracking-tighter"
                    >
                        <Plus size={18} /> New Route
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {routes.map((route) => (
                    <Card key={route.id} className="border-white/5 bg-card/30 overflow-hidden group animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
                            <div className="lg:w-1/3 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner">
                                            <Bus size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">{route.name}</h3>
                                            <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest border-white/10">{route.bus_no}</Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => { setActiveRoute(route); setRouteForm({ name: route.name, bus_no: route.bus_no, driver: route.driver, status: route.status }); setIsModalOpen(true); }}
                                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all rounded-lg"
                                        >
                                            <Edit3 size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteRoute(route.id)}
                                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-all rounded-lg"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-xl bg-background/50 border border-white/5 shadow-inner">
                                        <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Driver</p>
                                        <p className="text-sm font-bold">{route.driver}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-background/50 border border-white/5 shadow-inner">
                                        <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Bus Status</p>
                                        <Badge variant="success" className="h-5 text-[9px] uppercase font-black">{route.status}</Badge>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => { setActiveRoute(route); setIsStopModalOpen(true); }}
                                    className="w-full bg-white/5 hover:bg-white/10 text-xs font-bold gap-2 py-6 rounded-xl border border-white/5 border-dashed transition-all"
                                >
                                    <Plus size={16} /> Add Bus Stop Point
                                </Button>
                            </div>

                            <div className="flex-1">
                                <div className="mb-4 flex items-center justify-between">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Route Sequence</h4>
                                    <span className="text-[10px] font-bold text-muted-foreground">{route.transport_stops?.length || 0} Total Points</span>
                                </div>
                                <div className="relative space-y-4">
                                    <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent border-l border-dashed border-primary/30" />
                                    {(!route.transport_stops || route.transport_stops.length === 0) ? (
                                        <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                                            <p className="text-sm text-muted-foreground italic font-medium">No stops added to this route yet.</p>
                                        </div>
                                    ) : route.transport_stops.map((stop: any, idx: number) => (
                                        <div key={stop.id} className="relative flex items-center justify-between pl-8 group/stop transition-all animate-in slide-in-from-left-4 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                                            <div className="absolute left-0 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10 scale-75 shadow-lg group-hover/stop:scale-90 transition-transform">
                                                <MapPin size={12} className="text-primary" />
                                            </div>
                                            <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between pr-4 py-1">
                                                <div>
                                                    <p className="font-bold text-sm tracking-tight group-hover/stop:text-primary transition-colors">{stop.name}</p>
                                                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
                                                        <span className="flex items-center gap-1"><Clock size={10} /> {stop.arrival_time}</span>
                                                        <span className="flex items-center gap-1"><Users size={10} /> {stop.student_count} Students Registered</span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteStop(stop.id)}
                                                    className="opacity-0 group-hover/stop:opacity-100 text-destructive hover:bg-destructive/10 h-7 px-2 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={12} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* New Route Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-md animate-in fade-in transition-all">
                    <Card className="w-full max-w-lg border-white/10 bg-card/90 shadow-2xl backdrop-blur-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="h-1.5 bg-gradient-to-r from-primary to-orange-500" />
                        <CardHeader className="flex flex-row items-center justify-between pt-8 border-b border-white/5 pb-6">
                            <div>
                                <CardTitle className="text-2xl font-black uppercase italic tracking-tighter">
                                    {activeRoute ? "Modify" : "Create"} <span className="gradient-text">Route</span>
                                </CardTitle>
                                <CardDescription className="font-medium italic">Transport Network Configuration active.</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="rounded-xl">
                                <X size={20} />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleSaveRoute} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Route Logical Name</label>
                                        <input
                                            type="text"
                                            value={routeForm.name}
                                            onChange={(e) => setRouteForm({ ...routeForm, name: e.target.value })}
                                            placeholder="e.g. North Outer Ring"
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold shadow-inner"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Bus Number Plate</label>
                                        <input
                                            type="text"
                                            value={routeForm.bus_no}
                                            onChange={(e) => setRouteForm({ ...routeForm, bus_no: e.target.value })}
                                            placeholder="KA-XX-XX-XXXX"
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono font-bold shadow-inner"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Primary Driver</label>
                                        <input
                                            type="text"
                                            value={routeForm.driver}
                                            onChange={(e) => setRouteForm({ ...routeForm, driver: e.target.value })}
                                            placeholder="Full Name"
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold shadow-inner"
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-black uppercase italic tracking-tighter" disabled={loading}>
                                    {loading ? "Processing..." : "Commit Route Records"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Add Stop Modal */}
            {isStopModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-md animate-in fade-in transition-all">
                    <Card className="w-full max-w-md border-white/10 bg-card/90 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-white/5 bg-white/[0.02] pt-8">
                            <CardTitle className="text-xl font-bold uppercase italic tracking-tight px-2">Add <span className="text-primary italic">Point</span> of Entry</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setIsStopModalOpen(false)} className="rounded-xl">
                                <X size={20} />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleSaveStop} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground ml-1">Point/Stop Name</label>
                                        <input
                                            type="text"
                                            value={stopForm.name}
                                            onChange={(e) => setStopForm({ ...stopForm, name: e.target.value })}
                                            placeholder="e.g. Silk Board"
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold shadow-inner"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground ml-1">Pick-up Time</label>
                                            <input
                                                type="text"
                                                value={stopForm.arrival_time}
                                                onChange={(e) => setStopForm({ ...stopForm, arrival_time: e.target.value })}
                                                placeholder="07:00 AM"
                                                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold shadow-inner"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground ml-1">Registered Students</label>
                                            <input
                                                type="number"
                                                value={stopForm.student_count}
                                                onChange={(e) => setStopForm({ ...stopForm, student_count: e.target.value })}
                                                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold shadow-inner"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 font-black uppercase italic" disabled={loading}>
                                    {loading ? "Syncing Point..." : "Finalize Point entry"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
