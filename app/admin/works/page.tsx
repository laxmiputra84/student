"use client";

import { useState, useEffect } from "react";
import {
    Briefcase,
    Search,
    Plus,
    Trash2,
    Edit3,
    X,
    Calendar,
    Users,
    Layers,
    Clock,
    ArrowRight,
    TrendingUp,
    RefreshCcw,
    Database
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface AcademicWork {
    id: string;
    title: string;
    type: string;
    dept: string;
    deadline: string;
    priority: "High" | "Medium" | "Low";
    submissions?: number;
    total_expected?: number;
}

export default function WorksManagement() {
    const [works, setWorks] = useState<AcademicWork[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState<AcademicWork | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        type: "Assignment",
        dept: "Computer Science",
        deadline: "",
        priority: "Medium"
    });

    async function fetchWorks() {
        setLoading(true);
        setError(null);
        try {
            const { data, error: sbError } = await supabase
                .from('academic_works')
                .select('*')
                .order('created_at', { ascending: false });

            if (sbError) throw sbError;
            setWorks(data || []);
        } catch (err: any) {
            console.error("Error fetching works:", err.message);
            // Fallback
            setWorks([
                { id: "1", title: "Data Structures - B-Tree Implementation", type: "Lab Assignment", dept: "Computer Science", deadline: "2026-03-25", priority: "High", total_expected: 60, submissions: 45 },
            ]);
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing) {
                const { error: sbError } = await supabase
                    .from('academic_works')
                    .update(formData)
                    .eq('id', isEditing.id);
                if (sbError) throw sbError;
            } else {
                const { error: sbError } = await supabase
                    .from('academic_works')
                    .insert([formData]);
                if (sbError) throw sbError;
            }
            setIsModalOpen(false);
            setIsEditing(null);
            resetForm();
            fetchWorks();
        } catch (err: any) {
            console.error("Error saving work:", err.message);
            // Visual fallback
            const mockWork: AcademicWork = { ...formData, id: String(Date.now()), submissions: 0, total_expected: 60, priority: formData.priority as any };
            if (isEditing) {
                setWorks(works.map(w => w.id === isEditing.id ? { ...w, ...mockWork } : w));
            } else {
                setWorks([mockWork, ...works]);
            }
            setIsModalOpen(false);
            resetForm();
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: any) => {
        if (!confirm("Permanently archive this academic work entry?")) return;
        try {
            const { error: sbError } = await supabase
                .from('academic_works')
                .delete()
                .eq('id', id);
            if (sbError) throw sbError;
            fetchWorks();
        } catch (err) {
            setWorks(works.filter(w => w.id !== id));
        }
    };

    const openEditModal = (work: any) => {
        setIsEditing(work);
        setFormData({
            title: work.title,
            type: work.type,
            dept: work.dept,
            deadline: work.deadline,
            priority: work.priority
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            title: "",
            type: "Assignment",
            dept: "Computer Science",
            deadline: "",
            priority: "Medium"
        });
    };

    useEffect(() => {
        fetchWorks();
    }, []);

    return (
        <div className="space-y-10 pb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                        Academic <span className="gradient-text">Works</span>
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2 font-medium">
                        <Database size={14} className="text-primary" />
                        {loading ? "Syncing..." : "Live active works database."}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchWorks} disabled={loading} className="gap-2 font-bold h-11 px-6">
                        <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => { resetForm(); setIsEditing(null); setIsModalOpen(true); }}
                        className="bg-primary hover:bg-primary/90 font-black px-8 h-11 gap-2 uppercase italic tracking-tighter shadow-lg shadow-primary/20"
                    >
                        <Plus size={18} /> New Work Entry
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="relative flex-1 w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Search by title, department or type..."
                        className="w-full bg-background/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Badge variant="secondary" className="px-4 py-2 rounded-xl bg-background/50 border-white/5 font-bold">Active: {works.length} Items</Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {works.map((work) => (
                    <Card key={work.id} className="group hover:border-primary/30 transition-all duration-300 border-white/5 bg-card/30 overflow-hidden relative">
                        <div className={cn(
                            "absolute top-0 left-0 w-1 h-full",
                            work.priority === 'High' ? 'bg-rose-500' : work.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                        )} />
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                                <Badge variant="outline" className="text-[9px] uppercase font-black tracking-widest bg-primary/5 text-primary border-primary/20">
                                    {work.type}
                                </Badge>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => openEditModal(work)} className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                                        <Edit3 size={14} />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(work.id)} className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>
                            <CardTitle className="text-xl font-bold mt-2 group-hover:text-primary transition-colors leading-tight">
                                {work.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <Layers size={14} className="text-primary" />
                                    <span className="font-bold">{work.dept}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <Calendar size={14} className="text-primary" />
                                    <span className="font-bold">Due: {work.deadline}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase text-muted-foreground italic">Submissions Progress</span>
                                    <span className="text-xs font-black">{Math.round(((work.submissions || 0) / (work.total_expected || 60)) * 100)}%</span>
                                </div>
                                <div className="h-2 bg-muted/50 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-1000"
                                        style={{ width: `${((work.submissions || 0) / (work.total_expected || 60)) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users size={14} className="text-muted-foreground" />
                                    <span className="text-xs font-bold">{work.submissions || 0} Student Records Attached</span>
                                </div>
                                <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase italic tracking-tighter text-primary group-hover:px-4 transition-all">
                                    Audit Workspace <ArrowRight size={14} className="ml-1" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* New Work Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-md animate-in fade-in transition-all">
                    <Card className="w-full max-w-lg border-white/10 bg-card/90 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
                        <div className="p-1 bg-gradient-to-r from-primary to-purple-500" />
                        <CardHeader className="flex flex-row items-center justify-between pb-6 pt-8 border-b border-white/5">
                            <div>
                                <CardTitle className="text-2xl font-black uppercase italic tracking-tighter">
                                    {isEditing ? "Modify" : "Enlist"} <span className="gradient-text">Academic Work</span>
                                </CardTitle>
                                <CardDescription className="font-medium italic">Standard Operating Procedure for Evaluation.</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Task / Title</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="e.g. Microcontroller Lab Experiment 4"
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Work Type</label>
                                            <select
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20"
                                            >
                                                <option>Assignment</option>
                                                <option>Project</option>
                                                <option>Lab Work</option>
                                                <option>Research</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Priority</label>
                                            <select
                                                value={formData.priority}
                                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-priority/20"
                                            >
                                                <option>High</option>
                                                <option>Medium</option>
                                                <option>Low</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Department</label>
                                            <select
                                                value={formData.dept}
                                                onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                                                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm font-bold appearance-none cursor-pointer"
                                            >
                                                <option>Computer Science</option>
                                                <option>Information Science</option>
                                                <option>Electronics</option>
                                                <option>Mechanical</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Submission Deadline</label>
                                            <input
                                                type="date"
                                                value={formData.deadline}
                                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-black uppercase italic tracking-tighter" disabled={loading}>
                                    {loading ? "Processing..." : "Sync Objective to Servers"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
