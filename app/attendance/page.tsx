// app/attendance/page.tsx
import { CalendarCheck, AlertCircle, CheckCircle2, Download, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Attendance() {
  const subjects = [
    { name: "Mathematics - IV", present: 18, total: 20, code: "22MAT41" },
    { name: "Database Management Systems", present: 15, total: 20, code: "22CS42" },
    { name: "Operating Systems", present: 17, total: 20, code: "22CS43" },
    { name: "Design and Analysis of Algorithms", present: 14, total: 20, code: "22CS44" },
    { name: "Microcontrollers", present: 20, total: 20, code: "22CS45" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Tracking</h1>
          <p className="text-muted-foreground">Monitor your presence across all enrolled courses.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter size={16} /> Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={16} /> Export PDF
          </Button>
          <Badge variant="success" className="h-9 px-4 text-sm font-bold">
            <CheckCircle2 size={16} className="mr-2" /> Total: 85%
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {subjects.map((sub, index) => {
          const percentage = Math.round((sub.present / sub.total) * 100);
          const isLow = percentage < 75;

          return (
            <Card key={index} className="group hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "p-4 rounded-2xl transition-all duration-300 group-hover:scale-110",
                      isLow ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                    )}>
                      <CalendarCheck size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {sub.code}
                        </span>
                        {isLow && (
                          <Badge variant="destructive" className="h-5 px-1.5 text-[8px]">
                            Critical
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-bold">{sub.name}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-12 self-end md:self-center">
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] font-bold mb-1">Classes</p>
                      <p className="text-lg font-bold">{sub.present} <span className="text-muted-foreground font-normal text-sm">/ {sub.total}</span></p>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] font-bold mb-1">Percentage</p>
                      <p className={cn(
                        "text-3xl font-black",
                        isLow ? "text-destructive" : "text-foreground"
                      )}>
                        {percentage}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className={cn(
                      "flex items-center gap-1.5",
                      isLow ? "text-destructive" : "text-primary"
                    )}>
                      {isLow ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                      {isLow ? "Attendance Shortage" : "On Track"}
                    </span>
                    <span className="text-muted-foreground/60">Minimum Requirement: 75%</span>
                  </div>
                  <div className="h-4 bg-muted/50 rounded-full overflow-hidden p-[3px] border border-border/20 backdrop-blur-sm">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000 ease-out",
                        isLow ? "bg-destructive" : "bg-gradient-to-r from-primary via-purple-500 to-primary background-animate"
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {isLow && (
                  <div className="mt-6 flex items-center gap-3 text-sm text-destructive font-medium bg-destructive/5 p-4 rounded-xl border border-destructive/10 animate-in fade-in slide-in-from-top-2 duration-500">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>Action Required: You need to attend the next <span className="font-bold underline">3 classes</span> to restore eligibility.</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}