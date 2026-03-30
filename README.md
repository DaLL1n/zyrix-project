# Zyrix

`Zyrix` — frontend криптоплатформы с маркетинговым landing page, пользовательским onboarding через регистрацию и market-search сценариями для работы с данными монет.  
Проект показывает production-подход к разработке на `Next.js`: `App Router`, `Feature-Sliced Design`, `RTK Query`, `Zod`, BFF-роуты к `CoinGecko` и подготовленная интеграция с `Supabase`.

<a id="toc"></a>

## 📚 Оглавление

- [🧭 Что это за проект](#about)
- [Маршруты, которые есть сейчас](#routes)
- [🧱 Стек](#stack)
- [🏗️ Архитектура](#architecture)
- [Как устроен код](#architecture-layout)
- [Что важно знать перед работой](#architecture-notes)
- [🗂️ Структура проекта](#structure)
- [Основные директории](#structure-dirs)
- [🎨 Figma](#figma)
- [📊 Статус реализации](#status)
- [✅ Реализовано](#status-done)
- [🔧 В процессе / частично](#status-partial)
- [📋 Пока не реализовано](#status-planned)
- [🚀 Установка и запуск](#setup)
- [Требования](#setup-requirements)
- [Быстрый старт](#setup-quickstart)
- [🔐 Переменные окружения](#env)
- [📜 Скрипты](#scripts)
- [✅ Качество и проверки](#quality)
- [📏 Стандарты проекта](#standards)
- [⚠️ Ограничения и текущее поведение](#limitations)

<a id="about"></a>

## 🧭 Что это за проект

Проект закрывает три работающих сценария:

- landing page с маркетинговыми секциями
- страницу регистрации с клиентской и серверной валидацией
- поиск и trending-выдачу монет через BFF-роуты

Текущее состояние кода:

- UI собирается через `Next.js App Router`
- структура проекта следует `FSD`
- server-state работает через `RTK Query`
- формы и внешние данные валидируются через `Zod`
- в зависимостях подключен `Supabase`, но auth-flow на него пока не переведен

<a id="routes"></a>

### Маршруты, которые есть сейчас

| Маршрут                      | Назначение                    |
| ---------------------------- | ----------------------------- |
| `/`                          | главная страница              |
| `/register`                  | экран регистрации             |
| `/api/coins/search`          | BFF-роут для поиска монет     |
| `/api/coins/search/trending` | BFF-роут для trending-запроса |

<a id="stack"></a>

## 🧱 Стек

| Категория                 | Что используется                                                     |
| ------------------------- | -------------------------------------------------------------------- |
| Язык                      | `TypeScript`                                                         |
| Фреймворк                 | `Next.js App Router`                                                 |
| UI                        | `React 19`, `SCSS Modules`, `clsx`                                   |
| State management          | `Redux Toolkit`, `RTK Query`, `react-redux`                          |
| Валидация                 | `Zod`, `@conform-to/react`, `@conform-to/zod`                        |
| API / Backend integration | `CoinGecko` через `app/api`, `Supabase SSR`, `@supabase/supabase-js` |
| Графики                   | `chart.js`, `react-chartjs-2`                                        |
| Code quality              | `ESLint`, `Prettier`, `Husky`, `lint-staged`                         |
| Package manager           | `npm`                                                                |
| Рекомендуемый Node.js     | `20.x`                                                               |

<a id="architecture"></a>

## 🏗️ Архитектура

<details open>
<summary><strong>Показать раздел</strong></summary>

<a id="architecture-layout"></a>

### Как устроен код

Проект разделен на два уровня:

- `src/app` отвечает за entrypoint-логику Next.js: `layout.tsx`, `page.tsx`, route handlers, providers и store
- FSD-слои ниже отвечают за UI, сценарии и доменные сущности

Ключевые части архитектуры:

- `views` содержит route-level UI вместо `pages`
- `widgets` собирает крупные блоки страницы, например `Header` и `Footer`
- `features` содержит пользовательские сценарии, например `auth` и `modal-search`
- `entities` держит доменную сущность `coin`: API, схемы, форматтеры и UI
- `shared` хранит базовый UI-kit, конфиг, хуки, утилиты, стили и `baseApi`

Как проходит данные:

```text
UI -> features / entities -> shared
UI -> /api/coins/* -> CoinGecko
Register form -> Conform + Zod + server action
Search modal -> RTK Query -> BFF routes -> CoinGecko
```

<a id="architecture-notes"></a>

### Что важно знать перед работой

- проект использует `views`, а не `pages`, потому что `src/pages` конфликтует с `Next.js Pages Router`
- alias `@/*` указывает на `src/*`
- корневой store создается в `src/app/store/store.ts`
- `RTK Query` строится от `src/shared/api/baseApi.ts`
- `CoinGecko` ключ используется только на сервере, в route handlers
- `docs/code-standards.md` содержит отдельный документ с правилами написания кода

</details>

<a id="structure"></a>

## 🗂️ Структура проекта

<details open>
<summary><strong>Показать раздел</strong></summary>

<a id="structure-dirs"></a>

### Основные директории

```text
.
├── docs/
│   └── code-standards.md     # правила архитектуры и код-стандарты
├── public/
│   └── images/               # статические SVG и изображения
├── src/
│   ├── app/                  # App Router, layouts, providers, api routes
│   ├── views/                # route-level UI: Home, Register
│   ├── widgets/              # page-level блоки: Header, Footer
│   ├── features/             # сценарии: auth, modal-search
│   ├── entities/             # доменные сущности: coin
│   └── shared/               # UI-kit, config, hooks, styles, utils, baseApi
├── .github/workflows/        # CI
├── .husky/                   # pre-commit и pre-push hooks
├── package.json
└── tsconfig.json
```

Что видно по коду прямо сейчас:

- route-level страницы есть только для `Home` и `Register`
- `app/api` содержит только роуты для поиска монет
- `shared/ui` играет роль внутреннего UI-kit
- `docs/code-standards.md` нужно читать отдельно от этого README

</details>

<a id="figma"></a>

## 🎨 Figma

<https://www.figma.com/design/1mh1FByERVMol4iDJcPBeU/%E2%9C%A8Zyrix-My?node-id=1-11&t=7GMEUOQCpZetI4Rx-1>

<a id="status"></a>

## 📊 Статус реализации

<details open>
<summary><strong>Показать раздел</strong></summary>

<a id="status-done"></a>

### ✅ Реализовано

- landing page: `Hero`, `Features`, `Trending`, `Faq`
- глобальные `Header` и `Footer`
- экран регистрации `/register`
- модальное окно поиска монет
- BFF-роуты для поиска и trending через `CoinGecko`
- таблица трендов и sparklines

<a id="status-partial"></a>

### 🔧 В процессе / частично

- страница регистрации: есть UI и валидация; планируется подключение к `Supabase auth`
- навигация: ссылки есть, целевых страниц в основном нет
- language action: есть кнопка, нет modal
- `CoinRow`: ссылка на `/coin/[id]`, маршрута нет
- `Trade`: CTA есть, сценария нет

<a id="status-planned"></a>

### 📋 Пока не реализовано

- `login` page
- `market`, `spot`, `support`, `learn` и остальные страницы из конфига путей
- dashboard-screen из Figma: sidebar, account overview, chart, news, market cards, transaction history, pagination
- language / currency modal из Figma
- дополнительные account / transaction screens из макета

</details>

<a id="setup"></a>

## 🚀 Установка и запуск

<details open>
<summary><strong>Показать раздел</strong></summary>

<a id="setup-requirements"></a>

### Требования

- `Node.js 20.x`
- `npm`
- доступ в интернет для установки зависимостей

<a id="setup-quickstart"></a>

### Быстрый старт

```bash
git clone <repo-url>
cd zyrix-project
npm install
```

Создай файл `.env.local` в корне проекта и добавь переменные из раздела ниже.

Запуск dev-сервера:

```bash
npm run dev
```

По умолчанию приложение открывается на `http://localhost:3000`.

</details>

<a id="env"></a>

## 🔐 Переменные окружения

<details open>
<summary><strong>Показать раздел</strong></summary>

| Переменная                             | Назначение                                  |
| -------------------------------------- | ------------------------------------------- |
| `COINGECKO_API_KEY`                    | server-only ключ для BFF-роутов `CoinGecko` |
| `NEXT_PUBLIC_SUPABASE_URL`             | публичный URL `Supabase`                    |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | публичный клиентский ключ `Supabase`        |

Пример шаблона:

```env
COINGECKO_API_KEY=your_coingecko_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Важно:

- `.env.local` не коммить
- реальные значения в README не вставлять
- server-only ключи не использовать в client code
- `NEXT_PUBLIC_SUPABASE_*` подготовлены для `Supabase`-интеграции, но текущий auth-flow пока на них не завязан

</details>

<a id="scripts"></a>

## 📜 Скрипты

<details open>
<summary><strong>Показать раздел</strong></summary>

| Команда                | Что делает                                             |
| ---------------------- | ------------------------------------------------------ |
| `npm run dev`          | запускает dev-сервер                                   |
| `npm run build`        | собирает production build                              |
| `npm run start`        | запускает production-сервер                            |
| `npm run lint`         | запускает ESLint                                       |
| `npm run lint:fix`     | исправляет ESLint-ошибки, где это возможно             |
| `npm run typecheck`    | запускает TypeScript без эмита                         |
| `npm run format`       | форматирует проект через Prettier                      |
| `npm run format:check` | проверяет форматирование                               |
| `npm run check`        | последовательно запускает `lint`, `typecheck`, `build` |
| `npm run prepare`      | инициализирует Husky hooks                             |

</details>

<a id="quality"></a>

## ✅ Качество и проверки

<details open>
<summary><strong>Показать раздел</strong></summary>

### Что настроено

- CI в `.github/workflows/ci.yml` запускает `lint`, `typecheck`, `build`
- `pre-commit` hook запускает `npm exec lint-staged`
- `pre-push` hook запускает `npm run check`

### Что проходит сейчас

- `npm run lint` проходит
- `npm run typecheck` проходит
- `npm run build` падает в текущем окружении на `next/font/google`, потому что `Poppins` подтягивается с `fonts.googleapis.com`

Для локальной самопроверки используй:

```bash
npm run lint
npm run typecheck
npm run build
```

</details>

<a id="standards"></a>

## 📏 Стандарты проекта

Правила архитектуры, импортов, RTK, Zod, Supabase и code style вынесены в отдельный документ:

- [./docs/code-standards.md](./docs/code-standards.md)

Этот README отвечает на вопрос “что это за проект и как его запустить”.  
`docs/code-standards.md` отвечает на вопрос “как писать код внутри этого проекта”.

<a id="limitations"></a>

## ⚠️ Ограничения и текущее поведение

- проект пока покрывает только часть макета Figma
- большая часть ссылок из `PATHS` и навигации указывает на страницы, которых еще нет в `src/app`
- build в окружении без доступа к `Google Fonts` падает на загрузке `Poppins` через `next/font/google`
- `Supabase` подготовлен на уровне зависимостей и env, но не подключен к текущему register-flow
