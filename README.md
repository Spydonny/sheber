# Фронт — витрина маркетплейса Шебер

SPA-витрина для покупателей. Каталог товаров ручной работы, карточка с контактами
продавца, категории, поиск. Общается только с API (`api/`), не трогает бота.

## Стек

| Слой | Технология |
|---|---|
| Фреймворк | React 18 + TypeScript |
| Сборка | Vite 5 |
| Стили | Tailwind CSS 3 |
| Роутинг | React Router 6 |
| HTTP | Fetch API |
| Хостинг | Vercel (S3-совместимая статика) |
| Деплой | Docker (nginx) или Vercel |

## Архитектура

```
front/
├── index.html            # Точка входа
├── package.json          # Зависимости + скрипты
├── vite.config.ts        # Vite (dev server :5173)
├── tailwind.config.ts    # Tailwind
├── tsconfig.json         # TypeScript strict
├── vercel.json           # Vercel: SPA fallback
├── nginx.conf            # nginx: SPA fallback (для Docker)
├── Dockerfile            # Multistage: Node build → nginx serve
├── .env                  # VITE_API_BASE (локально)
├── .env.example          # Шаблон .env
└── src/
    ├── main.tsx          # React entry
    ├── App.tsx           # Роутинг
    ├── api.ts            # HTTP-клиент к API (fetch wrapper)
    ├── types.ts          # TypeScript-типы (Product, LeadResponse, Stats)
    ├── components/       # Переиспользуемые компоненты
    │   ├── Footer.tsx    # Футер с ссылками на ботов
    │   ├── HornMark.tsx  # SVG-орнамент «мүйіз»
    │   ├── ProductCard.tsx
    │   └── StatsBar.tsx
    └── pages/
        ├── Catalog.tsx   # Главная: каталог + фильтры по категориям
        └── Product.tsx   # Карточка товара + контакты продавца
```

## Страницы

| Роут | Компонент | Описание |
|---|---|---|
| `/` | `Catalog` | Каталог: категории, поиск, сетка товаров |
| `/product/:id` | `Product` | Карточка: фото, описание, характеристики, цена, контакты |

## Скрипты

```bash
npm run dev        # Vite dev server (http://localhost:5173)
npm run build      # TypeScript check + Vite production build → dist/
npm run typecheck  # Только проверка типов
npm run preview    # Превью production-сборки
```

## Локальный запуск

```bash
cd front
cp .env.example .env          # VITE_API_BASE=http://localhost:8000
npm install
npm run dev                    # http://localhost:5173
```

## Переменные окружения (front/.env)

| Переменная | По умолчанию | Описание |
|---|---|---|
| `VITE_API_BASE` | `http://localhost:8000` | URL API |
| `VITE_TG_BOT_URL` | `https://t.me/sheber_market_bot` | Ссылка на Telegram-бота |
| `VITE_WA_BOT_URL` | `https://wa.me/77064301168` | Ссылка на WhatsApp-бота |

## Docker

```bash
cd front
docker build -t sheber-front .
docker run -p 80:80 sheber-front   # nginx на :80
```

## Vercel

```bash
vercel --prod
```

`vercel.json` уже настроен: SPA fallback (`/*` → `index.html`), auto-detect Vite.
