import { createFileRoute, Link } from "@tanstack/react-router";
import { UserPlus, CalendarPlus, Send, TrendingUp, Wallet, Users, Clock, AlertCircle, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { todayLessons, initialLeads } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Дашборд — Тьютор CRM" },
      { name: "description", content: "Уроки на сегодня, новые лиды, конверсия и доход репетитора." },
      { property: "og:title", content: "Дашборд — Тьютор CRM" },
      { property: "og:description", content: "Уроки на сегодня, новые лиды, конверсия и доход репетитора." },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Новые лиды за неделю", value: "12", delta: "+4 к прошлой", icon: Users, tone: "bg-info-soft text-info" },
  { label: "Конверсия в оплату", value: "38%", delta: "+6 п.п.", icon: TrendingUp, tone: "bg-accent text-primary" },
  { label: "Доход за октябрь", value: "84 500 ₽", delta: "план 120 000 ₽", icon: Wallet, tone: "bg-warning-soft text-warning" },
];

function Dashboard() {
  const unpaid = todayLessons.filter((l) => !l.paid);
  const toContact = initialLeads.filter((l) => l.status === "new" || l.status === "contacted");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="bg-hero relative overflow-hidden rounded-2xl p-6 text-primary-foreground shadow-soft md:p-8">
        <p className="text-sm opacity-80">Доброе утро,</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Екатерина 👋</h1>
        <p className="mt-2 max-w-md opacity-90">
          Сегодня у вас <b>{todayLessons.length} урока</b>, ближайший — в {todayLessons[0].time} с {todayLessons[0].student}.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="secondary" asChild><Link to="/leads"><UserPlus /> Добавить лида</Link></Button>
          <Button variant="secondary" asChild><Link to="/schedule"><CalendarPlus /> Создать урок</Link></Button>
          <Button variant="secondary" onClick={() => toast.success("Рассылка подготовлена для 8 учеников")}><Send /> Написать всем</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="rounded-xl border-0 p-5 shadow-soft">
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${s.tone}`}><s.icon className="h-5 w-5" /></div>
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.delta}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="rounded-xl border-0 p-5 shadow-soft lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Сегодня</h2>
            <Link to="/schedule" className="text-sm text-primary">Всё расписание</Link>
          </div>
          <ul className="space-y-2">
            {todayLessons.map((l) => (
              <li key={l.id} className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-muted">
                <div className="flex w-14 items-center gap-1 text-sm font-semibold"><Clock className="h-3.5 w-3.5 text-muted-foreground" />{l.time}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{l.student}</p>
                  <p className="text-xs text-muted-foreground">{l.subject}</p>
                </div>
                <span className="text-sm font-medium">{l.price.toLocaleString("ru")} ₽</span>
                <Badge variant={l.paid ? "secondary" : "destructive"}>{l.paid ? "Оплачен" : "Не оплачен"}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="rounded-xl border-0 p-5 shadow-soft lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 font-semibold"><AlertCircle className="h-4 w-4 text-warning" /> Требуют внимания</h2>
          <ul className="space-y-2">
            {toContact.map((l) => (
              <li key={l.id} className="flex items-center gap-3 rounded-xl bg-muted/60 p-3">
                <MessageCircle className="h-4 w-4 shrink-0 text-info" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{l.name}</p>
                  <p className="text-xs text-muted-foreground">Лид ждёт ответа · {l.subject}</p>
                </div>
                <Button size="sm" variant="ghost" asChild><Link to="/chats">Написать</Link></Button>
              </li>
            ))}
            {unpaid.map((l) => (
              <li key={l.id} className="flex items-center gap-3 rounded-xl bg-warning-soft p-3">
                <Wallet className="h-4 w-4 shrink-0 text-warning" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{l.student}</p>
                  <p className="text-xs text-muted-foreground">Не оплачено занятие в {l.time}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => toast.success(`Напоминание отправлено: ${l.student}`)}>Напомнить</Button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
