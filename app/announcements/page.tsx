// app/announcements/page.tsx
import { Megaphone, Bell, Calendar, PartyPopper, BookOpen, Clock, ArrowRight, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Announcements() {
  const announcements = [
    {
      title: "Mid-Semester Examination Schedule Released",
      description: "The Mid-Semester exams for even semester are scheduled from 20th March to 30th March. Detailed timetable is available on the portal.",
      category: "Exam",
      date: "Mar 15, 2024",
      icon: <Calendar className="text-blue-400" />,
      priority: "high",
      color: "bg-blue-500/10"
    },
    {
      title: "Tech-Festo 2024 Registration Open",
      description: "Join us for the annual tech fest filled with coding challenges, workshops, and robotics competitions. Register by March 22nd.",
      category: "Event",
      date: "Mar 14, 2024",
      icon: <PartyPopper className="text-amber-400" />,
      priority: "normal",
      color: "bg-amber-500/10"
    },
    {
      title: "Library Timings Extended",
      description: "To support students during exam preparation, the central library will remain open until midnight starting March 18th.",
      category: "Campus",
      date: "Mar 12, 2024",
      icon: <BookOpen className="text-emerald-400" />,
      priority: "normal",
      color: "bg-emerald-500/10"
    },
    {
      title: "Software Engineering Assignment Deadline",
      description: "Final submission for the group project 'Cloud-Native Architecture' is due on March 18th, 11:59 PM.",
      category: "Academic",
      date: "Mar 10, 2024",
      icon: <Clock className="text-purple-400" />,
      priority: "high",
      color: "bg-purple-500/10"
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">Stay updated with the latest news and academic notices.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
          </Button>
          <Button variant="outline">Archive</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {announcements.map((item, index) => (
          <Card key={index} className="overflow-hidden group hover:border-primary/30 transition-all duration-300">
            <div className={`h-1.5 w-full ${item.priority === 'high' ? 'bg-primary' : 'bg-muted/50'}`} />
            <CardContent className="p-0">
              <div className="p-6 flex flex-col md:flex-row gap-6">
                <div className={`w-14 h-14 rounded-2xl ${item.color} border border-white/5 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                  {item.icon}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant={item.priority === 'high' ? 'default' : 'secondary'} className="text-[10px]">
                      {item.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                      <Clock size={12} /> {item.date}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    {item.description}
                  </p>

                  <div className="pt-4 flex items-center justify-between">
                    <div className="flex gap-4">
                      <button className="text-sm font-bold text-primary hover:underline underline-offset-4 flex items-center gap-1">
                        Read Full Notice <ArrowRight size={14} />
                      </button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      <Share2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <Button variant="outline" className="rounded-full px-8">
          Load More Announcements
        </Button>
      </div>
    </div>
  );
}