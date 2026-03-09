// app/courses/page.tsx
import { BookOpen, Search, Filter, Star, Clock, User, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Courses() {
    const courses = [
        {
            title: "Advanced Machine Learning",
            code: "CS601",
            instructor: "Dr. Sarah Chen",
            rating: 4.9,
            duration: "12 Weeks",
            students: 120,
            image: "bg-blue-500/10",
            status: "Enrolled"
        },
        {
            title: "Cloud Computing Architecture",
            code: "CS602",
            instructor: "Prof. Michael Ross",
            rating: 4.7,
            duration: "10 Weeks",
            students: 85,
            image: "bg-purple-500/10",
            status: "Available"
        },
        {
            title: "Cyber Security & Ethical Hacking",
            code: "CS603",
            instructor: "Dr. James Wilson",
            rating: 4.8,
            duration: "14 Weeks",
            students: 200,
            image: "bg-emerald-500/10",
            status: "Available"
        },
        {
            title: "UI/UX Design Systems",
            code: "DS201",
            instructor: "Elena Gilbert",
            rating: 5.0,
            duration: "8 Weeks",
            students: 45,
            image: "bg-amber-500/10",
            status: "Enrolled"
        },
    ];

    return (
        <div className="space-y-10 pb-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight tracking-tighter uppercase italic">
                        Course <span className="gradient-text">Catalog</span>
                    </h1>
                    <p className="text-muted-foreground font-medium">Explore and register for the latest academic modules.</p>
                </div>

                <div className="flex flex-1 md:max-w-md gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter size={18} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {courses.map((course, i) => (
                    <Card key={i} className="group overflow-hidden border-white/5 bg-card/50 hover:bg-card transition-all duration-500 active:scale-[0.98]">
                        <CardContent className="p-0 flex flex-col sm:flex-row">
                            <div className={cn("w-full sm:w-48 h-48 sm:h-auto shrink-0 flex items-center justify-center relative overflow-hidden", course.image)}>
                                <BookOpen size={64} className="text-foreground/10 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700" />
                                <div className="absolute top-4 left-4">
                                    <Badge variant={course.status === "Enrolled" ? "success" : "outline"} className="bg-background/80 backdrop-blur-md">
                                        {course.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex-1 p-6 space-y-4 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">{course.code}</span>
                                        <div className="flex items-center gap-1 text-amber-400">
                                            <Star size={12} fill="currentColor" />
                                            <span className="text-xs font-bold">{course.rating}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">{course.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                                        <User size={12} /> {course.instructor}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] text-muted-foreground uppercase font-bold">Duration</span>
                                            <span className="text-xs font-semibold flex items-center gap-1"><Clock size={10} /> {course.duration}</span>
                                        </div>
                                        <div className="flex flex-col text-right sm:text-left">
                                            <span className="text-[8px] text-muted-foreground uppercase font-bold">Students</span>
                                            <span className="text-xs font-semibold">{course.students} Joined</span>
                                        </div>
                                    </div>
                                    <Button variant={course.status === "Enrolled" ? "ghost" : "default"} size="sm" className="rounded-full px-4 h-8 text-[10px] font-bold uppercase tracking-wider">
                                        {course.status === "Enrolled" ? "Details" : "Join Now"}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-white/5 bg-primary/5 p-8 border-dashed flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 animate-bounce">
                        <Star size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Wanna suggest a new course?</h3>
                        <p className="text-sm text-muted-foreground">We are always looking for new modules to add to our catalog.</p>
                    </div>
                </div>
                <Button className="rounded-full px-8 bg-foreground text-background hover:bg-foreground/90 transition-all group">
                    Contact Academic Dean <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </Card>
        </div>
    );
}
