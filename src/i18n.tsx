import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type Lang = "ru" | "kk";

const STORAGE_KEY = "sheber_lang";

export function plural(n: number, one: string, few: string, many: string): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

type Dict = Record<string, string>;

const STRINGS: Record<Lang, Dict> = {
  ru: {
    heroHeadline: "Украшения и изделия ручной работы — напрямую от мастеров Казахстана",
    tagline: "Каждое изделие — от мастера, напрямую и без посредников. Оплата и доставка без комиссий площадки.",
    tabHome: "Главная",
    tabCatalog: "Витрина",
    heroEyebrow: "Ручная работа · Казахстан",
    exploreCatalog: "Смотреть витрину →",
    value1Title: "Напрямую от мастера",
    value1Text: "Общаетесь и покупаете у автора изделия — без посредников и колл-центров.",
    value2Title: "Без комиссий площадки",
    value2Text: "Оплата напрямую мастеру. Честная цена без наценок агрегатора.",
    value3Title: "Карточку собрал ИИ",
    value3Text: "Фото, характеристики и описание бот аккуратно оформил по паре фраз мастера.",
    featuredTitle: "Свежее на витрине",
    featuredSubtitle: "Последние изделия от мастеров Казахстана",
    allProductsLink: "Все изделия →",
    searchPlaceholder: "Поиск: серьги, войлок, керамика…",
    soldSuffix: "продано",
    becomeSeller: "Я мастер — продавать через бота →",
    chooseChannelTitle: "Где вам удобнее?",
    chooseChannelText: "Выберите мессенджер — откроется чат с ботом, который поможет оформить карточку товара.",
    cancel: "Отмена",
    allProducts: "Все изделия",
    sortNew: "Сначала новые",
    sortCheap: "Дешевле",
    sortExpensive: "Дороже",
    sortPopular: "Популярные",
    loadingProducts: "Загружаем изделия…",
    emptyResults: "Пока ничего не нашлось. Попробуйте другой запрос или категорию.",
    madeByHand: "Каждое изделие сделано руками мастера · Шебер",
    backToCatalog: "← Каталог",
    productNotFound: "Товар не найден.",
    backToCatalogLink: "← Вернуться в каталог",
    loading: "Загружаем…",
    copyLink: "Поделиться",
    copied: "Скопировано ✓",
    contactSeller: "Связаться с мастером",
    contacting: "Открываем…",
    contactHint: "Откроется чат с мастером в WhatsApp или Telegram",
    deliveryDefault: "Доставка по Казахстану (Kaspi Postomat / CDEK)",
    directPayment: "Оплата напрямую мастеру — без комиссий площадки",
    customOrder: "Ручная работа: возможен индивидуальный заказ и свои размеры",
    characteristics: "Характеристики",
    aboutProduct: "О товаре — подробнее",
    aboutProductHint: "Инфографика сгенерирована ботом по фото и описанию мастера",
    similarProducts: "Похожие изделия",
    noContact: "У продавца пока не указан контакт для связи.",
    contactFailed: "Не удалось связаться, попробуйте позже.",
    footerTitle: "Вы мастер? Продавайте здесь",
    step1Title: "Расскажите боту",
    step1Text: "Пара фраз о вашем изделии — текстом, голосом или фото. В Telegram или WhatsApp.",
    step2Title: "ИИ соберёт карточку",
    step2Text: "Название, описание, характеристики и цену по рынку бот додумает сам.",
    step3Title: "Покупатели пишут вам",
    step3Text: "Карточка сразу на витрине. Покупатель связывается с вами напрямую, без комиссий.",
    startTelegram: "Начать в Telegram",
    startWhatsapp: "Начать в WhatsApp",
    footerBrand: "Шебер · маркетплейс ручной работы Казахстана",
    footerMade: "Сделано с уважением к ремеслу",
    viewsSuffix: "просмотров",
    products_one: "изделие",
    products_few: "изделия",
    products_many: "изделий",
    sellers_one: "мастер",
    sellers_few: "мастера",
    sellers_many: "мастеров",
    views_one: "просмотр",
    views_few: "просмотра",
    views_many: "просмотров",
  },
  kk: {
    heroHeadline: "Қолжасау бұйымдары — тікелей Қазақстан шеберлерінен",
    tagline: "Әр бұйым — шебердің өзінен, делдалсыз. Төлем мен жеткізу алаң комиссиясыз.",
    tabHome: "Басты бет",
    tabCatalog: "Витрина",
    heroEyebrow: "Қолжасау · Қазақстан",
    exploreCatalog: "Витринаны қарау →",
    value1Title: "Тікелей шебердің өзінен",
    value1Text: "Бұйым авторымен сөйлесіп, тікелей сатып аласыз — делдалсыз.",
    value2Title: "Алаң комиссиясыз",
    value2Text: "Төлем тікелей шеберге. Агрегатор үстемесіз әділ баға.",
    value3Title: "Карточканы ИИ жинады",
    value3Text: "Фото, сипаттама мен мәтінді бот шебердің бірнеше сөзі бойынша рәсімдеді.",
    featuredTitle: "Витринадағы жаңалықтар",
    featuredSubtitle: "Қазақстан шеберлерінің соңғы бұйымдары",
    allProductsLink: "Барлық бұйымдар →",
    searchPlaceholder: "Іздеу: сырға, киіз, керамика…",
    soldSuffix: "сатылды",
    becomeSeller: "Мен шебермін — бот арқылы сату →",
    chooseChannelTitle: "Сізге қайсысы ыңғайлы?",
    chooseChannelText: "Мессенджерді таңдаңыз — тауар карточкасын жасауға көмектесетін бот чаты ашылады.",
    cancel: "Бас тарту",
    allProducts: "Барлық бұйымдар",
    sortNew: "Алдымен жаңалар",
    sortCheap: "Арзаны",
    sortExpensive: "Қымбаты",
    sortPopular: "Танымал",
    loadingProducts: "Бұйымдар жүктелуде…",
    emptyResults: "Ештеңе табылмады. Басқа сұрау немесе санат таңдап көріңіз.",
    madeByHand: "Әр бұйым шебердің қолымен жасалған · Шебер",
    backToCatalog: "← Каталог",
    productNotFound: "Тауар табылмады.",
    backToCatalogLink: "← Каталогқа оралу",
    loading: "Жүктелуде…",
    copyLink: "Бөлісу",
    copied: "Көшірілді ✓",
    contactSeller: "Шебермен байланысу",
    contacting: "Ашылуда…",
    contactHint: "WhatsApp немесе Telegram-да шебермен чат ашылады",
    deliveryDefault: "Қазақстан бойынша жеткізу (Kaspi Postomat / CDEK)",
    directPayment: "Тікелей шеберге төлем — алаң комиссиясыз",
    customOrder: "Қолжасау: жеке тапсырыс және өз өлшемдеріңіз мүмкін",
    characteristics: "Сипаттамалары",
    aboutProduct: "Тауар туралы — толығырақ",
    aboutProductHint: "Инфографиканы бот шебердің суреті мен сипаттамасы бойынша жасаған",
    similarProducts: "Ұқсас бұйымдар",
    noContact: "Сатушыда әзірге байланыс көрсетілмеген.",
    contactFailed: "Байланысу мүмкін болмады, кейінірек көріңіз.",
    footerTitle: "Сіз шеберсіз бе? Осында сатыңыз",
    step1Title: "Ботқа айтыңыз",
    step1Text: "Бұйымыңыз туралы бірнеше сөз — мәтінмен, дауыспен немесе суретпен. Telegram немесе WhatsApp-та.",
    step2Title: "ИИ карточканы жинайды",
    step2Text: "Атауын, сипаттамасын және нарықтық бағасын бот өзі ойлап табады.",
    step3Title: "Сатып алушылар сізге жазады",
    step3Text: "Карточка бірден витринада. Сатып алушы сізбен тікелей, комиссиясыз байланысады.",
    startTelegram: "Telegram-да бастау",
    startWhatsapp: "WhatsApp-та бастау",
    footerBrand: "Шебер · Қазақстанның қолжасау бұйымдары маркетплейсі",
    footerMade: "Қолөнерге құрметпен жасалған",
    viewsSuffix: "қаралым",
    products_one: "бұйым",
    products_few: "бұйым",
    products_many: "бұйым",
    sellers_one: "шебер",
    sellers_few: "шебер",
    sellers_many: "шебер",
    views_one: "қаралым",
    views_few: "қаралым",
    views_many: "қаралым",
  },
};

export const CATEGORY_LABELS_KK: Record<string, string> = {
  jewelry: "Зергерлік бұйымдар",
  clothing: "Киім",
  food: "Тағам",
  decor: "Декор",
  other: "Басқа",
};

const AVAILABILITY_LABELS: Record<string, Dict> = {
  "в наличии": { ru: "в наличии", kk: "бар" },
  "под заказ": { ru: "под заказ", kk: "тапсырыспен" },
  "нет в наличии": { ru: "нет в наличии", kk: "жоқ" },
};

export function availabilityLabel(lang: Lang, value?: string): string {
  if (!value) return "";
  return AVAILABILITY_LABELS[value]?.[lang] ?? value;
}

export function categoryLabel(lang: Lang, key: string, fallback: string): string {
  return lang === "kk" ? CATEGORY_LABELS_KK[key] ?? fallback : fallback;
}

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    return saved === "kk" ? "kk" : "ru";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      setLang,
      t: (key: string) => STRINGS[lang][key] ?? STRINGS.ru[key] ?? key,
    }),
    [lang]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
