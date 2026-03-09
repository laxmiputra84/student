// app/admin/settings/page.tsx
import { Settings as SettingsIcon, Shield, Bell, Database, Globe, Lock, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminSettings() {
    const sections = [
        { title: "General", desc: "Global system parameters and branding.", icon: <Globe size={20} />, status: "Active" },
        { title: "Security", desc: "Authentication and access control policies.", icon: <Shield size={20} />, status: "Secured" },
        { title: "Notifications", desc: "Email and push alert configurations.", icon: <Bell size={20} />, status: "Active" },
        { title: "Database", desc: "Daily backups and data synchronization.", icon: <Database size={20} />, status: "Healthy" },
    ];

    return (
        <div className="space-y-10 pb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                        Portal <span className="gradient-text">Settings</span>
                    </h1>
                    <p className="text-muted-foreground font-medium">Control panel for system-wide configurations.</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90 font-bold px-8 shadow-lg shadow-primary/20 gap-2">
                    <Save size={18} /> Save All Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {sections.map((section, i) => (
                    <Card key={i} className="group hover:border-primary/30 transition-all duration-300 border-white/5 bg-card/40 backdrop-blur-md">
                        <CardHeader className="flex flex-row items-center justify-between pt-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                    {section.icon}
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold">{section.title}</CardTitle>
                                    <CardDescription className="max-w-[250px]">{section.desc}</CardDescription>
                                </div>
                            </div>
                            <Badge variant="outline" className="opacity-60">{section.status}</Badge>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div className="mt-6 space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-white/5">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold">Enabled Feature</p>
                                        <p className="text-[10px] text-muted-foreground">Turn on/off specific module functionality</p>
                                    </div>
                                    <div className="w-10 h-5 bg-primary rounded-full relative shadow-inner">
                                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" className="w-full mt-6 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/10">
                                Configure {section.title}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-white/5 bg-destructive/5 border-dashed">
                <CardContent className="p-8 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                            <Lock size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">System Lockdown</h3>
                            <p className="text-sm text-muted-foreground">Instantly revoke all access tokens and lock the portal interface.</p>
                        </div>
                    </div>
                    <Button variant="destructive" className="px-8 font-black uppercase italic tracking-tighter">
                        Initiate Lockdown
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
