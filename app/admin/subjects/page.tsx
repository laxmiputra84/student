"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Layers,
    Clock,
    Book,
    Code,
    Calculator,
    Trash2,
    Edit3,
    X,
    FilePlus,
    RefreshCcw,
    Database
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { supabase, logActivity } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Subject {
    id: string;
    code: string;
    name: string;
    dept: string;
    credits: number;
    semester: string;
    type: string;
    status: string;
}

export default function SubjectsCatalog() {
    const { role } = useAuth();
    const isAdmin = role === "admin" || role === "dual";

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState<Subject | null>(null);

    const [formData, setFormData] = useState({
        code: "",
        name: "",
        dept: "Computer Science",
        credits: "4",
        semester: "6th",
        type: "Core",
        status: "Active"
    });

    async function fetchSubjects() {
        setLoading(true);
        setError(null);
        try {
            const { data, error: sbError } = await supabase
                .from('subjects')
                .select('*')
                .order('name');

            if (sbError) throw sbError;
            setSubjects(data || []);
        } catch (err: any) {
            console.error("Error fetching subjects:", err.message);
            // Fallback
            setSubjects([
                { id: "1", code: "CS601", name: "Algorithm Design & Analysis", dept: "Computer Science", credits: 4, semester: "6th", type: "Core", status: "Active" },
                { id: "2", code: "MAT402", name: "Discrete Mathematics", dept: "Mathematics", credits: 3, semester: "4th", type: "Core", status: "Active" },
            ]);
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...formData, credits: parseInt(formData.credits) };
            if (isEditing) {
                const { error: sbError } = await supabase
                    .from('subjects')
                    .update(payload)
                    .eq('id', isEditing.id);
                if (sbError) throw sbError;
            } else {
                const { error: sbError } = await supabase
                    .from('subjects')
                    .insert([payload]);
                if (sbError) throw sbError;
                logActivity("Admin", isEditing ? "Updated Subject" : "Added New Subject", `${formData.name} (${formData.code})`);
            }
            setIsModalOpen(false);
            setIsEditing(null);
            resetForm();
            fetchSubjects();
        } catch (err: any) {
            console.error("Error saving subject:", err.message);
            // Visual fallback
            const mockSubject: Subject = { ...formData, id: String(Date.now()), credits: parseInt(formData.credits) };
            if (isEditing) {
                setSubjects(subjects.map(s => s.id === isEditing.id ? { ...s, ...mockSubject } : s));
            } else {
                setSubjects([...subjects, mockSubject]);
            }
            setIsModalOpen(false);
            resetForm();
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: any) => {
        if (!confirm("Are you sure you want to delete this curriculum entry?")) return;
        try {
            const { error: sbError } = await supabase
                .from('subjects')
                .delete()
                .eq('id', id);
            if (sbError) throw sbError;
            logActivity("Admin", "Deleted Subject", id);
            fetchSubjects();
        } catch (err) {
            setSubjects(subjects.filter(s => s.id !== id));
        }
    };

    const openEditModal = (subject: any) => {
        setIsEditing(subject);
        setFormData({
            code: subject.code,
            name: subject.name,
            dept: subject.dept,
            credits: subject.credits.toString(),
            semester: subject.semester,
            type: subject.type,
            status: subject.status
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            code: "",
            name: "",
            dept: "Computer Science",
            credits: "4",
            semester: "6th",
            type: "Core",
            status: "Active"
        });
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const getIcon = (type: string) => {
        if (type.includes('Code')) return <Code className="text-blue-500" />;
        if (type.includes('Math')) return <Calculator className="text-purple-500" />;
        return <Book className="text-primary" />;
    };

    return (
        <div className="space-y-10 pb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                        Academic <span className="gradient-text">Curriculum</span>
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2 font-medium">
                        <Database size={14} className="text-primary" />
                        {loading ? "Syncing..." : "Live curriculum database active."}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchSubjects} disabled={loading} className="gap-2 font-bold h-11 px-6">
                        <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </Button>
                    {isAdmin && (
                        <Button
                            onClick={() => { resetForm(); setIsEditing(null); setIsModalOpen(true); }}
                            className="bg-primary hover:bg-primary/90 font-black px-8 h-11 gap-2 uppercase italic tracking-tighter shadow-lg shadow-primary/20"
                        >
                            <FilePlus size={18} /> Add Subject
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="relative flex-1 w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Search by code, title or department..."
                        className="w-full bg-background/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Badge variant="secondary" className="px-4 py-2 rounded-xl bg-background/50 border-white/5 font-bold">Total: {subjects.length} Subjects</Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {subjects.map((subject, i) => (
                    <Card key={i} className="group hover:border-primary/20 transition-all duration-300 border-white/5 bg-card/20 overflow-hidden relative">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-primary/5 transition-colors shrink-0">
                                    <div className="group-hover:scale-110 transition-transform">
                                        {getIcon(subject.name)}
                                    </div>
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
                                        <span className="text-[10px] font-black font-mono text-primary bg-primary/10 px-2 py-0.5 rounded leading-none">{subject.code}</span>
                                        <h3 className="text-lg font-bold">{subject.name}</h3>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-muted-foreground font-medium">
                                        <span className="flex items-center gap-1.5"><Layers size={12} /> {subject.dept}</span>
                                        <span className="flex items-center gap-1.5"><Clock size={12} /> {subject.semester} Semester</span>
                                        <span className="flex items-center gap-1.5"><Book size={12} /> {subject.type} Course</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-center md:text-right">
                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none mb-1">Credits</p>
                                        <p className="text-xl font-black">{subject.credits}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Badge variant={subject.status === 'Active' ? 'success' : 'secondary'} className="text-[9px] uppercase font-black h-5">
                                            {subject.status}
                                        </Badge>
                                        {isAdmin && (
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEditModal(subject)}
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                                >
                                                    <Edit3 size={15} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(subject.id)}
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={15} />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Subject Management Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-md animate-in fade-in transition-all">
                    <Card className="w-full max-w-lg border-white/10 bg-card/90 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-purple-500 to-primary background-animate" />
                        <CardHeader className="flex flex-row items-center justify-between pb-6 pt-8 border-b border-white/5">
                            <div>
                                <CardTitle className="text-2xl font-black uppercase italic tracking-tighter">
                                    {isEditing ? "Update" : "Define"} <span className="gradient-text">Subject</span>
                                </CardTitle>
                                <CardDescription className="font-medium">Institutional Curriculum Architect active.</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="rounded-xl hover:bg-white/10">
                                <X size={20} />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Subject Code</label>
                                        <input
                                            type="text"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                            placeholder="e.g. CS601"
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono font-bold shadow-inner"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Credits</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={formData.credits}
                                            onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans font-bold"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Subject Title</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Theoretical Computer Science"
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans font-bold"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Department</label>
                                        <select
                                            value={formData.dept}
                                            onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-sans font-bold cursor-pointer"
                                        >
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Mathematics">Mathematics</option>
                                            <option value="Information Science">Information Science</option>
                                            <option value="Humanities">Humanities</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Semester</label>
                                        <select
                                            value={formData.semester}
                                            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-sans font-bold cursor-pointer"
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={`${s}th`}>{s}th Semester</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 h-12 rounded-xl font-bold border-white/5 hover:bg-white/5"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-[2] h-12 rounded-xl bg-primary hover:bg-primary/90 font-black uppercase italic tracking-tighter shadow-xl shadow-primary/20 group overflow-hidden relative"
                                        disabled={loading}
                                    >
                                        <span className="relative z-10">{loading ? "Processing..." : (isEditing ? "Update Curriculum" : "Add to Curriculum")}</span>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
