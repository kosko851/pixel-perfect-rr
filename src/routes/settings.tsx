import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Настройки — Тьютор CRM" },
      { name: "description", content: "Профиль репетитора и стоимость занятий." },
      { property: "og:title", content: "Настройки — Тьютор CRM" },
      { property: "og:description", content: "Профиль репетитора и стоимость занятий." },
    ],
  }),
  component: Settings,
});

function Settings() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Настройки" subtitle="Профиль и параметры занятий" />
      <Card className="space-y-4 rounded-xl border-0 p-6 shadow-soft">
        <div className="space-y-2"><Label>Имя</Label><Input defaultValue="Екатерина Иванова" /></div>
        <div className="space-y-2"><Label>Предметы</Label><Input defaultValue="Английский, математика, Python" /></div>
        <div className="space-y-2"><Label>Стоимость урока, ₽</Label><Input type="number" defaultValue={2000} /></div>
        <Button onClick={() => toast.success("Сохранено")}>Сохранить</Button>
      </Card>
    </div>
  );
}
