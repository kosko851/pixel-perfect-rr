import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Send, Plus, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { STATUSES, initialLeads, type Lead, type LeadStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/leads")({
  head: () => ({
    meta: [
      { title: "Лиды — Тьютор CRM" },
      { name: "description", content: "Канбан-воронка лидов: от заявки до оплаты." },
      { property: "og:title", content: "Лиды — Тьютор CRM" },
      { property: "og:description", content: "Канбан-воронка лидов: от заявки до оплаты." },
    ],
  }),
  component: LeadsPage,
});

function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", subject: "", source: "" });

  const move = (id: string, status: LeadStatus) => {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    setSelected((s) => (s && s.id === id ? { ...s, status } : s));
  };

  const add = () => {
    if (!form.name.trim()) return;
    const isTg = form.contact.startsWith("@");
    setLeads((ls) => [{
      id: crypto.randomUUID(), name: form.name, subject: form.subject || "—", source: form.source || "Вручную",
      status: "new", created_at: new Date().toISOString().slice(0, 10),
      ...(isTg ? { telegram: form.contact } : { phone: form.contact }),
      history: [{ date: "Сегодня", text: "Лид добавлен вручную" }],
    }, ...ls]);
    setForm({ name: "", contact: "", subject: "", source: "" });
    setAdding(false);
    toast.success("Лид добавлен");
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Лиды" subtitle="Перетаскивайте карточки между этапами воронки">
        <Button onClick={() => setAdding(true)}><Plus /> Добавить лида</Button>
      </PageHeader>

      <div className="-mx-4 flex flex-1 gap-4 overflow-x-auto px-4 pb-4 md:-mx-8 md:px-8">
        {STATUSES.map((col) => {
          const items = leads.filter((l) => l.status === col.id);
          return (
            <div
              key={col.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dragId && move(dragId, col.id)}
              className="flex w-72 shrink-0 flex-col rounded-2xl bg-muted/70 p-3"
            >
              <div className="mb-3 flex items-center gap-2 px-1">
                <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                <span className="text-sm font-semibold">{col.title}</span>
                <span className="ml-auto text-xs text-muted-foreground">{items.length}</span>
              </div>
              <div className="flex min-h-24 flex-col gap-2">
                {items.map((l) => (
                  <button
                    key={l.id}
                    draggable
                    onDragStart={() => setDragId(l.id)}
                    onDragEnd={() => setDragId(null)}
                    onClick={() => setSelected(l)}
                    className="cursor-grab rounded-xl bg-card p-3 text-left shadow-soft transition hover:-translate-y-0.5 active:cursor-grabbing"
                  >
                    <p className="font-medium">{l.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{l.telegram ?? l.phone}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <Badge variant="secondary">{l.subject}</Badge>
                      <Badge variant="outline">{l.source}</Badge>
                    </div>
                    <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" />{new Date(l.created_at).toLocaleDateString("ru")}</p>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>{selected.subject} · {selected.source}</SheetDescription>
              </SheetHeader>
              <div className="space-y-6 px-4">
                <div className="space-y-2 text-sm">
                  {selected.phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{selected.phone}</p>}
                  {selected.telegram && <p className="flex items-center gap-2"><Send className="h-4 w-4 text-muted-foreground" />{selected.telegram}</p>}
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">Этап</p>
                  <Select value={selected.status} onValueChange={(v) => move(selected.id, v as LeadStatus)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="mb-3 text-sm font-medium">История коммуникаций</p>
                  <ol className="space-y-3 border-l pl-4">
                    {selected.history.map((h, i) => (
                      <li key={i} className="relative">
                        <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                        <p className="text-xs text-muted-foreground">{h.date}</p>
                        <p className="text-sm">{h.text}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent>
          <DialogHeader><DialogTitle>Новый лид</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Телефон или @telegram" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
            <Input placeholder="Предмет" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <Input placeholder="Источник (Авито, сайт…)" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
          </div>
          <DialogFooter><Button onClick={add}>Добавить</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
