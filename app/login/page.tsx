"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, GraduationCap, ArrowRight, Lock, User, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<"student" | "admin" | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRole) return;

        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockUser = selectedRole === "admin"
            ? { name: "System Admin", id: "ADM-001" }
            : { name: "Laxmiputra", id: "1RV22CS001" };

        login(selectedRole, mockUser);
        router.push(selectedRole === "admin" ? "/admin/dashboard" : "/dashboard");
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
            <div className="max-w-md w-full space-y-8 animate-fade-in-up">
                <div className="text-center space-y-2">
                    <div className="inline-flex p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-4 animate-bounce">
                        <Sparkles className="text-primary" size={32} />
                    </div>
                    <h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">Aura Portal</h1>
                    <p className="text-muted-foreground font-medium">Select your role and sign in to continue.</p>
                </div>

                <Card className="border-white/5 bg-card/50 backdrop-blur-2xl shadow-2xl overflow-hidden">
                    <CardContent className="p-8">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setSelectedRole("student")}
                                    className={cn(
                                        "p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 text-center transition-all duration-300",
                                        selectedRole === "student"
                                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                            : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05] grayscale hover:grayscale-0"
                                    )}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center",
                                        selectedRole === "student" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                    )}>
                                        <GraduationCap size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Student</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-black">Portal Access</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setSelectedRole("admin")}
                                    className={cn(
                                        "p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 text-center transition-all duration-300",
                                        selectedRole === "admin"
                                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                            : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05] grayscale hover:grayscale-0"
                                    )}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center",
                                        selectedRole === "admin" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                    )}>
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Admin</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-black">System Console</p>
                                    </div>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Username or ID"
                                        className="w-full bg-background border border-border group-hover:border-primary/30 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                                        required
                                    />
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="password"
                                        placeholder="Your Password"
                                        className="w-full bg-background border border-border group-hover:border-primary/30 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={!selectedRole || loading}
                                className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase italic tracking-tighter text-lg shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Initializing...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        Start Session <ArrowRight size={20} />
                                    </div>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <div className="px-8 pb-8 text-center space-y-4">
                        <p className="text-sm text-muted-foreground font-medium">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-secondary font-black hover:text-primary transition-colors">
                                Register Now
                            </Link>
                        </p>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-50">
                            Secured by Aura Quantum Shield
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
