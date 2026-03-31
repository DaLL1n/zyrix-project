# Zyrix Frontend Standards

> Verified against repo on `2026-03-31`.
>
> Current stack: `Next.js App Router`, `React 19`, `TypeScript strict`, `Redux Toolkit + RTK Query`, `Zod`, `@conform-to/react`, `Supabase SSR`, `SCSS Modules`, `Husky + lint-staged`.
>
> Документ нормативный для нового кода. Legacy-код приводим к нему только когда трогаем файл. Правила с пометкой `review` обязательны, даже если они пока не автоматизированы.

<details open>
<summary><strong>Quick Start</strong></summary>

**Уровни правил**

- `MUST`: обязательно для нового кода.
- `DEFAULT`: правило по умолчанию, отступление нужно коротко объяснить в PR.
- `EXCEPTION`: заранее описанное допустимое отклонение.

**10 правил по умолчанию**

1. Новый код пишем только в `*.ts`, `*.tsx`, `*.scss`.
2. Код кладем в самый низкий слой, который решает задачу без нарушения зависимостей.
3. Между слайсами импортируем только через `@/`, внутри слайса используем только относительные пути.
4. Внешние слои импортируют слайс только через его public API.
5. Server-only exports не попадают в общий `index.ts`, а в `shared` импортируются из конкретного server-only модуля.
6. `page.tsx` и `layout.tsx` остаются тонкими.
7. Интерактивный компонент это `.client.tsx` + `'use client'`.
8. Server action это `.server.ts` + `'use server'`.
9. UI не читает секреты, не занимается transport-логикой и не логирует инфраструктурные ошибки.
10. Перед PR локально проходят `npm run lint`, `npm run typecheck`, `npm run build`.

**PR gate**

```bash
npm run lint
npm run typecheck
npm run build
```

**Enforcement**

| Правило | Уровень | Проверка сейчас |
| --- | --- | --- |
| форматирование | `MUST` | `Prettier`, `lint-staged` |
| типы | `MUST` | `tsc --noEmit` |
| базовые Next/React/TS правила | `MUST` | `ESLint` |
| сборка | `MUST` | `next build` |
| границы слоев | `MUST` | `ESLint` + `review` |
| `import type` и type-only imports | `MUST` | `ESLint` |
| client files vs server-only entrypoints | `MUST` | `ESLint` + `review` |
| deep import и часть client/server boundaries | `MUST` | `review` |
| тесты | `EXCEPTION` | вне gate |

**Known deviations**

| Path / area | Отклонение | Removal trigger |
| --- | --- | --- |
| `src/app/layout.tsx` | используется `next/font/google` | self-hosted font |
| `npm run build` | build зависит от `fonts.googleapis.com` | убрать сетевую зависимость из layout |
| `src/app/layout.tsx` | есть side-effect import чужих `*.module.scss` | перенести повторяемые стили в `src/app/styles` или shared styles |
| tests | нет единого test tooling | появление единого test stack |

</details>

<details>
<summary><strong>1. Архитектура и слои</strong></summary>

**Целевая структура**

```text
src/
├── app/
├── views/
├── widgets/
├── features/
├── entities/
└── shared/
```

`views`, а не `pages`, потому что `src/pages` зарезервирован Next.js под Pages Router.

**Ответственность слоев**

| Слой | Что хранить | Что не хранить |
| --- | --- | --- |
| `app` | entrypoints, providers, store setup, global styles | feature/entity/widget логику, переиспользуемый UI |
| `views` | route-level UI и композицию страницы | общий UI, доменную модель |
| `widgets` | крупные page-level блоки | атомарный UI, узкие user actions |
| `features` | пользовательские сценарии и flow | общий UI, page composition |
| `entities` | сущность, ее API, схемы, UI, нормализацию | page sections, глобальные утилиты |
| `shared` | базовый UI, config, hooks, formatters, base API, style tokens | бизнес-сущности и user actions |

**Правило зависимостей**

| Откуда | Можно импортировать |
| --- | --- |
| `app` | `views`, `widgets`, `features`, `entities`, `shared` |
| `views` | `widgets`, `features`, `entities`, `shared` |
| `widgets` | `features`, `entities`, `shared` |
| `features` | `entities`, `shared` |
| `entities` | `shared` |
| `shared` | только `shared` |

**Куда класть новый код**

- route-level композиция: `views`
- крупный блок для нескольких маршрутов: `widgets`
- законченное действие пользователя: `features`
- доменная сущность и данные вокруг нее: `entities`
- business-agnostic UI и базовые утилиты: `shared`
- browser-facing BFF или secret-dependent endpoint: `app/api`

**Правила**

- `MUST`: кладем код в самый низкий слой, который решает задачу без нарушения зависимостей.
- `DEFAULT`: не поднимаем код в `shared` автоматически на втором использовании.
- `MUST`: один слайс имеет одного явного владельца по данным, схемам, API и UI вокруг сущности или сценария.

</details>

<details>
<summary><strong>2. Слайсы, сегменты и public API</strong></summary>

**Разрешенные сегменты**

```text
ui/
model/
api/
lib/
config/
consts/
index.ts
```

- `MUST`: не создаем пустые папки.
- `MUST`: не вводим альтернативные сегменты вроде `helpers`, `services`, `data`, `utils2`.
- `DEFAULT`: `model/` и `api/` появляются только когда в них есть реальное содержимое.

**Что хранить**

| Сегмент | Содержимое |
| --- | --- |
| `ui/` | компоненты и их `*.module.scss` |
| `model/` | state, hooks, selectors, schemas, types |
| `api/` | RTK Query endpoints, server actions, transport-обертки |
| `lib/` | чистые функции без React и state |
| `config/` | локальные флаги, мапы, routes |
| `consts/` | константы для нескольких файлов слайса |

**Public API**

- `MUST`: если слайс импортируется снаружи, у него есть `index.ts`.
- `MUST`: `index.ts` содержит только явные реэкспорты.
- `MUST`: `export *` не используем.
- `MUST`: внешние слои импортируют слайс только через public API.
- `MUST`: внутри своего слайса не импортируем через собственный `index.ts`.
- `MUST`: server-only exports не попадают в общий `index.ts`.
- `DEFAULT`: в `features` и `entities` server-only контракт может иметь отдельный `*.server.ts` entrypoint.
- `MUST`: в `shared` избегаем generic `server.ts` barrel. Импортируем из конкретного server-only модуля, например `shared/api/supabase/server`.

</details>

<details>
<summary><strong>3. Next.js App Router и client/server boundaries</strong></summary>

**Что живет в `src/app`**

- `layout.tsx`
- `page.tsx`
- `route.ts`
- route groups
- providers
- store setup
- global styles

Весь FSD UI и логика живут вне `src/app`.

**Тонкие entrypoints**

- `MUST`: `page.tsx` и `layout.tsx` оставляем минимальными.
- `MUST`: route-level UI и пользовательские сценарии выносим в `views`, `widgets`, `features`, `entities`.
- `DEFAULT`: в `page.tsx` допустимы server fetch, чтение `params/searchParams`, подготовка сериализуемых props и metadata.
- `MUST`: в `layout.tsx` не тянем форменную логику, поиск, Supabase или transport.

**Client / Server файлы**

- `MUST`: интерактивный компонент это `.client.tsx` + `'use client'`.
- `MUST`: server action это `.server.ts` + `'use server'`.
- `MUST`: если интерактивности нет, компонент остается server component по умолчанию.

**Граница между server и client**

- `MUST`: из server component в client component передаем только сериализуемые данные.
- `MUST`: client-файлы не импортируют `.server.ts`, `next/headers`, server-only Supabase helpers и другие server-only модули.
- `MUST`: секреты и `process.env` с ключами живут только на сервере.

**Когда нужен `app/api`**

Используем `app/api`, если нужен секрет, BFF-контракт для браузера, нормализация внешнего response или публичный HTTP endpoint внутри Next-приложения. Если код выполняется только на сервере и HTTP-контракт не нужен, держим его в `entities/*/api` или `features/*/api`.

</details>

<details>
<summary><strong>4. Импорты и экспорты</strong></summary>

**Порядок групп импортов**

1. `react`, `next`
2. внешние библиотеки
3. FSD-слои сверху вниз: `@/app` -> `@/views` -> `@/widgets` -> `@/features` -> `@/entities` -> `@/shared`
4. относительные импорты внутри текущего слайса
5. стили

**Правила**

- `MUST`: между слайсами используем только абсолютный импорт через `@/`.
- `MUST`: внутри своего слайса используем только относительные пути.
- `MUST`: deep import в чужой слайс запрещен.
- `MUST`: наружу из слайса выходим только через public API или отдельный server-only entrypoint.
- `MUST`: type-only imports оформляем как `import type`.
- `MUST`: lower layer не импортирует upper layer.
- `MUST`: не импортируем чужой `*.module.scss`.
- `DEFAULT`: логические группы импортов разделяем пустой строкой.

</details>

<details>
<summary><strong>5. State, формы, Zod, API и Supabase</strong></summary>

**Redux Toolkit и store**

Базовая структура:

```text
src/app/store/store.ts
src/app/providers/StoreProvider.tsx
src/shared/api/baseApi.ts
src/shared/lib/hooks/useAppDispatch.ts
src/shared/lib/hooks/useAppSelector.ts
src/shared/lib/hooks/useAppStore.ts
src/entities/coin/api/coinApi.ts
```

- `MUST`: корневой store живет в `src/app/store/store.ts`.
- `MUST`: Redux provider живет в `src/app/providers/StoreProvider.tsx`.
- `MUST`: typed hooks живут в `src/shared/lib/hooks`.
- `MUST`: RTK Query base API живет в `src/shared/api/baseApi.ts`.
- `DEFAULT`: локальное UI-состояние держим локально. Redux не нужен для каждого `open` или `close`.

**Чем решать задачу**

| Ситуация | Инструмент |
| --- | --- |
| локальное UI-состояние | local state |
| server-state с кэшем и refetch | RTK Query |
| submit формы, auth-flow, mutation в App Router | server action |
| сложная клиентская оркестрация | `createAsyncThunk` |

**Формы**

- `DEFAULT`: формы на server actions строим через `@conform-to/react` и общую Zod-схему.
- `MUST`: один контракт формы это одна Zod-схема у владельца сценария.
- `MUST`: если форма валидируется и на клиенте, и на сервере, обе стороны используют одну схему.
- `MUST`: UI-компонент формы отвечает только за рендер полей и wiring.
- `MUST`: не дублируем значения, ошибки и `pending` в лишних `useState`, если они уже доступны через форму и `useActionState`.
- `MUST`: чувствительные поля не возвращаем обратно в UI после неуспешного submit.

**Zod и API-слой**

- `MUST`: внешний input валидируем через Zod до использования в бизнес-логике.
- `MUST`: схемы храним у владельца сценария или сущности.
- `MUST`: transport-уровень и внешние запросы живут в `api/`.
- `MUST`: чистые преобразования response живут в `lib/`.
- `MUST`: UI не занимается fetch, `schema.parse`, `console.error` и знанием о внешнем ответе.
- `MUST`: expected errors и unexpected infrastructure errors разделяем.

**Supabase**

- `MUST`: Supabase-клиенты создаем только в server-only API-функциях, route handlers и server actions.
- `MUST`: прямой доступ к Supabase из UI-компонента запрещен.
- `DEFAULT`: auth и session операции заворачиваем в feature или entity API, а не пишем напрямую в компоненте.

</details>

<details>
<summary><strong>6. Code Style, TypeScript и React</strong></summary>

**Именование файлов и папок**

| Что | Формат | Примеры |
| --- | --- | --- |
| `views`, `widgets` root folders | `PascalCase` | `Home`, `SignUp`, `Header` |
| `features`, `entities` slices | `kebab-case` или lowercase | `auth`, `modal-search`, `coin` |
| компонент | `PascalCase.tsx` | `HomePage.tsx`, `CoinRow.tsx` |
| client component | `PascalCase.client.tsx` | `RegisterForm.client.tsx` |
| server action / server-only API | `camelCase.server.ts` или вложенный `server.ts` | `signUpAction.server.ts`, `supabase/server.ts` |
| schema file | `*.schemas.ts` или `schemas.ts` | `auth.schemas.ts`, `schemas.ts` |
| types file | `types.ts` или `*.types.ts` | `search.types.ts`, `Button.types.ts` |
| SCSS module | `PascalCase.module.scss` | `Header.module.scss` |

**Правила типизации**

- `MUST`: опираемся на `strict: true`.
- `MUST`: `any` не используем. Вместо него `unknown` и явный narrowing.
- `DEFAULT`: `interface` используем для расширяемых object contracts и HTML props.
- `DEFAULT`: `type` используем для union, intersection, alias и локальных prop types.
- `MUST`: non-null assertion `!` допустим только рядом с явной runtime-гарантией.
- `DEFAULT`: для констант-массивов предпочитаем `as const` и `satisfies`, если это улучшает проверку.

**Порядок внутри файла компонента**

1. импорты
2. локальные `type` и `interface`
3. локальные `const`
4. `export const Component = (...) => {`
5. hooks, selectors, state
6. derived values
7. handlers и helpers
8. early returns
9. JSX

**Размер файлов и React-правила**

- `DEFAULT`: `~120` строк для компонентного файла и `~40` строк для одной функции это пороги для review, а не hard limit.
- `MUST`: не ставим `'use client'` без интерактивности.
- `MUST`: не используем `useState`, `useEffect` и browser-only API в server component.
- `DEFAULT`: не используем `useEffect` для синхронного вычисления данных из props или state, если это можно сделать в render.
- `DEFAULT`: не добавляем `memo`, `useMemo`, `useCallback` по привычке.

**Комментарии и JSDoc**

- `DEFAULT`: комментарии пишем для намерения, ограничения или неочевидной причины.
- `MUST`: не пишем комментарии, которые просто дублируют синтаксис.
- `DEFAULT`: JSDoc нужен у экспортируемых `lib` и `api` функций и у non-obvious контрактов.
- `MUST`: если комментарий устарел, исправляем или удаляем его в той же правке.

</details>

<details>
<summary><strong>7. Стили и SCSS Modules</strong></summary>

**Глобальные стили**

- `MUST`: глобальные стили живут только в `src/app/styles`.
- `MUST`: новый глобальный класс добавляем только если он реально нужен всему приложению.
- `MUST`: page-specific стили в globals не выносим.

**SCSS Modules**

- `MUST`: каждый компонент хранит `*.module.scss` рядом с собой.
- `MUST`: классы называем в `kebab-case`.
- `DEFAULT`: для нового кода обращаемся к классам через `styles['class-name']`.
- `EXCEPTION`: legacy `styles.foo` допустим в нетронутых файлах.

**Токены и правила**

- `MUST`: для нового кода используем:

```scss
@use '@/shared/styles/_index.scss' as *;
```

- `EXCEPTION`: старые импорты через `@use '@/shared/styles/index.scss' as *;` не переписываем массово.
- `DEFAULT`: при изменении такого файла переводим его на `_index.scss`.
- `DEFAULT`: для повторяемых отступов и типографики предпочитаем токены и `rem()`, а не случайные raw `px`.
- `MUST`: один корневой block-class на компонент.
- `MUST`: максимум 2 уровня вложенности в module styles.
- `MUST`: `!important` запрещен.
- `MUST`: не импортируем чужой `*.module.scss`.
- `MUST`: не используем inline styles для верстки.

</details>

<details>
<summary><strong>8. Доступность, async states и ошибки</strong></summary>

**Доступность и семантика**

- `MUST`: интерактивные элементы делаем семантическими: `button`, `a`, `input`, `label`, а не `div` со слушателями.
- `MUST`: icon-only кнопка имеет доступное имя через текст или `aria-label`.
- `MUST`: у поля формы есть явный label или корректный `aria-label`.
- `MUST`: ошибки поля и подсказки доступны для screen reader и логически связаны с полем.
- `MUST`: клавиатурная навигация и видимый focus state обязательны.
- `MUST`: цвет сам по себе не должен быть единственным носителем состояния.

**Async UI**

- `MUST`: каждый async UI явно обрабатывает `loading`, `error`, `empty`, `success`.
- `MUST`: пользовательская mutation во время `pending` защищена от повторного submit или клика.
- `DEFAULT`: spinner, skeleton и optimistic UI зависят от контекста, но пользователь всегда должен понимать, что сейчас происходит.
- `DEFAULT`: empty state не должен быть пустым экраном.

**Ошибки**

- `MUST`: логируем на границе transport или server layer.
- `MUST`: UI не занимается `console.error`, кроме действительно неожиданного client-only case.
- `MUST`: expected errors возвращаем в предсказуемом формате.
- `MUST`: unexpected infrastructure errors не маскируем слишком рано, если выше есть место для корректной обработки.

</details>

<details>
<summary><strong>9. Качество, legacy migration и коммиты</strong></summary>

**Чек перед PR**

```bash
npm run lint
npm run typecheck
npm run build
```

**Тесты**

- `EXCEPTION`: тесты пока не входят в обязательный PR gate, потому что в проекте нет единого test tooling.
- `DEFAULT`: если позже появляется единый test stack, этот документ обновляется вместе со скриптами в `package.json` и CI.
- `MUST`: не вводим локальный мини-стандарт тестов только для одной фичи.

**Legacy migration**

- `MUST`: когда трогаем legacy-файл, выравниваем хотя бы затронутый код и ближайший локальный контекст под текущий стандарт.
- `DEFAULT`: не смешиваем продуктовую задачу с широким рефакторингом без причины.
- `DEFAULT`: крупные rename-only и move-only изменения без поведенческого эффекта лучше выносить в отдельный PR.

**Коммиты**

```text
feat(auth): add sign up form validation
fix(coin): handle empty trending response
refactor(header): move modal trigger into feature
docs(standards): align frontend standards with current repo
```

- `DEFAULT`: один commit это одна понятная задача.
- `MUST`: не коммитим закомментированный код.
- `MUST`: не коммитим `console.log`.
- `MUST`: не коммитим мертвые файлы на потом.

</details>
