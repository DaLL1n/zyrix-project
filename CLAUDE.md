# CLAUDE.md

Короткий операционный файл для работы в репозитории `zyrix-project`.
Детальные нормы живут в `docs/code-standards.md`. Этот файл не заменяет стандарт и не должен с ним спорить.

## Priority

1. Если есть конфликт между этим файлом, реальным кодом и скриптами проекта, сначала проверь `docs/code-standards.md`, `package.json` и текущую структуру `src/`.
2. Нормативный документ для нового кода: `docs/code-standards.md`.
3. Если заметил расхождение между `CLAUDE.md` и `docs/code-standards.md`, следуй `docs/code-standards.md` и не закрепляй конфликт в новой правке.

## Repo Snapshot

- Verified against repo on `2026-03-31`.
- Stack: `Next.js App Router`, `React 19`, `TypeScript strict`, `Redux Toolkit + RTK Query`, `Zod`, `@conform-to/react`, `Supabase SSR`, `SCSS Modules`.
- Исходный код находится в `src/`.
- Проект использует `views`, а не `pages`.

## Quick Start

1. Новый код пиши только в `*.ts`, `*.tsx`, `*.scss`.
2. Клади код в самый низкий FSD-слой, который решает задачу без нарушения зависимостей.
3. Между слайсами импортируй через `@/` и только через public API. Внутри своего слайса используй относительные пути.
4. Не делай deep import в чужой слайс и не используй `export *`.
5. `page.tsx` и `layout.tsx` держи тонкими. Route-level UI выноси в `views`, `widgets`, `features`, `entities`.
6. Интерактивный компонент это `.client.tsx` + `'use client'`. Server-only код и server actions держи в `.server.ts`.
7. UI не читает секреты, не делает прямой доступ к Supabase и не берет на себя transport-логику.
8. Любой внешний input валидируй через Zod до бизнес-логики.
9. Не используй `any`. Если тип неизвестен, используй `unknown` и narrowing.
10. Async UI обязан явно обрабатывать `loading`, `error`, `empty`, `success`.
11. Комментарии пиши только для намерения, ограничения или неочевидной причины.
12. Когда трогаешь legacy-файл, выравнивай затронутый код и ближайший локальный контекст, но не запускай широкий рефакторинг без задачи.

## Key Decisions

- Базовый RTK Query API живет в `src/shared/api/baseApi.ts`. Слайсы расширяют его через `injectEndpoints`.
- Redux store живет в `src/app/store/store.ts`, provider в `src/app/providers/StoreProvider.tsx`.
- Глобальные стили живут только в `src/app/styles`.
- Для нового SCSS используй:

```scss
@use '@/shared/styles/_index.scss' as *;
```

## Known Deviations

- `src/app/layout.tsx` использует `next/font/google`. `npm run build` зависит от `fonts.googleapis.com`, пока шрифт не self-hosted.
- В проекте еще есть legacy-импорт `@/shared/styles/index.scss`, например в `src/shared/ui/Checkbox/Checkbox.module.scss`. Не переписывай массово без отдельной причины.
- В проекте нет единого test stack. Тесты пока не входят в обязательный PR gate.

## PR Gate

Перед завершением задачи, если правка затрагивает поведение или архитектуру, локально проходят:

```bash
npm run lint
npm run typecheck
npm run build
```

Дополнительно по необходимости:

```bash
npm run format
npm run check
```

## Commit Rules

- Используй Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`.
- Один commit должен описывать одну понятную задачу.
- Не коммить `console.log`, закомментированный код и мертвые файлы "на потом".

## Update Triggers

Обновляй этот файл, если изменились:

- основные правила в `docs/code-standards.md`;
- PR gate или скрипты в `package.json`;
- ключевые архитектурные решения по слоям, client/server boundaries или стилям;
- список известных отклонений, которые больше не должны считаться нормой.
