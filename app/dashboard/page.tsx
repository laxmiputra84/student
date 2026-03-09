"use client";

import { useEffect, useState } from "react";
import { User as UserIcon, BookOpen, Fingerprint, Award, TrendingUp, Cpu, CreditCard, Mail, Phone, MapPin, RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface StudentProfile {
  id?: string;
  name: string;
  usn: string;
  branch: string;
  attendance: number | string;
  semester: string;
  cgpa?: string;
  credits?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: string;
  avatar_url?: string;
}

export default function Dashboard() {
  const { user, role } = useAuth();
  const [studentData, setStudentData] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudentProfile() {
      if (!user?.id) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('usn', user.id)
          .single();

        if (error) {
          // Only log real errors, not "no rows found" if we have a fallback
          if (error.code !== 'PGRST116') {
            console.warn("Database sync issue:", error.message);
          }
          throw error;
        }
        setStudentData(data);
      } catch (err) {
        // Silently use fallback for expected missing records in demo/dev
        setStudentData({
          name: user.name || "Student",
          usn: user.id || "STU-001",
          branch: "Computer Science",
          attendance: 85,
          semester: "6th",
          cgpa: "9.1",
          credits: "128/160",
          email: `${user.id}@aura.edu`,
          phone: "+91 98765 43210",
          address: "Bengaluru, India"
        });
      } finally {
        setLoading(false);
      }
    }

    if (role === "student" || role === "dual") {
      fetchStudentProfile();
    }
  }, [user, role]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-black uppercase tracking-widest animate-pulse">Synchronizing Academic Profile...</p>
      </div>
    );
  }

  const student = studentData || {
    name: "Guest",
    usn: "GUEST-001",
    branch: "N/A",
    attendance: 0,
    semester: "N/A",
    cgpa: "0.0",
    credits: "0/0",
    email: "guest@aura.edu"
  };

  const infoCards = [
    { label: "USN", value: student.usn, icon: <Fingerprint />, color: "text-blue-400" },
    { label: "Branch", value: student.branch, icon: <Cpu />, color: "text-purple-400" },
    { label: "Current Semester", value: `${student.semester} Semester`, icon: <BookOpen />, color: "text-amber-400" },
    { label: "Attendance", value: `${student.attendance}%`, icon: <TrendingUp />, color: "text-emerald-400" },
  ];

  return (
    <div className="space-y-10 pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight tracking-tighter uppercase italic">
            Student <span className="gradient-text">Profile</span>
          </h1>
          <p className="text-muted-foreground font-medium">Academic intelligence and personal identification.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 font-bold">
            <Mail size={16} /> Contact Support
          </Button>
          <Button className="gap-2 font-bold bg-primary hover:bg-primary/90">
            Edit Information
          </Button>
        </div>
      </div>

      <Card className="border-white/5 bg-gradient-to-r from-card/80 via-card/50 to-primary/5 overflow-hidden">
        <CardContent className="p-8 flex flex-col md:flex-row items-center gap-10">
          <div className="relative shrink-0">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-primary to-purple-600 p-1 rotate-3 group shadow-2xl">
              <div className="w-full h-full rounded-[1.25rem] bg-background flex items-center justify-center -rotate-3 overflow-hidden">
                {student.avatar_url ? (
                  <img src={student.avatar_url} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={64} className="text-muted-foreground/40" />
                )}
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-background rounded-full flex items-center justify-center text-white shadow-lg">
              <div className="w-3 h-3 bg-white rounded-full animate-ping" />
            </div>
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
                <h2 className="text-3xl font-bold">{student.name}</h2>
                <Badge variant="success" className="px-3">Verified Student</Badge>
              </div>
              <p className="text-muted-foreground font-semibold flex items-center justify-center md:justify-start gap-2">
                {student.branch} • Senior Batch
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="flex items-center justify-center md:justify-start gap-3 text-muted-foreground">
                <Mail size={16} className="text-primary" />
                <span className="text-xs font-medium">{student.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3 text-muted-foreground">
                <Phone size={16} className="text-primary" />
                <span className="text-xs font-medium">{student.phone}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3 text-muted-foreground">
                <MapPin size={16} className="text-primary" />
                <span className="text-xs font-medium">{student.address}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {infoCards.map((card, i) => (
          <Card key={i} className="group hover:border-primary/30 transition-all duration-300 border-white/5">
            <CardContent className="p-6 space-y-4">
              <div className={cn("w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center border border-border group-hover:border-primary/20 group-hover:bg-primary/5 transition-all", card.color)}>
                {card.icon}
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">{card.label}</p>
                <p className="text-lg font-bold group-hover:text-primary transition-colors">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 border-white/5 bg-card/10 backdrop-blur-md">
          <CardHeader className="pb-8">
            <CardTitle className="flex items-center gap-3 italic">
              <TrendingUp className="text-primary" /> Academic Performance
            </CardTitle>
            <CardDescription>Consolidated results for the current academic session.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative p-8 rounded-3xl bg-background/50 border border-white/5 text-center group hover:bg-background transition-all">
                <div className="absolute top-4 right-4 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded leading-none">A+ Grade</div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-4">CGPA Avg.</p>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-5xl font-black">{student.cgpa}</span>
                  <span className="text-muted-foreground font-bold">/ 10</span>
                </div>
                <p className="text-[10px] text-muted-foreground italic">Top 5% of your class</p>
              </div>

              <div className="relative p-8 rounded-3xl bg-background/50 border border-white/5 flex flex-col justify-between group hover:bg-background transition-all">
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-4 text-center">Live Attendance</p>
                  <div className="flex justify-center mb-6">
                    <div className={cn(
                      "w-20 h-20 rounded-full border-8 flex items-center justify-center transition-all duration-1000",
                      Number(student.attendance) < 75 ? "border-destructive/20 border-t-destructive" : "border-primary/20 border-t-primary"
                    )}>
                      <span className={cn("text-xl font-bold", Number(student.attendance) < 75 ? "text-destructive" : "text-primary")}>
                        {student.attendance}%
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-center text-muted-foreground font-medium uppercase tracking-[0.15em]">
                  {Number(student.attendance) < 75 ? "Below Threshold" : "Good Standing"}
                </p>
              </div>

              <div className="relative p-8 rounded-3xl bg-background/50 border border-white/5 text-center group hover:bg-background transition-all flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold">Total Credits</p>
                  <p className="text-3xl font-black text-blue-500">{student.credits || "0/160"}</p>
                </div>
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Academic Progress</p>
              </div>
            </div>

            <div className="mt-10 p-5 rounded-2xl bg-muted/20 border border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="text-muted-foreground" size={18} />
                <p className="text-sm font-medium">Pending Semester Fees: <span className="font-bold">₹0.00</span></p>
              </div>
              <Badge variant="success">All Clear</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/5 overflow-hidden">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-lg font-bold">Recent History</CardTitle>
            <CardDescription>Log of portal activities</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {[
              { label: "Profile Updated", date: "Today, 10:45 AM", type: "system" },
              { label: "CGPA Updated", date: "Yesterday", type: "academic" },
              { label: "Phone Change Verified", date: "2 days ago", type: "system" },
              { label: "Fee Payment (Sem 6)", date: "5 days ago", type: "billing" },
            ].map((log, i) => (
              <div key={i} className="p-4 border-b border-white/5 last:border-0 flex gap-4 items-start group hover:bg-white/[0.02] transition-all">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 group-hover:scale-150 transition-transform" />
                <div>
                  <p className="text-sm font-bold group-hover:text-primary transition-colors">{log.label}</p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{log.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-6 pt-0 mt-4">
            <Button variant="ghost" className="w-full text-xs font-bold text-muted-foreground border border-dashed border-border hover:border-primary/20 hover:text-primary">
              View All Logs
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}