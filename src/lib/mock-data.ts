export type LeadStatus = "new" | "contacted" | "trial" | "paid" | "lost";

export interface Lead {
  id: string;
  name: string;
  phone?: string;
  telegram?: string;
  subject: string;
  source: string;
  status: LeadStatus;
  created_at: string;
  history: { date: string; text: string }[];
}

export interface Lesson {
  id: string;
  student: string;
  subject: string;
  date: string;
  time: string;
  price: number;
  paid: boolean;
}

export interface Message {
  id: string;
  fromMe: boolean;
  text: string;
  time: string;
  file?: string;
}

export interface Chat {
  id: string;
  name: string;
  initials: string;
  unread: number;
  time: string;
  messages: Message[];
}

export const STATUSES: { id: LeadStatus; title: string; dot: string }[] = [
  { id: "new", title: "Новый", dot: "bg-info" },
  { id: "contacted", title: "Переписка", dot: "bg-warning" },
  { id: "trial", title: "Пробный урок", dot: "bg-chart-4" },
  { id: "paid", title: "Ученик", dot: "bg-primary" },
  { id: "lost", title: "Отказ", dot: "bg-destructive" },
];

export const initialLeads: Lead[] = [
  { id: "1", name: "Анна Смирнова", telegram: "@anna_s", subject: "Английский", source: "Авито", status: "new", created_at: "2026-10-16", history: [{ date: "16 окт", text: "Оставила заявку через Авито" }] },
  { id: "2", name: "Михаил Петров", phone: "+7 912 345-67-89", subject: "Математика, ЕГЭ", source: "Сайт", status: "new", created_at: "2026-10-15", history: [{ date: "15 окт", text: "Заявка с сайта" }] },
  { id: "3", name: "Ольга Кузнецова", telegram: "@olga_k", subject: "Физика, 9 класс", source: "Сарафан", status: "contacted", created_at: "2026-10-13", history: [{ date: "13 окт", text: "Первое сообщение" }, { date: "14 окт", text: "Обсудили цели и расписание" }] },
  { id: "4", name: "Дмитрий Волков", phone: "+7 903 111-22-33", subject: "Python", source: "Профи.ру", status: "trial", created_at: "2026-10-10", history: [{ date: "11 окт", text: "Назначен пробный на 18 окт" }] },
  { id: "5", name: "Елена Новикова", telegram: "@lena_n", subject: "Английский, IELTS", source: "Instagram", status: "paid", created_at: "2026-10-02", history: [{ date: "5 окт", text: "Оплатила пакет из 8 уроков" }] },
  { id: "6", name: "Артём Соколов", phone: "+7 916 555-44-33", subject: "Химия", source: "Авито", status: "lost", created_at: "2026-09-28", history: [{ date: "30 сен", text: "Не подошла цена" }] },
  { id: "7", name: "Мария Лебедева", telegram: "@masha_l", subject: "Математика, ОГЭ", source: "Сайт", status: "contacted", created_at: "2026-10-14", history: [{ date: "14 окт", text: "Ждёт ответа по стоимости" }] },
];

export const todayLessons: Lesson[] = [
  { id: "l1", student: "Елена Новикова", subject: "IELTS Speaking", date: "2026-10-17", time: "11:00", price: 2500, paid: true },
  { id: "l2", student: "Иван Морозов", subject: "Алгебра", date: "2026-10-17", time: "14:30", price: 2000, paid: false },
  { id: "l3", student: "Софья Белова", subject: "Английский", date: "2026-10-17", time: "17:00", price: 2000, paid: true },
  { id: "l4", student: "Кирилл Орлов", subject: "Python", date: "2026-10-17", time: "19:00", price: 3000, paid: false },
];

export const weekLessons: Record<string, Lesson[]> = {
  "Пн": [{ id: "w1", student: "Софья Белова", subject: "Английский", date: "", time: "16:00", price: 2000, paid: true }],
  "Вт": [{ id: "w2", student: "Иван Морозов", subject: "Алгебра", date: "", time: "15:00", price: 2000, paid: true }, { id: "w3", student: "Кирилл Орлов", subject: "Python", date: "", time: "19:00", price: 3000, paid: true }],
  "Ср": [{ id: "w4", student: "Елена Новикова", subject: "IELTS", date: "", time: "11:00", price: 2500, paid: true }],
  "Чт": [{ id: "w5", student: "Дмитрий Волков", subject: "Пробный · Python", date: "", time: "18:00", price: 0, paid: true }],
  "Пт": [],
  "Сб": todayLessons,
  "Вс": [],
};

export const initialChats: Chat[] = [
  { id: "c1", name: "Анна Смирнова", initials: "АС", unread: 2, time: "10:02", messages: [
    { id: "m1", fromMe: false, text: "Здравствуйте! Хочу подтянуть разговорный английский", time: "09:58" },
    { id: "m2", fromMe: false, text: "Есть ли свободное время по вечерам?", time: "10:02" },
  ] },
  { id: "c2", name: "Елена Новикова", initials: "ЕН", unread: 0, time: "Вчера", messages: [
    { id: "m3", fromMe: true, text: "Елена, прикрепляю домашнее задание к среде", time: "18:40" },
    { id: "m4", fromMe: true, text: "", time: "18:40", file: "IELTS_Writing_Task2.pdf" },
    { id: "m5", fromMe: false, text: "Спасибо, всё сделаю!", time: "19:15" },
  ] },
  { id: "c3", name: "Иван Морозов", initials: "ИМ", unread: 1, time: "Вчера", messages: [
    { id: "m6", fromMe: true, text: "Иван, напоминаю про оплату следующего занятия", time: "12:00" },
    { id: "m7", fromMe: false, text: "Да, оплачу сегодня вечером", time: "20:11" },
  ] },
  { id: "c4", name: "Мария Лебедева", initials: "МЛ", unread: 0, time: "14 окт", messages: [
    { id: "m8", fromMe: false, text: "Сколько стоит подготовка к ОГЭ?", time: "13:20" },
  ] },
];
