import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Paperclip, Bell, SendHorizontal, FileText, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { initialChats, type Chat } from "@/lib/mock-data";

export const Route = createFileRoute("/chats")({
  head: () => ({
    meta: [
      { title: "Беседы — Тьютор CRM" },
      { name: "description", content: "Единое окно переписки с лидами и учениками." },
      { property: "og:title", content: "Беседы — Тьютор CRM" },
      { property: "og:description", content: "Единое окно переписки с лидами и учениками." },
    ],
  }),
  component: ChatsPage,
});

// Сообщения сейчас локальные; позже — подписка Supabase Realtime на таблицу messages.
function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeId, setActiveId] = useState(chats[0].id);
  const [text, setText] = useState("");
  const [q, setQ] = useState("");
  const active = chats.find((c) => c.id === activeId)!;
  const now = () => new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });

  const send = (msg: { text: string; file?: string }) => {
    setChats((cs) => cs.map((c) => c.id === activeId
      ? { ...c, time: now(), messages: [...c.messages, { id: crypto.randomUUID(), fromMe: true, time: now(), ...msg }] }
      : c));
  };

  const open = (id: string) => {
    setActiveId(id);
    setChats((cs) => cs.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-6xl overflow-hidden rounded-2xl bg-card shadow-soft">
      <aside className="flex w-72 shrink-0 flex-col border-r">
        <div className="border-b p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Поиск" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.filter((c) => c.name.toLowerCase().includes(q.toLowerCase())).map((c) => {
            const last = c.messages.at(-1);
            return (
              <button key={c.id} onClick={() => open(c.id)}
                className={cn("flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-muted", c.id === activeId && "bg-accent")}>
                <Avatar><AvatarFallback className="bg-secondary text-secondary-foreground">{c.initials}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <span className="text-xs text-muted-foreground">{c.time}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <p className="truncate text-xs text-muted-foreground">{last?.file ? `📎 ${last.file}` : last?.text}</p>
                    {c.unread > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">{c.unread}</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b px-5 py-3">
          <Avatar><AvatarFallback className="bg-secondary text-secondary-foreground">{active.initials}</AvatarFallback></Avatar>
          <div className="flex-1"><p className="font-medium">{active.name}</p><p className="text-xs text-primary">в сети</p></div>
          <Button variant="ghost" size="sm" onClick={() => toast.success("Напоминание поставлено на завтра, 10:00")}><Bell /> Напомнить</Button>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto bg-muted/40 p-5">
          {active.messages.map((m) => (
            <div key={m.id} className={cn("flex", m.fromMe && "justify-end")}>
              <div className={cn("max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-soft",
                m.fromMe ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-card")}>
                {m.file ? <span className="flex items-center gap-2 font-medium"><FileText className="h-4 w-4" />{m.file}</span> : m.text}
                <span className="ml-2 align-bottom text-[10px] opacity-70">{m.time}</span>
              </div>
            </div>
          ))}
        </div>
        <form className="flex items-center gap-2 border-t p-3"
          onSubmit={(e) => { e.preventDefault(); if (text.trim()) { send({ text }); setText(""); } }}>
          <label className="cursor-pointer rounded-lg p-2 text-muted-foreground hover:bg-muted" title="Прикрепить файл">
            <Paperclip className="h-5 w-5" />
            <input type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) send({ text: "", file: f.name }); e.target.value = ""; }} />
          </label>
          <Input placeholder="Сообщение…" value={text} onChange={(e) => setText(e.target.value)} />
          <Button type="submit" size="icon"><SendHorizontal /></Button>
        </form>
      </section>
    </div>
  );
}
