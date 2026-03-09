"use client";

import { useState, useEffect } from "react";
import {
    Users,
    Search,
    MapPin,
    Mail,
    Briefcase,
    GraduationCap,
    BadgeCheck,
    Building,
    Trash2,
    Edit3,
    X,
    UserPlus,
    RefreshCcw,
    Database,
    ImagePlus,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { supabase, logActivity, uploadFile } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Staff {
    id: string;
    name: string;
    role: string;
    dept: string;
    email: string;
    type: "Faculty" | "Staff" | "Technical" | "Administration";
    campus: string;
    avatar_url?: string;
    status: string;
}

export default function StaffDirectory() {
    const { role } = useAuth();
    const isAdmin = role === "admin" || role === "dual";

    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState<Staff | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        role: "",
        dept: "",
        email: "",
        type: "Faculty",
        campus: "Main Campus",
        avatar_url: "",
        status: "On Duty"
    });

    async function fetchStaff() {
        setLoading(true);
        setError(null);
        try {
            const { data, error: sbError } = await supabase
                .from('staff')
                .select('*')
                .order('name');

            if (sbError) throw sbError;
            setStaff(data || []);
        } catch (err: any) {
            console.error("Error fetching staff:", err.message);
            // Fallback for demo
            setStaff([
                { id: "1", name: "Dr. Arvind Kumar", role: "Dean of Academics", dept: "Administration", email: "arvind.k@aura.edu", type: "Faculty", campus: "Main Campus", status: "On Duty" },
                { id: "2", name: "Prof. Megha Rao", role: "HOD - CSE", dept: "Computer Science", email: "megha.r@aura.edu", type: "Faculty", campus: "Main Campus", status: "In Meeting" },
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
                    .from('staff')
                    .update(formData)
                    .eq('id', isEditing.id);
                if (sbError) throw sbError;
            } else {
                const { error: sbError } = await supabase
                    .from('staff')
                    .insert([formData]);
                if (sbError) throw sbError;
                logActivity(`${isEditing ? 'Updated' : 'Added'} staff member: ${formData.name}`, 'success');
            }
            setIsModalOpen(false);
            setIsEditing(null);
            resetForm();
            fetchStaff();
        } catch (err: any) {
            console.error("Error saving staff:", err.message);
            // Manual state update for visual fallback
            if (isEditing) {
                setStaff(staff.map(s => s.id === isEditing.id ? { ...s, ...formData } as Staff : s));
            } else {
                setStaff([...staff, { ...formData, id: String(Date.now()) } as Staff]);
            }
            setIsModalOpen(false);
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
            console.error("Upload error:", err.message);
            alert("Image upload failed. Check Supabase 'avatars' bucket policies.");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleDelete = async (id: any) => {
        if (!confirm("Are you sure you want to remove this staff member?")) return;
        try {
            const { error: sbError } = await supabase
                .from('staff')
                .delete()
                .eq('id', id);
            if (sbError) throw sbError;
            logActivity(`Removed staff member (ID: ${id})`, 'warning');
            fetchStaff();
        } catch (err) {
            setStaff(staff.filter(s => s.id !== id));
        }
    };

    const openEditModal = (person: any) => {
        setIsEditing(person);
        setFormData({
            name: person.name,
            role: person.role,
            dept: person.dept,
            email: person.email,
            type: person.type,
            campus: person.campus,
            avatar_url: person.avatar_url || "",
            status: person.status
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            role: "",
            dept: "",
            email: "",
            type: "Faculty",
            campus: "Main Campus",
            avatar_url: "",
            status: "On Duty"
        });
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    return (
        <div className="space-y-10 pb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                        Staff <span className="gradient-text">Directory</span>
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2 font-medium">
                        <Database size={14} className="text-primary" />
                        {loading ? "Syncing..." : "Live database synchronization active."}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchStaff} disabled={loading} className="gap-2 font-bold h-11 px-6">
                        <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </Button>
                    {isAdmin && (
                        <Button
                            onClick={() => { resetForm(); setIsEditing(null); setIsModalOpen(true); }}
                            className="bg-primary hover:bg-primary/90 font-black px-8 h-11 gap-2 uppercase italic tracking-tighter shadow-lg shadow-primary/20"
                        >
                            <UserPlus size={18} /> Add Personnel
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="relative flex-1 w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, role or department..."
                        className="w-full bg-background/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Badge variant="secondary" className="px-4 py-2 rounded-xl bg-background/50 border-white/5 font-bold">Total: {staff.length} Members</Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staff.map((person, i) => (
                    <Card key={i} className="group hover:border-primary/30 transition-all duration-300 border-white/5 bg-card/30 overflow-hidden relative">
                        <CardHeader className="relative pb-0">
                            {isAdmin && (
                                <div className="absolute top-4 right-4 flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => openEditModal(person)}
                                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all rounded-lg"
                                    >
                                        <Edit3 size={14} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(person.id)}
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-lg"
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            )}
                            <div className="flex items-center gap-4">
                                {person.avatar_url ? (
                                    <img
                                        src={person.avatar_url}
                                        alt={person.name}
                                        className="w-16 h-16 rounded-2xl object-cover border border-white/10 group-hover:scale-105 transition-transform"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                        {person.type === 'Faculty' ? <GraduationCap size={32} /> : <Briefcase size={32} />}
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center gap-1">
                                        <CardTitle className="text-lg font-bold">{person.name}</CardTitle>
                                        <BadgeCheck size={14} className="text-primary" />
                                    </div>
                                    <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">{person.role}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-1 gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-3">
                                    <Building size={14} className="text-primary" />
                                    <span>{person.dept}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin size={14} className="text-primary" />
                                    <span>{person.campus}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail size={14} className="text-primary" />
                                    <span className="truncate">{person.email}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                <Badge variant={
                                    person.status === 'On Duty' || person.status === 'Online' ? 'success' :
                                        person.status === 'In Meeting' ? 'secondary' : 'outline'
                                } className="text-[9px] uppercase font-black">
                                    {person.status}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Staff Management Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-md animate-in fade-in transition-all">
                    <Card className="w-full max-w-lg border-white/10 bg-card/90 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-purple-500 to-primary background-animate" />
                        <CardHeader className="flex flex-row items-center justify-between pb-6 pt-8 border-b border-white/5">
                            <div>
                                <CardTitle className="text-2xl font-black uppercase italic tracking-tighter">
                                    {isEditing ? "Modify" : "Enlist"} <span className="gradient-text">Personnel</span>
                                </CardTitle>
                                <CardDescription className="font-medium">Official University Records Update</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="rounded-xl hover:bg-white/10">
                                <X size={20} />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Dr. John Doe"
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans font-bold shadow-inner"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Official Role</label>
                                        <input
                                            type="text"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            placeholder="e.g. HOD / Dean"
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans font-bold"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans font-bold appearance-none cursor-pointer"
                                        >
                                            <option value="Faculty">Faculty</option>
                                            <option value="Staff">Staff</option>
                                            <option value="Technical">Technical</option>
                                            <option value="Administration">Administration</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">University Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="name@aura.edu"
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans font-bold"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Department</label>
                                        <input
                                            type="text"
                                            value={formData.dept}
                                            onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                                            placeholder="e.g. Computer Science"
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans font-bold"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Location</label>
                                        <input
                                            type="text"
                                            value={formData.campus}
                                            onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                                            placeholder="e.g. Main Block"
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans font-bold"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Staff Identity Photo</label>
                                        <div className="flex gap-4 items-center p-4 bg-background/50 border border-white/5 rounded-2xl border-dashed hover:border-primary/50 transition-all group overflow-hidden relative">
                                            {uploadingImage && (
                                                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex items-center justify-center">
                                                    <Loader2 className="text-primary animate-spin" size={24} />
                                                </div>
                                            )}

                                            <div className="relative shrink-0">
                                                <div className="w-16 h-16 rounded-2xl bg-muted overflow-hidden border border-white/10 group-hover:border-primary/30 transition-all flex items-center justify-center">
                                                    {formData.avatar_url ? (
                                                        <img src={formData.avatar_url} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImagePlus size={24} className="text-muted-foreground" />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-2">
                                                <p className="text-xs font-bold">Select high-quality staff member photo</p>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="file"
                                                        id="staff-photo"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        className="hidden"
                                                    />
                                                    <label
                                                        htmlFor="staff-photo"
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

                                <div className="pt-6 flex gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 h-12 rounded-xl font-bold border-white/5 hover:bg-white/5 transition-all"
                                    >
                                        Discard
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-[2] h-12 rounded-xl bg-primary hover:bg-primary/90 font-black uppercase italic tracking-tighter shadow-lg shadow-primary/20"
                                        disabled={loading}
                                    >
                                        {loading ? "Processing..." : (isEditing ? "Sync Profile" : "Create Profile")}
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
