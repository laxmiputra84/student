// app/admin/attendance/page.tsx
import { Building2, TrendingUp, Search, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminAttendance() {
    const departments = [
        { name: "Computer Science", head: "Dr. Arvind K.", avg: 85, students: 450, status: "Healthy" },
        { name: "Information Science", head: "Prof. Megha R.", avg: 72, students: 320, status: "Warning" },
        { name: "Electronics", head: "Dr. Suresh P.", avg: 68, students: 280, status: "Critical" },
        { name: "Mechanical", head: "Prof. Rajesh V.", avg: 60, students: 230, status: "Critical" },
        { name: "Civil Engineering", head: "Dr. Kavita S.", avg: 78, students: 190, status: "Healthy" },
    ];

    return (
        <div className="space-y-10 pb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                        Department <span className="gradient-text">Stats</span>
                    </h1>
                    <p className="text-muted-foreground font-medium">Cross-departmental attendance analytics.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="font-bold">Fetch Latest Data</Button>
                    <Button className="bg-primary hover:bg-primary/90 font-bold px-6">Notify HODs</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {departments.map((dept, i) => (
                    <Card key={i} className="group hover:border-primary/30 transition-all duration-300 border-white/5">
                        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center border border-border group-hover:bg-primary/10 transition-colors">
                                    <Building2 size={32} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{dept.name}</h3>
                                    <p className="text-sm text-muted-foreground">Head: {dept.head}</p>
                                </div>
                            </div>

                            <div className="flex-1 max-w-md w-full">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Average Attendance</span>
                                    <span className={`text-xl font-black ${dept.avg < 75 ? 'text-destructive' : 'text-emerald-500'}`}>
                                        {dept.avg}%
                                    </span>
                                </div>
                                <div className="h-3 bg-muted rounded-full overflow-hidden p-0.5 border border-white/5">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${dept.avg < 75 ? 'bg-destructive' : 'bg-emerald-500'}`}
                                        style={{ width: `${dept.avg}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-8 items-center">
                                <div className="text-right">
                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none mb-1">Students</p>
                                    <p className="text-lg font-bold">{dept.students}</p>
                                </div>
                                <Badge variant={dept.status === 'Healthy' ? 'success' : dept.status === 'Warning' ? 'secondary' : 'destructive'} className="min-w-[80px] justify-center">
                                    {dept.status}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
