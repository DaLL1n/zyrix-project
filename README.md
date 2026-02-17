# ✨ Zyrix — Crypto Currency Website

> Next.js · React 18 · TypeScript · Redux Toolkit · SCSS Modules · FSD Architecture

---

## 📚 Содержание

- [Стек технологий](#-стек-технологий)
- [Правила кода](#-правила-кода)

---

## 🛠 Стек технологий

| Технология           | Версия                  |
| -------------------- | ----------------------- |
| Next.js (App Router) | latest                  |
| React                | ^18.2.0                 |
| TypeScript           | ^5.3.3                  |
| Redux Toolkit        | ^2.11.2                 |
| SCSS Modules         | —                       |
| Шрифт                | Poppins (400, 500, 600) |

---

## 📏 Правила кода

<!-- ═══════════════════════════════════════════════════════ -->

<details>
<summary><strong>1. Архитектура — Feature-Sliced Design (FSD)</strong></summary>

### Слои (сверху вниз, зависимости только вниз):

```
app → views → widgets → features → entities → shared
```

### ⚠️ Next.js App Router + FSD:

В Next.js App Router **файловый роутинг** живёт в `src/app/`.  
FSD-слой `views/` (вместо стандартного `pages/`) содержит компоненты страниц с логикой.  
Переименование необходимо, т.к. Next.js трактует `src/pages/` как Pages Router.

Связь между ними:

```
src/app/market/page.tsx              ← Next.js роут (тонкая обёртка, default export)
  └── import { MarketPage } from '@/views/market'  ← FSD-компонент страницы
```

`src/app/**/page.tsx` — **минимальные файлы**, только импорт и default export:

```tsx
// src/app/market/page.tsx
import { MarketPage } from '@/views/market';

export default MarketPage;
```

Вся логика, стейт, UI — в FSD `views/`.

### Структура проекта:

```
src/
├── app/                    # Next.js App Router: роутинг, провайдеры, layout
│   ├── layout.tsx          # Корневой layout
│   ├── page.tsx            # → HomePage
│   ├── market/
│   │   └── page.tsx        # → MarketPage
│   ├── spot/
│   │   └── page.tsx        # → SpotPage
│   ├── wallet/
│   │   └── page.tsx        # → WalletPage
│   ├── providers/          # Redux, Theme и др. провайдеры
│   └── styles/             # Глобальные стили (global.scss)
│
├── views/                  # FSD-слой pages (переименован для App Router)
│   ├── home/
│   ├── market/
│   ├── spot/
│   ├── wallet/
│   ├── dashboard/
│   ├── deposit/
│   ├── withdraw/
│   ├── history/
│   ├── settings/
│   ├── notifications/
│   ├── support/
│   ├── blog/
│   ├── privacy-policy/
│   ├── auth/               # sign-up, log-in
│   └── 404/
│
├── widgets/                # Композиция фичей и энтити
│   ├── header/
│   ├── sidebar/
│   ├── footer/
│   └── menu-modals/
│
├── features/               # Пользовательские сценарии
│   ├── auth/
│   ├── deposit/
│   ├── withdraw/
│   ├── trade/
│   └── notifications/
│
├── entities/               # Бизнес-сущности
│   ├── user/
│   ├── wallet/
│   ├── coin/
│   ├── order/
│   └── transaction/
│
└── shared/                 # Переиспользуемое, без бизнес-логики
    ├── ui/                 # Button, Input, Modal, Card, Badge, Avatar, ...
    ├── lib/                # Утилиты, хелперы
    ├── api/                # Базовый API-клиент
    ├── config/             # Константы, env
    ├── types/              # Глобальные типы
    └── styles/             # SCSS переменные, функции, миксины
```

### Сегменты внутри каждого слайса:

| Сегмент   | Назначение                           |
| --------- | ------------------------------------ |
| `ui/`     | Компоненты (`.tsx` + `.module.scss`) |
| `model/`  | Стейт, слайсы, хуки, типы            |
| `api/`    | Запросы к серверу                    |
| `lib/`    | Утилиты слайса                       |
| `config/` | Конфиг / константы слайса            |

</details>

<!-- ═══════════════════════════════════════════════════════ -->

<details>
<summary><strong>2. Именование файлов</strong></summary>

| Что               | Формат                        | Пример                 |
| ----------------- | ----------------------------- | ---------------------- |
| Компоненты        | `PascalCase.tsx`              | `UserCard.tsx`         |
| Стили             | `PascalCase.module.scss`      | `UserCard.module.scss` |
| Хуки              | `camelCase.ts`                | `useAuth.ts`           |
| Утилиты / хелперы | `camelCase.ts`                | `formatDate.ts`        |
| Типы              | `camelCase.ts` или `types.ts` | `user.ts`, `types.ts`  |
| Слайсы Redux      | `camelCase.ts`                | `walletSlice.ts`       |
| Константы         | `camelCase.ts`                | `routes.ts`            |
| SCSS переменные   | `_kebab-case.scss`            | `_colors.scss`         |

</details>

<!-- ═══════════════════════════════════════════════════════ -->

<details>
<summary><strong>3. Именование в коде</strong></summary>

| Что                  | Формат                  | Пример                    |
| -------------------- | ----------------------- | ------------------------- |
| Компоненты           | `PascalCase`            | `WalletCard`              |
| Функции / переменные | `camelCase`             | `getBalance`, `isLoading` |
| Типы / Интерфейсы    | `PascalCase`            | `WalletData`, `UserProps` |
| Enum                 | `PascalCase`            | `OrderStatus`             |
| Enum-значения        | `PascalCase`            | `OrderStatus.Pending`     |
| Константы            | `UPPER_SNAKE_CASE`      | `MAX_RETRIES`, `API_URL`  |
| SCSS-переменные      | `$kebab-case`           | `$primary`, `$space-md`   |
| CSS-классы (modules) | `camelCase`             | `styles.cardWrapper`      |
| Boolean              | `is/has/should` префикс | `isOpen`, `hasError`      |

</details>

<!-- ═══════════════════════════════════════════════════════ -->

<details>
<summary><strong>4. Экспорт</strong></summary>

- **Компоненты** — только `named export`:

```tsx
// ✅
export const UserCard = () => { ... };

// ❌
export default function UserCard() { ... }
```

- **Исключение** — страницы Next.js (`page.tsx`, `layout.tsx`) используют `default export` (требование фреймворка).

- **Типы** — экспортировать через `export type`:

```ts
export type { UserProps };
export type { Wallet } from './types';
```

</details>

<!-- ═══════════════════════════════════════════════════════ -->

<details>
<summary><strong>5. Компоненты</strong></summary>

- Только **функциональные компоненты** (стрелочные функции):

```tsx
export const UserCard = ({ name, balance }: UserCardProps) => {
  return <div>...</div>;
};
```

- Один компонент — один файл.
- Файл компонента и имя компонента совпадают: `UserCard.tsx` → `UserCard`.
- Стили рядом с компонентом: `UserCard.module.scss`.

</details>

<!-- ═══════════════════════════════════════════════════════ -->

<details>
<summary><strong>6. Стили (SCSS Modules)</strong></summary>

- Каждый компонент — свой `.module.scss`.
- Импорт как `styles`:

```tsx
import styles from './UserCard.module.scss';

<div className={styles.root}>
```

- Общие переменные через `@use`:

```scss
@use '@/shared/styles' as *;

.root {
  color: $primary;
  padding: rem(16px);
}
```

- **Запрещено:** глобальные стили, inline-стили, `!important`, вложенность > 3 уровней.
- **ID-селекторы:** не использовать для стилизации.

</details>

<!-- ═══════════════════════════════════════════════════════ -->

<details>
<summary><strong>7. Redux Toolkit</strong></summary>

- State management — только через **Redux Toolkit**.
- Каждая сущность/фича — отдельный `slice`.
- Структура файлов модели:

```
model/
├── slice.ts           # createSlice
├── selectors.ts       # селекторы
├── types.ts           # типы стейта
└── hooks.ts           # типизированные хуки (useAppSelector, etc.)
```

- Название слайса = название сущности:

```ts
const walletSlice = createSlice({
  name: 'wallet',
  ...
});
```

- Асинхронные операции — `createAsyncThunk`.
- Селекторы — в отдельном файле `selectors.ts`.
- Типизированные хуки:

```ts
import { useAppSelector, useAppDispatch } from '@/app/store';
```

</details>

<!-- ═══════════════════════════════════════════════════════ -->

<details>
<summary><strong>8. API</strong></summary>

- Базовый клиент — в `shared/api/`.
- Каждый слайс может иметь свой `api/` сегмент.
- Запросы через RTK Query или `createAsyncThunk`.
- Типизировать **все** запросы и ответы.
- URL-эндпоинты — константами:

```ts
export const ENDPOINTS = {
  coins: '/api/coins',
  wallet: '/api/wallet',
} as const;
```

</details>

<!-- ═══════════════════════════════════════════════════════ -->

<details>
<summary><strong>9. Общие правила</strong></summary>

- Строгий **TypeScript** — `strict: true`, без `any`.
- `as` — только в крайних случаях с комментарием почему.
- Без «магических» значений — выносить в константы.
- Без закомментированного кода в коммитах.
- Если файл > 150 строк — подумать о декомпозиции.
- Prettier + ESLint — обязательны, форматирование единообразное.

</details>

<!-- ═══════════════════════════════════════════════════════ -->

<details>
<summary><strong>10. Функции</strong></summary>

### Ограничения:

| Метрика                  | Лимит        |
| ------------------------ | ------------ |
| Максимум параметров      | **3**        |
| Максимум вложенности     | **3 уровня** |
| Максимум строк в функции | **30**       |

### Параметры:

- Если параметров > 3 — передавать **объект**:

```ts
// ✅
const createOrder = (params: CreateOrderParams) => { ... };

// ❌
const createOrder = (pair: string, type: string, amount: number, price: number) => { ... };
```

### Вложенность:

```ts
// ❌ Слишком глубоко
if (a) {
  if (b) {
    if (c) {
      if (d) { ... }  // 4-й уровень — запрещено
    }
  }
}

// ✅ Ранний выход (early return)
if (!a) return;
if (!b) return;
if (!c) return;
// основной код
```

### Размер:

- Функция > 30 строк → декомпозировать на вспомогательные.
- Каждая функция делает **одну вещь** (Single Responsibility).

</details>

<!-- ═══════════════════════════════════════════════════════ -->

<details>
<summary><strong>11. Типизация пропсов</strong></summary>

- Пропсы — через `interface`, имя: `ComponentNameProps`:

```tsx
interface UserCardProps {
  name: string;
  balance: number;
  onDeposit: () => void;
}

export const UserCard = ({ name, balance, onDeposit }: UserCardProps) => {
  return <div>...</div>;
};
```

- Если компонент принимает `children`:

```tsx
interface LayoutProps {
  children: React.ReactNode;
}
```

- Если нужно расширить HTML-элемент:

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary';
}
```

- **Не использовать** `React.FC` — деструктурировать пропсы напрямую.

</details>

<!-- ═══════════════════════════════════════════════════════ -->

<details>
<summary><strong>12. Размещение типов</strong></summary>

| Тип                          | Где размещать                   |
| ---------------------------- | ------------------------------- |
| Props компонента             | В том же файле, над компонентом |
| Типы стейта (Redux)          | `model/types.ts`                |
| Типы API (request/response)  | `api/types.ts`                  |
| Общие / переиспользуемые     | `shared/types/`                 |
| Типы только для одного файла | В том же файле                  |

### Правило:

- Тип используется **в одном файле** → объявлять там же.
- Тип используется **в нескольких файлах слайса** → `model/types.ts` или `api/types.ts`.
- Тип используется **в нескольких слайсах** → `shared/types/`.

</details>

<!-- ═══════════════════════════════════════════════════════ -->

<details>
<summary><strong>13. type vs interface</strong></summary>

| Когда                          | Что использовать |
| ------------------------------ | ---------------- |
| Props компонента               | `interface`      |
| Объекты с фиксированной формой | `interface`      |
| Union-типы                     | `type`           |
| Пересечения                    | `type`           |
| Примитивные алиасы             | `type`           |
| Кортежи                        | `type`           |
| Mapped / утилитарные типы      | `type`           |

### Примеры:

```ts
// interface — объект с фиксированной формой
interface Wallet {
  id: string;
  balance: number;
  currency: string;
}

// type — union
type OrderSide = 'buy' | 'sell';

// type — пересечение
type AdminUser = User & { permissions: string[] };

// type — утилитарный
type WalletKeys = keyof Wallet;
```

</details>

<!-- ═══════════════════════════════════════════════════════ -->

<details>
<summary><strong>14. Порядок импортов</strong></summary>

Группы разделяются пустой строкой, порядок сверху вниз:

```tsx
// 1. React / Next
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// 2. Внешние библиотеки
import { useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

// 3. Слои FSD (shared → entities → features → widgets → views)
import { Button } from '@/shared/ui';
import type { ButtonProps } from '@/shared/ui';
import { CoinCard } from '@/entities/coin';
import { useDeposit } from '@/features/deposit';
import { Header } from '@/widgets/header';
import { MarketPage } from '@/views/market';

// 4. Родственные / локальные импорты
import { useWalletData } from '../model/hooks';
import type { Wallet } from '../model/types';
import { WalletItem } from './WalletItem';

// 5. Стили — всегда последние
import styles from './WalletCard.module.scss';
```

### Правила:

1. **Порядок групп:** `react/next` → внешние библиотеки → `@/shared` → `@/entities` → `@/features` → `@/widgets` → `@/views` → локальные (`../`, `./`) → стили.
2. Внутри каждой группы импорты идут по алфавиту.
3. `type`-импорты идут **после value-импортов в той же группе**.
4. Для типов использовать `import type`.
5. SCSS/CSS-импорт всегда последним.

</details>

<!-- ═══════════════════════════════════════════════════════ -->

<details>
<summary><strong>15. Хуки</strong></summary>

- Кастомные хуки — всегда с префиксом `use`:

```ts
const useWalletBalance = () => { ... };
```

- Один хук — одна ответственность.
- Хуки, связанные со стейтом слайса — в `model/hooks.ts`.
- Общие хуки (не привязаны к бизнесу) — в `shared/lib/hooks/`.
- Хук > 30 строк → декомпозировать.

</details>

<!-- ═══════════════════════════════════════════════════════ -->

<details>
<summary><strong>16. Return в компонентах</strong></summary>

- **Без JSX оборачивания в `()`** если возврат одной строки:

```tsx
// ✅ Однострочный
export const Badge = ({ text }: BadgeProps) => <span>{text}</span>;
```

- **С `()` для многострочного JSX:**

```tsx
// ✅ Многострочный
export const UserCard = ({ name }: UserCardProps) => (
  <div className={styles.root}>
    <h2>{name}</h2>
  </div>
);
```

- **С `return`** если есть логика перед JSX:

```tsx
export const WalletCard = ({ id }: WalletCardProps) => {
  const wallet = useAppSelector(selectWallet(id));

  if (!wallet) return null;

  return (
    <div className={styles.root}>
      <span>{wallet.balance}</span>
    </div>
  );
};
```

</details>

<!-- ═══════════════════════════════════════════════════════ -->

<details>
<summary><strong>17. Реэкспорт и Public API (FSD)</strong></summary>

### Принцип:

Каждый слайс выставляет наружу только нужное — через `index.ts` (public API).  
**Импорт внутренних файлов слайса напрямую — запрещён.**

### Где создаётся `index.ts`:

| Уровень  | Путь                        | Пример                                      |
| -------- | --------------------------- | ------------------------------------------- |
| shared   | `shared/<segment>/index.ts` | `shared/ui/index.ts`, `shared/lib/index.ts` |
| entities | `entities/<slice>/index.ts` | `entities/user/index.ts`                    |
| features | `features/<slice>/index.ts` | `features/deposit/index.ts`                 |
| widgets  | `widgets/<slice>/index.ts`  | `widgets/header/index.ts`                   |
| views    | `views/<slice>/index.ts`    | `views/market/index.ts`                     |
| app      | ❌ Нет public API           | Верхний слой, ничего не экспортирует        |

### Правила:

**1. Импорт только через public API:**

```ts
// ✅
import { UserCard } from '@/entities/user';

// ❌ Прямой импорт внутреннего файла
import { UserCard } from '@/entities/user/ui/UserCard';
```

**2. `index.ts` содержит только реэкспорты** (без логики):

```ts
// entities/wallet/index.ts
export { WalletCard } from './ui/WalletCard';
export { walletReducer } from './model/slice';
export type { Wallet } from './model/types';
```

**3. Не экспортировать внутренние хелперы:**

```ts
// ✅ Только публичное
export { Button } from './Button';
export type { ButtonProps } from './Button';

// ❌ Внутренний хелпер — не выносить
export { getButtonClasses } from './lib/getButtonClasses';
```

**4. Перекрёстные импорты между слайсами одного слоя — запрещены:**

```ts
// ❌ feature → feature
import { something } from '@/features/withdraw'; // внутри features/deposit
```

**5. shared/styles — исключение.** SCSS использует `@use` / `@forward`, public API — `_index.scss`:

```scss
@forward 'variables/colors';
@forward 'functions/rem';
```

**6. Внутри слайса** — свободный импорт между сегментами:

```ts
// entities/user/ui/UserCard.tsx
import { useUser } from '../model/hooks'; // ✅ внутри слайса
```

</details>

<!-- ═══════════════════════════════════════════════════════ -->

---

## 📋 Сводная таблица лимитов

| Метрика                      | Лимит    |
| ---------------------------- | -------- |
| Параметров у функции         | 3        |
| Вложенность                  | 3 уровня |
| Строк в функции              | 30       |
| Строк в файле (рекомендация) | 150      |
| Вложенность SCSS             | 3 уровня |
