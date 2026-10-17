import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { weekLessons } from "@/lib/mock-data";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Расписание — Тьютор CRM" },
      { name: "description", content: "Недельное расписание уроков репетитора." },
      { property: "og:title", content: "Расписание — Тьютор CRM" },
      { property: "og:description", content: "Недельное расписание уроков репетитора." },
    ],
  }),
  component: Schedule,
});

function Schedule() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Расписание" subtitle="12 – 18 октября" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {Object.entries(weekLessons).map(([day, lessons]) => (
          <Card key={day} className={`min-h-40 rounded-xl border-0 p-3 shadow-soft ${day === "Сб" ? "ring-2 ring-primary" : ""}`}>
            <p className="mb-2 text-sm font-semibold">{day}</p>
            <div className="space-y-2">
              {lessons.length === 0 && <p className="text-xs text-muted-foreground">Свободно</p>}
              {lessons.map((l) => (
                <div key={l.id} className="rounded-lg bg-accent p-2 text-xs">
                  <p className="font-semibold text-accent-foreground">{l.time}</p>
                  <p className="truncate">{l.student}</p>
                  <p className="truncate text-muted-foreground">{l.subject}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
