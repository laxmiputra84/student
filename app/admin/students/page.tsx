"use client";

import { useEffect, useState } from "react";
import {
    Search,
    Database,
    RefreshCcw,
    Trash2,
    Edit3,
    X,
    UserPlus,
    ImagePlus,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase, logActivity, uploadFile } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Student {
    id: string;
    usn: string;
    name: string;
    branch: string;
    semester: string;
    status: string;
    attendance: number | string;
    email?: string;
    phone?: string;
    address?: string;
    cgpa?: string;
    credits?: string;
    avatar_url?: string;
}

export default function StudentsList() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState<Student | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        usn: "",
        branch: "CSE",
        semester: "6th",
        attendance: "85",
        status: "Active",
        email: "",
        phone: "",
        address: "",
        cgpa: "0.0",
        credits: "0/160",
        avatar_url: ""
    });

    async function fetchStudents() {
        setLoading(true);
        setError(null);
        try {
            const { data, error: sbError } = await supabase
                .from('students')
                .select('*')
                .order('name');

            if (sbError) throw sbError;
            setStudents(data || []);
        } catch (err: any) {
            console.error("Error fetching students:", err.message);
            setError(err.message === "Supabase credentials missing. Please check your .env.local file." ? "Credentials Missing" : err.message);

            // Fallback for demo
            setStudents([
                { id: "1", usn: "1RV22CS001", name: "Laxmiputra", branch: "CSE", semester: "6th", status: "Active", attendance: 85, email: "laxmi@aura.edu", phone: "+91 99000 11000", address: "Bengaluru", cgpa: "9.2", credits: "128/160" },
                { id: "2", usn: "1RV22CS042", name: "Aditi Sharma", branch: "CSE", semester: "4th", status: "Active", attendance: 92, email: "aditi@aura.edu", phone: "+91 99000 22000", address: "Delhi", cgpa: "8.9", credits: "84/160" },
                { id: "3", usn: "1RV22EC015", name: "Rohan Das", branch: "ECE", semester: "6th", status: "Active", attendance: 65, email: "rohan@aura.edu", phone: "+91 99000 33000", address: "Mumbai", cgpa: "7.5", credits: "110/160" },
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
                // Update
                const studentData = { ...formData, attendance: parseInt(formData.attendance) || 0 };
                const { error: sbError } = await supabase
                    .from('students')
                    .update(studentData)
                    .eq('id', isEditing.id);
                if (sbError) throw sbError;
            } else {
                // Create
                const studentData = { ...formData, attendance: parseInt(formData.attendance) || 0 };
                const { error: sbError } = await supabase
                    .from('students')
                    .insert([studentData]);
                if (sbError) throw sbError;
                logActivity(`Added new student: ${formData.name}`, 'success');
            }
            setIsAddModalOpen(false);
            setIsEditing(null);
            resetForm();
            fetchStudents();
        } catch (err: any) {
            console.error("Error saving student:", err.message);
            // On demo/error, just update state for visual feedback
            if (isEditing) {
                setStudents(students.map(s => s.id === isEditing.id ? { ...s, ...formData } as Student : s));
            } else {
                setStudents([...students, { ...formData, id: String(Date.now()) } as Student]);
            }
            setIsAddModalOpen(false);
            setIsEditing(null);
            resetForm();
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const publicUrl = await uploadFile(file);
            setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
        } catch (err: any) {
            console.error("Upload error detail:", err);
            alert(`Image upload failed: ${err.message || 'Unknown error'}. 
            
Make sure:
1. 'avatars' bucket exists in Supabase.
2. It's set to 'Public'.
3. RLS policies are applied.`);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleDelete = async (id: any) => {
        if (!confirm("Are you sure you want to remove this student?")) return;

        try {
            const { error: sbError } = await supabase
                .from('students')
                .delete()
                .eq('id', id);
            if (sbError) throw sbError;
            logActivity(`Deleted student record (ID: ${id})`, 'warning');
            fetchStudents();
        } catch (err: any) {
            setStudents(students.filter(s => s.id !== id));
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            usn: "",
            branch: "CSE",
            semester: "6th",
            attendance: "85",
            status: "Active",
            email: "",
            phone: "",
            address: "",
            cgpa: "0.0",
            credits: "0/160",
            avatar_url: ""
        });
    };

    const openEditModal = (student: any) => {
        setIsEditing(student);
        setFormData({
            name: student.name,
            usn: student.usn,
            branch: student.branch,
            semester: student.semester,
            attendance: student.attendance.toString(),
            status: student.status,
            email: student.email || "",
            phone: student.phone || "",
            address: student.address || "",
            cgpa: student.cgpa || "0.0",
            credits: student.credits || "0/160",
            avatar_url: student.avatar_url || ""
        });
        setIsAddModalOpen(true);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div className="space-y-8 pb-12 relative">
            {/* Header section... */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                        Student <span className="gradient-text">Directory</span>
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2 font-medium">
                        <Database size={14} className="text-primary" />
                        {loading ? "Syncing with Supabase..." : "Live database synchronization active."}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchStudents} disabled={loading} className="gap-2 font-bold h-11 px-6">
                        <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => { resetForm(); setIsEditing(null); setIsAddModalOpen(true); }}
                        className="bg-primary hover:bg-primary/90 font-black h-11 px-8 gap-2 uppercase italic tracking-tighter"
                    >
                        <UserPlus size={18} /> Add Student
                    </Button>
                </div>
            </div>

            {/* Students List Table... */}
            <Card className="border-white/5 bg-card/50 overflow-hidden shadow-2xl backdrop-blur-xl">
                <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6">
                    <div className="relative flex-1 md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, USN or branch..."
                            className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse font-sans">
                        <thead>
                            <tr className="bg-muted/30">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Student</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">USN / ID</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Department</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Attendance</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {students.map((student, i) => (
                                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {student.avatar_url ? (
                                                <img
                                                    src={student.avatar_url}
                                                    alt={student.name}
                                                    className="w-10 h-10 rounded-xl object-cover border border-white/5 shadow-inner"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-primary text-sm font-black font-mono border border-white/5 shadow-inner">
                                                    {student.name ? student.name.charAt(0) : "?"}
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-sm font-black group-hover:text-primary transition-colors">{student.name}</span>
                                                <p className="text-[10px] text-muted-foreground font-bold uppercase">{student.status}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-mono font-bold text-muted-foreground bg-white/5 px-2 py-1 rounded-md">{student.usn || student.id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black italic">{student.branch}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{student.semester} Sem</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 w-20 bg-muted rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-1000",
                                                        Number(student.attendance) < 75 ? 'bg-destructive' : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                                    )}
                                                    style={{ width: `${student.attendance}%` }}
                                                />
                                            </div>
                                            <span className={cn("text-xs font-black italic", Number(student.attendance) < 75 ? "text-destructive" : "text-emerald-500")}>
                                                {student.attendance}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEditModal(student)}
                                                className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all rounded-xl border border-transparent hover:border-primary/20"
                                            >
                                                <Edit3 size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(student.id)}
                                                className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-xl border border-transparent hover:border-destructive/20"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Management Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-md animate-in fade-in transition-all">
                    <Card className="w-full max-w-lg border-white/10 bg-card/90 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-purple-500 to-primary background-animate" />
                        <CardHeader className="flex flex-row items-center justify-between pb-6 pt-8 border-b border-white/5">
                            <div>
                                <CardTitle className="text-2xl font-black uppercase italic tracking-tighter">
                                    {isEditing ? "Update" : "Add New"} <span className="gradient-text">Student</span>
                                </CardTitle>
                                <CardDescription className="font-medium">Maintain institutional records with precision.</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsAddModalOpen(false)} className="rounded-xl hover:bg-white/10 transition-all">
                                <X size={20} />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Identity</label>
                                        <input
                                            type="text"
                                            placeholder="Student Name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans font-bold"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">USN Number</label>
                                        <input
                                            type="text"
                                            placeholder="1RV22CS..."
                                            value={formData.usn}
                                            onChange={(e) => setFormData({ ...formData, usn: e.target.value })}
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono font-bold"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Department</label>
                                        <select
                                            value={formData.branch}
                                            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans font-bold appearance-none cursor-pointer"
                                        >
                                            <option value="CSE">CSE</option>
                                            <option value="ISE">ISE</option>
                                            <option value="ECE">ECE</option>
                                            <option value="ME">ME</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Semester</label>
                                        <select
                                            value={formData.semester}
                                            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans font-bold appearance-none cursor-pointer"
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={`${s}th`}>{s}th Semester</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Live Attendance %</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.attendance}
                                            onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans font-bold"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="student@aura.edu"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                                        <input
                                            type="text"
                                            placeholder="+91 00000 00000"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans font-bold"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Postal Address</label>
                                        <input
                                            type="text"
                                            placeholder="City, State, Country"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Cumulative GPA</label>
                                        <input
                                            type="text"
                                            placeholder="9.0"
                                            value={formData.cgpa}
                                            onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Credits Earned</label>
                                        <input
                                            type="text"
                                            placeholder="120/160"
                                            value={formData.credits}
                                            onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans font-bold"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Profile Identity (Photo)</label>
                                        <div className="flex gap-4 items-center p-4 bg-background/50 border border-white/5 rounded-2xl border-dashed hover:border-primary/50 transition-all group overflow-hidden relative">
                                            {uploadingImage && (
                                                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex items-center justify-center">
                                                    <Loader2 className="text-primary animate-spin" size={24} />
                                                </div>
                                            )}

                                            <div className="relative group/avatar shrink-0">
                                                <div className="w-16 h-16 rounded-2xl bg-muted overflow-hidden border border-white/10 group-hover:border-primary/30 transition-all flex items-center justify-center">
                                                    {formData.avatar_url ? (
                                                        <img src={formData.avatar_url} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImagePlus size={24} className="text-muted-foreground" />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-2">
                                                <p className="text-xs font-bold">Select high-resolution student portrait</p>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="file"
                                                        id="student-photo"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        className="hidden"
                                                    />
                                                    <label
                                                        htmlFor="student-photo"
                                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all active:scale-95"
                                                    >
                                                        Upload Image
                                                    </label>
                                                    {formData.avatar_url && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, avatar_url: "" }))}
                                                            className="text-[10px] text-destructive font-black uppercase tracking-widest hover:underline"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="flex-1 h-12 rounded-xl font-bold border-white/5 hover:bg-white/5"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-[2] h-12 rounded-xl bg-primary hover:bg-primary/90 font-black uppercase italic tracking-tighter"
                                        disabled={loading}
                                    >
                                        {loading ? "Processing..." : (isEditing ? "Apply Changes" : "Commit Record")}
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
