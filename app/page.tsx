"use client";

import { ArrowRight, Sparkles, GraduationCap, ShieldCheck, Zap, BookOpen, Clock, LogIn } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { role, user } = useAuth();
  const isGuest = role === "guest";

  const stats = [
    { label: "Attendance", value: "85%", icon: <ShieldCheck className="text-emerald-400" />, sub: "Above average" },
    { label: "Active Courses", value: "6", icon: <GraduationCap className="text-blue-400" />, sub: "This semester" },
    { label: "Pending Tasks", value: "3", icon: <Zap className="text-amber-400" />, sub: "Due this week" },
  ];

  return (
    <div className="space-y-12 pb-16">
      <header className="space-y-6 relative rounded-[2.5rem] bg-card/40 p-12 border border-white/5 backdrop-blur-sm shadow-2xl overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -z-10" />

        <div className="space-y-2 relative z-10">
          <Badge variant="secondary" className="px-3 py-1 text-[10px] animate-pulse border-primary/20 bg-primary/5 text-primary font-bold">
            {isGuest ? "SYSTEM DISCOVERY MODE" : "PORTAL OPERATIONAL • LIVE SYNC"}
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase italic">
            {isGuest ? (
              <>
                Unlock your <br />
                <span className="gradient-text">Potential.</span>
              </>
            ) : (
              <>
                Welcome back, <br />
                <span className="gradient-text">{user?.name}.</span>
              </>
            )}
          </h1>
        </div>

        <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed relative z-10 font-medium">
          {isGuest
            ? "Experience the future of student management. A high-performance academic OS designed for elite institutions and ambitious students."
            : `You have 3 notifications requiring attention. Your current CGPA stands at 9.2 with a healthy attendance record.`}
        </p>

        <div className="flex flex-wrap gap-4 pt-4 relative z-10">
          {isGuest ? (
            <Link href="/login">
              <Button size="lg" className="rounded-2xl h-14 gap-3 px-10 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 font-black uppercase italic tracking-tighter">
                <LogIn size={20} /> Initialize Session <ArrowRight size={18} />
              </Button>
            </Link>
          ) : (
            <Link href={role === "admin" ? "/admin/dashboard" : "/dashboard"}>
              <Button size="lg" className="rounded-2xl h-14 gap-2 px-10 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 font-black uppercase italic tracking-tighter">
                Go to Dashboard <ArrowRight size={18} />
              </Button>
            </Link>
          )}
          <Button variant="outline" size="lg" className="rounded-2xl h-14 px-8 backdrop-blur-md border-white/10 hover:bg-white/5 font-bold transition-all">
            System Guide
          </Button>
        </div>
      </header>

      {!isGuest && (
        <>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <Card key={i} className="group hover:border-primary/50 transition-all duration-500 border-white/5 bg-card/30">
                <CardContent className="p-6 flex items-center gap-5">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                    {stat.icon}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                      {stat.label}
                    </p>
                    <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
                    <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-bold">
                      {stat.sub}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-white/5 overflow-hidden bg-card/20">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
                <div>
                  <CardTitle className="text-lg font-bold">Recent Updates</CardTitle>
                  <p className="text-xs text-muted-foreground">Latest campus notifications</p>
                </div>
                <Link href="/announcements">
                  <Button variant="ghost" size="sm" className="text-primary text-xs font-bold hover:bg-primary/10">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {[
                  { title: "Mid-Term exams rescheduled to March 22nd", time: "2 hours ago", cat: "Exam" },
                  { title: "Campus-wide Wi-Fi maintenance tonight at 10 PM", time: "5 hours ago", cat: "Notice" },
                  { title: "TechFest registration deadline extended", time: "1 day ago", cat: "Event" },
                ].map((item, i) => (
                  <div key={i} className="p-5 border-b border-border/50 last:border-0 hover:bg-white/[0.04] transition-colors flex items-center gap-4 group cursor-pointer">
                    <div className="w-1.5 h-10 rounded-full bg-primary/20 shrink-0 group-hover:bg-primary transition-colors" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{item.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium italic">
                          <Clock size={10} /> {item.time}
                        </span>
                        <Badge variant="outline" className="text-[8px] h-4 px-1 inline-flex uppercase border-primary/20 text-primary">
                          {item.cat}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-white/5 overflow-hidden bg-card/20">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
                <div>
                  <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
                  <p className="text-xs text-muted-foreground">Shortcuts to portal tools</p>
                </div>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-2 gap-4">
                {[
                  { name: "Apply for Leave", icon: <BookOpen size={20} /> },
                  { name: "Pay Sem Fees", icon: <Zap size={20} /> },
                  { name: "Course Reg.", icon: <GraduationCap size={20} /> },
                  { name: "Library Card", icon: <ShieldCheck size={20} /> },
                ].map((btn, i) => (
                  <Button key={i} variant="outline" className="h-24 flex-col gap-3 group hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 rounded-2xl">
                    <div className="p-2 rounded-lg bg-background border border-border group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      {btn.icon}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-tighter italic">{btn.name}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {isGuest && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-white/5 bg-gradient-to-br from-primary/5 to-transparent p-10 rounded-[2rem]">
            <h3 className="text-2xl font-black uppercase italic mb-4">Student Access</h3>
            <p className="text-muted-foreground mb-8 font-medium">Manage your attendance, view grades, and stay updated with campus events in a personalized environment.</p>
            <Link href="/login">
              <Button className="w-full h-12 rounded-xl font-bold">Open Student Portal</Button>
            </Link>
          </Card>
          <Card className="border-white/5 bg-gradient-to-br from-purple-500/5 to-transparent p-10 rounded-[2rem]">
            <h3 className="text-2xl font-black uppercase italic mb-4">Admin Suite</h3>
            <p className="text-muted-foreground mb-8 font-medium">Complete control over institutional data, student records, and system-wide analytics with high-security clearance.</p>
            <Link href="/login">
              <Button variant="outline" className="w-full h-12 rounded-xl font-bold">Access Admin Console</Button>
            </Link>
          </Card>
        </section>
      )}
    </div>
  );
}