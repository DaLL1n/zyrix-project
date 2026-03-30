# Zyrix Frontend Standards

> Стек проекта: `Next.js App Router`, `React 19`, `TypeScript strict`, `Redux Toolkit + RTK Query`, `Zod`, `Supabase SSR`, `SCSS Modules`, `Husky + lint-staged`.

<details>
<summary><strong>1. FSD-архитектура и карта слоев</strong></summary>

## Целевая структура

```text
src/
├── app/                    # Next.js entrypoint: layouts, routes, providers, store, global styles, route handlers
├── views/                  # FSD pages-layer для route-level UI
├── widgets/                # крупные блоки страницы
├── features/               # пользовательские сценарии
├── entities/               # бизнес-сущности
└── shared/                 # переиспользуемый фундамент без бизнес-логики
```

## Почему `views`, а не `pages`

В FSD это слой `pages`.  
Используй директорию `views`, потому что `src/pages` у Next.js зарезервирован под Pages Router.

```tsx
// ✅ правильно: route в app только прокидывает view
// src/app/(main)/page.tsx
import { HomePage } from '@/views/Home';

export default HomePage;
```

```tsx
// ❌ неправильно: не кладем page-level UI и логику прямо в src/app/(main)/page.tsx
export default function Page() {
  const [open, setOpen] = useState(false);
  return <section>...</section>;
}
```

## Слои и правила

### `app`

Что хранить:

- `layout.tsx`, `page.tsx`, `route.ts`
- route groups: `src/app/(main)`, `src/app/(auth)`
- провайдеры: `src/app/providers/StoreProvider.tsx`
- store: `src/app/store/store.ts`
- глобальные стили: `src/app/styles/*`

Что не хранить:

- бизнес-логику фич
- бизнес-компоненты уровня `feature/entity/widget`
- повторно используемые UI-компоненты

Примеры размещения:

- `src/app/layout.tsx`
- `src/app/(main)/layout.tsx`
- `src/app/api/coins/search/route.ts`

### `pages` (`views`)

Что хранить:

- компонент страницы
- композицию секций страницы
- связывание `widgets/features/entities` под конкретный маршрут

Что не хранить:

- универсальные виджеты
- бизнес-модель
- общий UI

Примеры размещения:

- `src/views/Home/ui/HomePage.tsx`
- `src/views/Register/ui/RegisterPage.tsx`

```tsx
// ✅ правильно: view собирает страницу из нижних слоев
import { RegisterForm } from '@/features/auth';

export const RegisterPage = () => {
  return (
    <section>
      <RegisterForm />
    </section>
  );
};
```

```tsx
// ❌ неправильно: view не должна содержать общий layout-хелпер или базовый input
export const RegisterPage = () => {
  return <input />;
};
```

### `widgets`

Что хранить:

- крупные самостоятельные блоки страницы
- блоки, которые могут переиспользоваться между разными `views`

Что не хранить:

- атомарный UI
- сущность данных
- узкую пользовательскую операцию

Примеры размещения:

- `src/widgets/Header`
- `src/widgets/Footer`

```tsx
// ✅ правильно: widget собирает feature и shared
import { ModalSearch } from '@/features/modal-search';
import { Button, Icon } from '@/shared/ui';
```

```tsx
// ❌ неправильно: не выносим в widgets то, что живет только внутри одной страницы
// Page-only секции держим в src/views/<Page>/ui/sections
```

### `features`

Что хранить:

- законченное пользовательское действие
- форму, модалку, переключение состояния, favorites, search
- server action для конкретного сценария

Что не хранить:

- общие кнопки/инпуты
- доменные сущности
- композицию всей страницы

Примеры размещения:

- `src/features/auth`
- `src/features/modal-search`
- `src/features/favorite-coins`

```tsx
// ✅ правильно: feature инкапсулирует use-case
import { useRegisterForm } from '../../model/useRegisterForm';
```

```tsx
// ❌ неправильно: feature не должна становиться storage для доменных типов всего приложения
type Coin = { id: string };
```

### `entities`

Что хранить:

- доменную сущность
- типы, схемы, API и UI вокруг одной сущности
- форматтеры и нормализацию данных сущности

Что не хранить:

- форму регистрации
- page sections
- глобальные утилиты

Примеры размещения:

- `src/entities/coin/api/coinApi.ts`
- `src/entities/coin/model/schemas.ts`
- `src/entities/coin/ui/CoinRow/CoinRow.tsx`

```ts
// ✅ правильно: entity владеет схемой и API сущности
export const coinSchema = z.object({
  id: z.string(),
  name: z.string(),
});
```

```ts
// ❌ неправильно: entity не знает про форму регистрации или layout страницы
export const registerSchema = z.object({ ... });
```

### `shared`

Что хранить:

- базовый UI
- конфиги
- generic hooks
- форматтеры
- base API
- общие style tokens

Что не хранить:

- `auth`, `coin`, `favorite`, `transaction`
- route-specific layout
- пользовательские сценарии

Примеры именования:

- `src/shared/ui`
- `src/shared/lib`
- `src/shared/config`
- `src/shared/api/baseApi.ts`
- `src/shared/styles`

```tsx
// ✅ правильно: shared/ui не знает бизнес-контекст
export const Input = ({ error, isValid, ...props }: InputProps) => { ... };
```

```tsx
// ❌ неправильно: shared/ui не должен импортировать feature/entity
import { RegisterForm } from '@/features/auth';
```

## Правило зависимостей слоев

| Откуда     | Можно импортировать                                  |
| ---------- | ---------------------------------------------------- |
| `app`      | `views`, `widgets`, `features`, `entities`, `shared` |
| `views`    | `widgets`, `features`, `entities`, `shared`          |
| `widgets`  | `features`, `entities`, `shared`                     |
| `features` | `entities`, `shared`                                 |
| `entities` | `shared`                                             |
| `shared`   | только `shared`                                      |

## Примеры зависимостей

```tsx
// ✅ views -> features
// src/views/Register/ui/RegisterPage.tsx
import { RegisterForm } from '@/features/auth';
```

```tsx
// ✅ widgets -> features
// src/widgets/Header/ui/UtilityActions/UtilityActions.client.tsx
import { ModalSearch } from '@/features/modal-search';
```

```ts
// ✅ features -> entities
// src/features/modal-search/model/useModalSearchCoins.ts
import { useGetSearchCoinsQuery, useGetTopSearchQuery } from '@/entities/coin';
```

```ts
// ✅ entities -> shared
// src/entities/coin/api/coinApi.ts
import { baseApi } from '@/shared/api';
import { validateWithZod } from '@/shared/lib';
```

```tsx
// ❌ неправильно: feature не импортирует widget
import { Header } from '@/widgets/Header';
```

```tsx
// ❌ неправильно: entity не импортирует feature
import { RegisterForm } from '@/features/auth';
```

## Как раскладывать экран из Figma

Пример для будущего dashboard-screen из макета:

```text
views/Dashboard
├── ui/DashboardPage.tsx
widgets/
├── Sidebar
├── AccountOverview
├── TransactionHistory
features/
├── favorite-coins
├── change-language
entities/
├── coin
├── transaction
shared/
├── ui/Button
├── ui/Table
```

Правило:

- если блок живет только на одной странице, оставляем его внутри `views/<Page>/ui/sections`
- если блок нужен нескольким страницам, поднимаем в `widgets`
- если блок описывает действие пользователя, кладем в `features`
- если блок описывает доменный объект, кладем в `entities`

</details>

<details>
<summary><strong>2. Слайсы, сегменты и public API</strong></summary>

## Разрешенные сегменты внутри слайса

Для новых слайсов используем только этот набор имен:

```text
ui/
model/
api/
lib/
config/
consts/
index.ts
```

Правило:

- не создаем пустые папки
- если сегмент не нужен, его нет
- если сегмент нужен, называем его только так, без `helpers`, `services`, `store`, `data`, `utils2`

Примеры структуры:

- `features/auth/{ui,model,api}`
- `entities/coin/{ui,model,api,lib}`
- `widgets/Header/{ui,model}`

## Что хранить в каждом сегменте

### `ui/`

Компоненты и их `*.module.scss`.

```text
features/auth/ui/RegisterForm/RegisterForm.client.tsx
features/auth/ui/RegisterForm/RegisterForm.module.scss
```

### `model/`

State, selectors, hooks, schemas, types.

```text
features/auth/model/useRegisterForm.ts
features/auth/model/auth.schemas.ts
features/favorite-coins/model/favoriteCoinsSlice.ts
entities/coin/model/schemas.ts
```

### `api/`

Запросы, server actions, RTK Query endpoints, обертки над Supabase.

```text
features/auth/api/authAction.server.ts
entities/coin/api/coinApi.ts
entities/coin/api/getTrendCoin.ts
```

### `lib/`

Чистые функции без React и без состояния.

```text
entities/coin/lib/formatPriceChange.ts
entities/coin/lib/normalizeNestedResponse.ts
```

### `config/`

Конфиг слайса, флаги, мапы, локальные маршруты.

Если внутри слайса нужен конфиг, используй только сегмент `config/`.

### `consts/`

Константы, которые используются несколькими файлами слайса.

Если константа нужна только subtree, держи `constants.ts` рядом с компонентом:

- `features/auth/ui/RegisterForm/constants.ts`
- `views/Home/ui/sections/Trending/constants.ts`

Правило:

- если константа нужна только одному компоненту или subtree, оставляем рядом `constants.ts`
- если константа нужна нескольким файлам слайса, переносим в `consts/`

```ts
// ✅ правильно: константа для одного subtree лежит рядом
// src/features/auth/ui/RegisterForm/constants.ts
export const REGISTER_FORM_CONTENT = { ... } as const;
```

```ts
// ❌ неправильно: одноразовую константу не выносим в shared/config
export const REGISTER_PAGE_FIELD_PLACEHOLDERS = ['Name', 'Surname'];
```

## Public API через `index.ts`

Создаем `index.ts`, если слайс импортируется снаружи.

Примеры public API:

- `src/views/Home/index.ts`
- `src/views/Register/index.ts`
- `src/widgets/Header/index.ts`
- `src/widgets/Footer/index.ts`
- `src/features/auth/index.ts`
- `src/features/modal-search/index.ts`
- `src/features/favorite-coins/index.ts`
- `src/entities/coin/index.ts`
- `src/shared/ui/index.ts`
- `src/shared/lib/index.ts`
- `src/shared/lib/hooks/index.ts`
- `src/shared/config/index.ts`

Правила:

- `index.ts` содержит только явные реэкспорты
- `export *` не используем
- business-логики в `index.ts` нет
- внешние слои импортируют только через public API
- внутри своего слайса импортируем относительными путями, не через собственный `index.ts`

```ts
// ✅ правильно
// src/features/auth/index.ts
export { RegisterForm } from './ui/RegisterForm/RegisterForm.client';
```

```ts
// ✅ правильно: внутри слайса работаем относительными путями
import { registerSchema } from './auth.schemas';
import { authAction } from '../api/authAction.server';
```

```ts
// ❌ неправильно: deep import в чужой слайс
import { RegisterForm } from '@/features/auth/ui/RegisterForm/RegisterForm.client';
```

```ts
// ❌ неправильно: self-import через свой же public API
import { formatPriceChange } from '@/entities/coin';
```

## Внутренние подпапки в `ui/`

Разрешены, если компонент состоит из изолированных частей.

Примеры вложенной структуры:

- `views/Home/ui/sections/Hero/components/Stats`
- `views/Home/ui/sections/Faq/components/FaqAccordion.client.tsx`
- `features/modal-search/ui/components/ModalSearchCoinItem`

Правило:

- подпапки `components/` допустимы только внутри `ui/`
- если подкомпонент нужен только родителю, наружу его не экспортируем

</details>

<details>
<summary><strong>3. Next.js App Router в связке с FSD</strong></summary>

## Что живет в `src/app`

Только entrypoint-уровень:

- `layout.tsx`
- `page.tsx`
- `route.ts`
- route groups
- providers
- store setup
- global styles

## Что живет вне `src/app`

Весь FSD UI и логика:

- `views`
- `widgets`
- `features`
- `entities`
- `shared`

## Тонкие `page.tsx`

`page.tsx` и `layout.tsx` оставляем минимальными.

```tsx
// ✅ правильно
import { RegisterPage } from '@/views/Register';

export default RegisterPage;
```

```tsx
// ❌ неправильно
import { useState } from 'react';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  return <section>...</section>;
}
```

## `layout.tsx`

`layout.tsx` отвечает за общий каркас маршрута.

Примеры размещения:

- `src/app/layout.tsx`
- `src/app/(main)/layout.tsx`
- `src/app/(auth)/layout.tsx`

```tsx
// ✅ правильно: layout собирает общую рамку
import { Footer } from '@/widgets/Footer';
import { Header } from '@/widgets/Header';
```

```tsx
// ❌ неправильно: layout не занимается логикой формы/поиска/валидацией
import { useRegisterForm } from '@/features/auth/model/useRegisterForm';
```

## Route Groups

Используем route groups только для разного layout-поведения, а не как FSD-слой.

Пример структуры:

- `src/app/(main)`
- `src/app/(auth)`

```text
app/(main)   -> Header + Footer
app/(auth)   -> auth background + form shell
```

## Client / Server файлы

Правило:

- интерактивный компонент: `.client.tsx` + `'use client'`
- server action: `.server.ts` + `'use server'`
- если интерактивности нет, компонент остается server component по умолчанию

Примеры именования:

- `features/auth/ui/RegisterForm/RegisterForm.client.tsx`
- `features/modal-search/ui/ModalSearch.client.tsx`
- `widgets/Header/ui/NavMenu/NavMenu.client.tsx`
- `features/auth/api/authAction.server.ts`
- `views/Home/ui/sections/Trending/components/TrendTableBody/TrendTableBody.tsx` — async server component без `'use client'`

```tsx
// ✅ правильно
'use client';

export const ModalSearch = () => {
  const [searchValue, setSearchValue] = useState('');
  return <div>...</div>;
};
```

```ts
// ✅ правильно
'use server';

export const authAction = async (...) => {
  ...
};
```

```tsx
// ❌ неправильно: не ставим 'use client' на весь page/layout без причины
'use client';

export default function Page() {
  return <section>Static content</section>;
}
```

## Route Handlers

Route handlers живут только в `src/app/api/**/route.ts`.

Примеры размещения:

- `src/app/api/coins/search/route.ts`
- `src/app/api/coins/search/trending/route.ts`

Правило:

- в route handler держим transport и secret-dependent вызовы
- нормализацию и преобразование данных держим ниже, в slice `api/lib/model`

```ts
// ✅ правильно: route handler работает как BFF
const res = await fetch(`${COIN_GECKO_API_URL}/search/trending`, {
  headers: {
    'x-cg-demo-api-key': process.env.COINGECKO_API_KEY!,
  },
});
```

```ts
// ❌ неправильно: не используем process.env с секретами в client component
const key = process.env.COINGECKO_API_KEY;
```

</details>

<details>
<summary><strong>4. Импорты: порядок, абсолютные пути, запреты</strong></summary>

## Порядок групп

Порядок сверху вниз:

1. `react`, `next`
2. внешние библиотеки
3. FSD-слои сверху вниз: `@/app` → `@/views` → `@/widgets` → `@/features` → `@/entities` → `@/shared`
4. относительные импорты внутри текущего слайса
5. стили

Важно:

- для нижних слоев верхние группы должны просто отсутствовать
- если файл в `features`, у него не должно быть `@/widgets`, `@/views`, `@/app`

```tsx
// ✅ правильно
import { useCallback, useState } from 'react';
import { getInputProps } from '@conform-to/react';

import { PATHS } from '@/shared/config';
import { AuthFormLayout, Checkbox, Input, InputPassword } from '@/shared/ui';

import { useRegisterForm } from '../../model/useRegisterForm';
import { REGISTER_FORM_CONTENT, REGISTER_FORM_FIELDS } from './constants';

import styles from './RegisterForm.module.scss';
```

```tsx
// ❌ неправильно
import styles from './RegisterForm.module.scss';
import { useRegisterForm } from '../../model/useRegisterForm';
import { Input } from '@/shared/ui';
import { useState } from 'react';
```

## Абсолютные и относительные импорты

Правило:

- между слайсами: только абсолютный импорт через `@/`
- внутри своего слайса: только относительный импорт

```tsx
// ✅ правильно: между слоями
import { RegisterForm } from '@/features/auth';
```

```tsx
// ✅ правильно: внутри слайса
import { authAction } from '../api/authAction.server';
import { registerSchema } from './auth.schemas';
```

```tsx
// ❌ неправильно: deep import в чужой слайс
import { useRegisterForm } from '@/features/auth/model/useRegisterForm';
```

```tsx
// ❌ неправильно: импорт через alias внутрь самого себя
import { CoinRow } from '@/entities/coin/ui/CoinRow/CoinRow';
```

## `import type`

При `verbatimModuleSyntax: true` типы импортируем через `import type`.

```ts
// ✅ правильно
import type { SearchCoin } from '../model/search.types';
```

```ts
// ❌ неправильно
import { SearchCoin } from '../model/search.types';
```

## Что запрещено

Запрещено:

- импортировать чужой internal-файл мимо `index.ts`
- импортировать соседний слайс того же слоя
- импортировать `@/app/*` из `views/widgets/features/entities/shared`

```ts
// ❌ feature -> feature
import { toggleFavorite } from '@/features/favorite-coins/model/favoriteCoinsSlice';
```

```ts
// ❌ views -> app
import { makeStore } from '@/app/store/store';
```

```ts
// ✅ правильно: outside slice only through public API
import { toggleFavorite } from '@/features/favorite-coins';
```

</details>

<details>
<summary><strong>5. Redux Toolkit и store</strong></summary>

## Базовая структура Redux

```text
src/app/store/store.ts
src/app/providers/StoreProvider.tsx
src/shared/api/baseApi.ts
src/shared/lib/hooks/useAppDispatch.ts
src/shared/lib/hooks/useAppSelector.ts
src/features/favorite-coins/model/favoriteCoinsSlice.ts
src/entities/coin/api/coinApi.ts
```

## Где что хранить

- корневой store: `src/app/store/store.ts`
- Redux provider: `src/app/providers/StoreProvider.tsx`
- typed hooks: `src/shared/lib/hooks`
- RTK Query base API: `src/shared/api/baseApi.ts`
- reducer/slice/selectors/thunks владельца сценария: `features/<slice>/model/*`
- RTK Query endpoints владельца домена: `entities/<slice>/api/*` или `features/<slice>/api/*`

## Store

```ts
// ✅ правильно: корневой store только собирает reducers и middleware
import { baseApi } from '@/shared/api';
import { favoriteCoinsReducer } from '@/features/favorite-coins';
import { configureStore } from '@reduxjs/toolkit';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      favoriteCoins: favoriteCoinsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
};
```

```ts
// ❌ неправильно: store не должен содержать логику feature/entity
export const makeStore = () => {
  const initialFavoriteIds = JSON.parse(localStorage.getItem('favorites') ?? '[]');
  ...
};
```

## StoreProvider

`StoreProvider` держим только в `app/providers`.  
Store создаем один раз через `useRef`.

```tsx
// ✅ правильно
'use client';

const storeRef = useRef<AppStore | null>(null);

if (!storeRef.current) {
  storeRef.current = makeStore();
}
```

## Typed hooks

В компонентах используем `useAppDispatch` и `useAppSelector`, а не сырые `useDispatch/useSelector`.

```ts
// ✅ правильно
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks';
```

```ts
// ❌ неправильно
import { useDispatch, useSelector } from 'react-redux';
```

## `createSlice`

Пример размещения: `src/features/favorite-coins/model/favoriteCoinsSlice.ts`

Правила:

- slice живет у владельца сценария или сущности, не в `app`
- имя slice совпадает с областью состояния
- наружу экспортируем reducer, actions, selectors
- файл называем `<sliceName>Slice.ts`

```ts
// ✅ правильно
export const favoriteCoinsSlice = createSlice({
  name: 'favoriteCoins',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.favoriteIds.includes(action.payload)) {
        state.favoriteIds.push(action.payload);
      }
    },
  },
});
```

```ts
// ❌ неправильно
export const globalSlice = createSlice({
  name: 'store',
  reducers: { ... },
});
```

## Рекомендуемая структура `model/` для Redux-слайса

```text
model/
├── favoriteCoinsSlice.ts
├── selectors.ts
├── thunks.ts
└── types.ts
```

Если файл один и slice простой, достаточно `favoriteCoinsSlice.ts`.  
Если логика растет, выносим `selectors.ts`, `thunks.ts`, `types.ts`.

## RTK Query

RTK Query используй как основной слой server-state:

- `src/shared/api/baseApi.ts`
- `src/entities/coin/api/coinApi.ts`

Правила:

- один `baseApi` на один base URL
- endpoints инжектим в owning slice через `baseApi.injectEndpoints`
- response валидируем/нормализуем в `transformResponse`

```ts
// ✅ правильно
export const coinApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTopSearch: build.query<SearchCoin[], void>({
      query: () => '/coins/search/trending',
      transformResponse: (response: unknown) => {
        return normalizeNestedResponse(
          validateWithZod(coinTopSearchSchema, response),
        );
      },
    }),
  }),
});
```

```ts
// ❌ неправильно: не держим все доменные endpoints в shared/api/baseApi.ts
export const baseApi = createApi({
  endpoints: (build) => ({
    getCoins: build.query(...),
    registerUser: build.mutation(...),
    getNotifications: build.query(...),
  }),
});
```

## Когда RTK Query, а когда `createAsyncThunk`

Используем `RTK Query`, если:

- нужен кэш и дедупликация запросов
- есть `loading/error/success` server-state
- данные читаются списком или по id
- нужен `refetch`, `skip`, `polling`, `focus/reconnect`

Примеры:

- `useGetTopSearchQuery`
- `useGetSearchCoinsQuery`

Используем `createAsyncThunk`, если:

- нужно оркестрировать несколько dispatch подряд
- есть зависимость от текущего state
- операция не сводится к server-state cache
- есть сайд-эффекты после запроса: redirect, toast, local persistence

Важно:

- form-submit в App Router не тянем в thunk автоматически
- если сценарий естественно решается server action, используем server action
- пример server action: `features/auth/api/authAction.server.ts`

```ts
// ✅ RTK Query
const { data, status, refetch } = useGetSearchCoinsQuery(query, {
  skip: !query,
});
```

```ts
// ✅ createAsyncThunk подходит для будущего multi-step сценария
export const syncFavoriteCoins = createAsyncThunk(
  'favoriteCoins/sync',
  async (_, { getState, dispatch }) => {
    ...
  },
);
```

```ts
// ❌ неправильно: использовать createAsyncThunk для каждой GET-таблицы без причины
export const fetchCoins = createAsyncThunk('coin/fetchCoins', async () => {
  const res = await fetch('/api/coins');
  return res.json();
});
```

</details>

<details>
<summary><strong>6. Zod: схемы, имена, переиспользование</strong></summary>

## Где хранить схемы

Схемы живут в `model/` владельца данных:

- form schema: `src/features/auth/model/auth.schemas.ts`
- entity schema: `src/entities/coin/model/schemas.ts`

Не кладем схемы:

- в `ui/`
- в `app/`
- в `shared`, если схема доменная

```ts
// ✅ правильно
// src/features/auth/model/auth.schemas.ts
export const registerSchema = z.object({ ... });
```

```tsx
// ❌ неправильно
// src/features/auth/ui/RegisterForm/RegisterForm.client.tsx
const registerSchema = z.object({ ... });
```

## Именование

Правила:

- schema-константы: `camelCase + Schema`
- response schema: `camelCase + ResponseSchema`
- TS типы из схем: `PascalCase`

Примеры переиспользования:

- `registerSchema`
- `coinSchema`
- `coinsTrendResponseSchema`
- `CoinsSearchResponse`
- `Coin`

```ts
// ✅ правильно
export const coinSchema = z.object({ ... });
export const coinsTrendResponseSchema = z.array(coinSchema);
export type Coin = z.infer<typeof coinSchema>;
```

```ts
// ❌ неправильно
export const CoinSchema = z.object({ ... });
export type coin = z.infer<typeof CoinSchema>;
```

## Переиспользование схем

Один источник истины:

- форма регистрации валидируется одной схемой и на клиенте, и на сервере
- `coinSchema` используй как базу через `pick`/`extend`

Примеры:

- `registerSchema` используй и в `useRegisterForm.ts`, и в `authAction.server.ts`
- `coinTopSearchSchema` собирай через `coinSchema.pick(...).extend(...)`

```ts
// ✅ правильно
const submission = parseWithZod(formData, { schema: registerSchema });
```

```ts
// ❌ неправильно: не дублируем правила в двух местах
const clientPasswordRule = /.{8,}/;
const serverPasswordRule = /.{10,}/;
```

## Как валидировать данные

### Формы

Используем `parseWithZod` рядом с `Conform` и server action.

```ts
// ✅ правильно
onValidate({ formData }) {
  return parseWithZod(formData, { schema: registerSchema });
}
```

### Внешний API

Используем `validateWithZod` перед тем, как отдать данные в UI.

```ts
// ✅ правильно
return validateWithZod(coinsTrendResponseSchema, data);
```

```ts
// ❌ неправильно
const data = await response.json();
return data as Coin[];
```

## Где держать типы

Правило:

- тип нужен только рядом со схемой -> `export type X = z.infer<typeof xSchema>`
- тип нужен UI после нормализации -> отдельный `types.ts` рядом, как `SearchCoin`

Пример размещения:

- `entities/coin/model/search.types.ts`

</details>

<details>
<summary><strong>7. API-слой, route handlers и Supabase</strong></summary>

## Базовый API-паттерн

Разделяй API на три уровня:

1. `src/app/api/**/route.ts`  
   BFF и место для secret-dependent логики.

2. `src/shared/api/baseApi.ts`  
   базовый transport для RTK Query.

3. `src/entities/*/api` и `src/features/*/api`  
   доменные API-функции и endpoints.

Примеры размещения:

- `src/app/api/coins/search/route.ts`
- `src/app/api/coins/search/trending/route.ts`
- `src/entities/coin/api/coinApi.ts`
- `src/entities/coin/api/getTrendCoin.ts`
- `src/features/auth/api/authAction.server.ts`

## Правила организации API-функций

### `shared/api`

Что здесь:

- `baseApi`
- фабрики клиентов
- общий transport

Чего здесь не должно быть:

- таблиц Supabase
- `auth`, `coin`, `favorite`, `transaction`

```ts
// ✅ правильно
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: () => ({}),
});
```

```ts
// ❌ неправильно
export const getFavoriteCoins = async () => { ... };
```

### `entities/<slice>/api`

Что здесь:

- запросы к API сущности
- RTK Query endpoints сущности
- адаптация response в shape сущности

Пример:

- `src/entities/coin/api/coinApi.ts`
- `src/entities/coin/api/getTrendCoin.ts`

### `features/<slice>/api`

Что здесь:

- сценарные запросы
- server actions
- write-операции, относящиеся к user flow

Пример:

- `src/features/auth/api/authAction.server.ts`

## Секреты и серверный доступ

Правило:

- `COINGECKO_API_KEY` держи только в `route.ts`
- в client code секретов быть не должно

То же правило для Supabase:

- `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` можно использовать в browser client
- service role keys только на сервере

```ts
// ✅ правильно
const headers = {
  'x-cg-demo-api-key': process.env.COINGECKO_API_KEY!,
};
```

```ts
// ❌ неправильно
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
```

## Supabase: стандарт размещения

Для Supabase используй такую схему:

```text
src/shared/api/supabase/
├── browser.ts
├── server.ts
└── index.ts
```

### Browser client

```ts
// ✅ правильно
// src/shared/api/supabase/browser.ts
import { createBrowserClient } from '@supabase/ssr';

export const createSupabaseBrowserClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
};
```

### Server client

Этот клиент используем только в `route.ts`, server actions и server-only API-функциях.

```ts
// ✅ правильно
// src/features/auth/api/signUpWithSupabase.server.ts
'use server';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';

export const signUpWithSupabase = async (email: string, password: string) => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw new Error(error.message);
  }
};
```

### Где хранить запрос к таблице

```ts
// ✅ правильно: запрос живет у владельца домена
// src/entities/transaction/api/getTransactions.ts
import { createSupabaseServerClient } from '@/shared/api/supabase/server';

export const getTransactions = async () => {
  const supabase = await createSupabaseServerClient();
  return supabase.from('transactions').select('*');
};
```

```tsx
// ❌ неправильно: не ходим в Supabase прямо из компонента
export const TransactionTable = () => {
  const supabase = createSupabaseBrowserClient();
  ...
};
```

## Когда нужен `app/api`, а когда можно без него

Используем `app/api`, если:

- нужен секрет
- нужно спрятать внешний API от клиента
- нужно нормализовать внешний response для RTK Query

Можно обойтись без `app/api`, если:

- код выполняется только на сервере
- секрет не нужен
- функция уже лежит в `entities/*/api` или `features/*/api`

Пример:

- BFF-вариант: `coinApi.ts` работает через `/api/coins/search`
- server-only вариант: `getTrendCoin.ts` делает прямой fetch на сервере

</details>

<details>
<summary><strong>8. Код-стайл и TypeScript</strong></summary>

## Что входит в code style

Этот раздел фиксирует правила для:

- именования файлов и сущностей
- типизации TypeScript
- порядка внутри компонента
- лимитов размера файлов и функций
- правил экспорта

## Именование файлов и папок

| Что                             | Формат                          | Примеры                                             |
| ------------------------------- | ------------------------------- | --------------------------------------------------- |
| `views`, `widgets` root folders | `PascalCase`                    | `Home`, `Register`, `Header`, `Footer`              |
| `features`, `entities` slices   | `kebab-case` или lowercase      | `auth`, `modal-search`, `favorite-coins`, `coin`    |
| компонент                       | `PascalCase.tsx`                | `Header.tsx`, `RegisterPage.tsx`, `CoinRow.tsx`     |
| client component                | `PascalCase.client.tsx`         | `RegisterForm.client.tsx`, `ModalSearch.client.tsx` |
| server action                   | `camelCase.server.ts`           | `authAction.server.ts`                              |
| schema file                     | `*.schemas.ts` или `schemas.ts` | `auth.schemas.ts`, `schemas.ts`                     |
| types file                      | `types.ts` / `*.types.ts`       | `types.ts`, `Button.types.ts`, `Icon.types.ts`      |
| config file                     | `*.config.ts`                   | `paths.config.ts`, `coin-gecko.config.ts`           |
| constants file                  | `constants.ts`                  | `features/auth/ui/RegisterForm/constants.ts`        |
| SCSS module                     | `PascalCase.module.scss`        | `Header.module.scss`, `CoinRow.module.scss`         |

## Именование в коде

| Сущность     | Формат                                                             | Примеры                                                 |
| ------------ | ------------------------------------------------------------------ | ------------------------------------------------------- |
| компонент    | `PascalCase`                                                       | `RegisterForm`, `CoinRow`, `HeaderNavMenu`              |
| hook         | `useSomething`                                                     | `useRegisterForm`, `useModalSearchCoins`, `useDebounce` |
| slice        | `camelCaseSlice`                                                   | `favoriteCoinsSlice`                                    |
| reducer key  | `camelCase`                                                        | `favoriteCoins`                                         |
| schema       | `camelCaseSchema`                                                  | `registerSchema`, `coinSchema`                          |
| config const | `UPPER_SNAKE_CASE` для true constants, `camelCase` для object maps | `COIN_GECKO_API_URL`, `PATHS`, `EXTERNAL_LINKS`         |
| SCSS class   | `kebab-case`                                                       | `button-toggle`, `input-wrapper`, `logo-link`           |

## `type` vs `interface`

Правило:

- `interface` для расширяемых object-contracts и HTML props
- `type` для union/intersection/Omit/alias/локальных пропсов без расширения

Примеры:

- `interface NavMenuProps`
- `interface IconProps extends React.SVGProps<SVGSVGElement>`
- `type InputPasswordProps = Omit<...>`
- `type SearchCoin = { ... }`

```ts
// ✅ interface: нужен extends
interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
}
```

```ts
// ✅ type: нужен union/intersection/Omit
type InputPasswordProps = Omit<ComponentProps<typeof Input>, 'icon' | 'type'>;
```

```ts
// ❌ неправильно: не используем any как shortcut
type SearchCoin = any;
```

## Правила типизации

Обязательно:

- `strict: true`
- без `any`
- вместо `any` используем `unknown` + narrowing
- для type-only import используем `import type`
- внешние response сначала валидируем Zod, потом типизируем
- для констант-массивов используем `as const` и `satisfies`, если это улучшает проверку

Пример:

```ts
// ✅ правильно
export const REGISTER_FORM_FIELDS = [
  ...
] as const satisfies readonly RegisterFormField[];
```

```ts
// ❌ неправильно
export const REGISTER_FORM_FIELDS = [...] as RegisterFormField[];
```

## Порядок внутри файла компонента

Порядок:

1. импорты
2. локальные `type/interface`
3. локальные `const`
4. `export const Component = (...) => {`
5. hooks / selectors / state
6. derived values
7. handlers / helpers
8. early returns
9. JSX

```tsx
// ✅ правильно
import { useState } from 'react';
import styles from './Component.module.scss';

type ComponentProps = {
  title: string;
};

export const Component = ({ title }: ComponentProps) => {
  const [open, setOpen] = useState(false);
  const buttonLabel = open ? 'Close' : 'Open';

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <section className={styles['component']}>
      <button onClick={handleToggle}>{buttonLabel}</button>
      <h2>{title}</h2>
    </section>
  );
};
```

```tsx
// ❌ неправильно
export const Component = ({ title }: any) => {
  function helper() {}
  import styles from './Component.module.scss';
  return <div>{title}</div>;
};
```

## Лимиты размера

Это обязательные лимиты команды.

| Что                           | Лимит                         | Что делать после лимита                              |
| ----------------------------- | ----------------------------- | ---------------------------------------------------- |
| компонентный файл             | до `120` строк                | выносить subcomponents/hooks/helpers                 |
| одна функция / handler / hook | до `40` строк                 | резать на чистые функции                             |
| сложный page/widget component | до `80` строк реальной логики | выносить `model/` и `ui/components`                  |
| `*.module.scss`               | до `150` строк                | делить на subcomponents или выносить повтор в shared |

Почему так:

- после `120` строк компонент обычно начинает смешивать UI, логику и подготовку данных
- после `150` строк `*.module.scss` начинает плохо читаться и мешает декомпозиции

```tsx
// ✅ правильно: логику формы вынесли в hook
const { form, fields, isPending } = useRegisterForm();
```

```tsx
// ❌ неправильно: держать fetch, schema.parse и 5 handlers в одном page component
export const BigPage = () => {
  ...
};
```

## Экспорты

Правило:

- все компоненты, hooks, utils — named export
- `default export` только у Next entrypoints: `page.tsx`, `layout.tsx`

```tsx
// ✅ правильно
export const Footer = () => { ... };
```

```tsx
// ❌ неправильно
export default const Footer = () => { ... };
```

</details>

<details>
<summary><strong>9. Компоненты, бизнес-логика и переиспользование</strong></summary>

## Бизнес-логика не живет в JSX

UI-компонент:

- рендерит
- связывает props
- вызывает hooks/handlers

Бизнес-логика:

- живет в `model/`
- живет в `api/`
- живет в `lib/`

Примеры декомпозиции:

- `RegisterForm.client.tsx` -> `useRegisterForm.ts`
- `ModalSearch.client.tsx` -> `useModalSearchCoins.ts`
- `CoinRow.tsx` -> `formatPriceChange.ts`, `formatCurrency.ts`

```tsx
// ✅ правильно
const { form, fields, isPending, isReadyToSubmit } = useRegisterForm();
```

```tsx
// ❌ неправильно
export const RegisterForm = () => {
  const registerSchema = z.object({ ... });
  const validate = () => schema.parse(...);
  const createSupabaseClient = () => ...;
  ...
};
```

## Когда поднимать код выше

### Оставляем внутри `views`

Если блок используется только на одной странице.

Примеры:

- `views/Home/ui/sections/Hero`
- `views/Home/ui/sections/Features`
- `views/Home/ui/sections/Faq`

### Поднимаем в `widgets`

Если блок нужен нескольким страницам или это page-level shell.

Примеры:

- `widgets/Header`
- `widgets/Footer`

### Поднимаем в `shared/ui`

Если блок не знает бизнес-контекст.

Примеры:

- `Button`
- `Input`
- `Checkbox`
- `Table`
- `Accordion`

### Оставляем в `features`

Если компонент сам по себе и есть user action.

Примеры:

- `RegisterForm`
- `ModalSearch`
- `FavoriteCoinsList`

## Реюз: краткое правило выбора слоя

```text
Один маршрут и не переиспользуется -> views
Нужен нескольким страницам -> widgets
Описывает действие пользователя -> features
Описывает доменную сущность -> entities
Не знает про бизнес -> shared
```

## React-правила

Правила:

- не ставим `'use client'` без интерактивности
- не тащим `useState/useEffect` в server component
- не используем `memo/useCallback` по привычке
- используем их только там, где есть понятная причина

Не оборачивай все подряд в `memo` и `useCallback`.  
Оптимизацию добавляй только когда она решает конкретную проблему: стабилизацию пропса, expensive render или зависимость эффекта.

```tsx
// ✅ правильно
const handleSelect = useCallback(
  (id: string) => {
    onSelect(id);
  },
  [onSelect],
);
```

```tsx
// ❌ неправильно
const title = useMemo(() => 'Market', []);
```

</details>

<details>
<summary><strong>10. Стили и SCSS Modules</strong></summary>

## Глобальные стили

Глобальные стили живут только в `src/app/styles`.

Примеры файлов:

- `globals.scss`
- `normalize.scss`
- `container.scss`
- `visually-hidden.scss`

Разрешенные глобальные utility-классы:

- `.container`
- `.visually-hidden`
- `.highlight`

Правило:

- новый глобальный класс добавляем только если он реально нужен всему приложению
- все остальное — `*.module.scss`

```scss
// ✅ правильно
// src/app/styles/globals.scss
.highlight {
  color: $primary;
}
```

```scss
// ❌ неправильно: не выносим page-specific стили в globals
.register-page {
  margin-top: 80px;
}
```

## SCSS Modules

Каждый компонент хранит стили рядом с собой.

```text
Header.tsx
Header.module.scss
```

Основной паттерн:

- классы называются в `kebab-case`
- доступ из TSX через `styles['class-name']`

```tsx
// ✅ правильно
<div className={styles['input-wrapper']}>
```

```tsx
// ❌ неправильно: не смешиваем два способа именования без причины
<div className={styles.inputWrapper}>
```

## Токены и функции

Общие токены и функции берем из `src/shared/styles/_index.scss`.

Примеры путей:

- `src/shared/styles/variables/_colors.scss`
- `src/shared/styles/functions/_rem.scss`

Для нового кода используем alias-import, а не относительные подъемы.

```scss
// ✅ правильно
@use '@/shared/styles/index.scss' as *;

.button {
  border-radius: rem($radius-xl);
  color: $neutral-title;
}
```

```scss
// ❌ неправильно
.button {
  border-radius: 24px;
  color: #f5f5f5;
}
```

## Правила для модулей

Правила:

- один корневой block-class на компонент
- состояния через modifier или вложенность `&-state`
- максимум 2 уровня вложенности в module styles
- `!important` запрещен
- не импортируем чужой `*.module.scss` из другого компонента
- не используем raw CSS variables, если токен уже есть в `shared/styles`

```scss
// ✅ правильно
.input {
  border: 1px solid transparent;

  &-error {
    border-color: $error-dark-1;
  }
}
```

```scss
// ❌ неправильно
.list {
  ul {
    li {
      button {
        color: red !important;
      }
    }
  }
}
```

## Inline styles

Не используем inline styles для верстки.  
Исключение: значения, которые естественно приходят как props, например `width`/`height` у `Icon` или `Loader`.

```tsx
// ✅ допустимо
<Icon name="search" width={16} height={16} />
```

```tsx
// ❌ неправильно
<div style={{ marginTop: 24, backgroundColor: '#141414' }} />
```

</details>

<details>
<summary><strong>11. Ошибки, состояние загрузки и правила качества</strong></summary>

## Ошибки и статусы

Каждый async UI должен явно обрабатывать:

- `loading`
- `error`
- `empty`
- `success`

Пример:

- `features/modal-search/ui/ModalSearch.client.tsx`

```tsx
// ✅ правильно
switch (status) {
  case 'pending':
    return <Loader ... />;
  case 'fulfilled':
    return <ul>...</ul>;
  case 'rejected':
    return <Button onClick={() => refetch()}>Retry</Button>;
}
```

```tsx
// ❌ неправильно
return <ul>{coins!.map(...)}</ul>;
```

## Где логировать ошибку

Правило:

- логируем на границе transport/server layer
- UI не занимается `console.error`, кроме truly unexpected client-only case
- после логирования ошибка либо пробрасывается выше, либо мапится в понятный UI-result

Примеры размещения:

- `src/entities/coin/api/getTrendCoin.ts`
- `src/app/api/coins/search/route.ts`
- `src/app/api/coins/search/trending/route.ts`

```ts
// ✅ правильно
if (!response.ok) {
  throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
}
```

```ts
// ✅ правильно
return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
```

```tsx
// ❌ неправильно
export const CoinTable = () => {
  try {
    ...
  } catch (error) {
    console.error(error);
    return null;
  }
};
```

## Чек перед PR

Локально должно проходить:

```bash
npm run lint
npm run typecheck
npm run build
```

Почему:

- pre-commit: `npm exec lint-staged`
- pre-push: `npm run check`
- CI: `lint`, `typecheck`, `build`

## Коммиты

Для commit message используй единый формат:

```text
feat(auth): add register form validation
fix(coin): handle empty trending response
refactor(header): move modal trigger into feature
docs(readme): update fsd standards
```

Правила:

- один commit = одна понятная задача
- не коммитим закомментированный код
- не коммитим `console.log`
- не коммитим мертвые файлы "на потом"

</details>

<details>
<summary><strong>12. Короткий чеклист для нового кода</strong></summary>

Перед тем как добавить файл, проверь:

1. Это route-level композиция? Тогда `views`.
2. Это reuse на несколько страниц? Тогда `widgets`.
3. Это действие пользователя? Тогда `features`.
4. Это доменная сущность? Тогда `entities`.
5. Это generic UI/lib/config? Тогда `shared`.

Перед тем как импортировать файл, проверь:

1. Я иду через `index.ts`, если это чужой слайс?
2. Я не импортирую слой выше?
3. Я использую относительный путь только внутри своего слайса?
4. Я вынес type-only import через `import type`?

Перед тем как писать async-код, проверь:

1. Это server-state с кэшем? Тогда RTK Query.
2. Это user flow с несколькими шагами? Тогда thunk или server action.
3. Это форма в App Router? Сначала подумай про server action.
4. Это внешний response? Сначала Zod, потом UI.

Перед тем как писать стили, проверь:

1. Это точно не global style?
2. Я беру токены из `shared/styles`?
3. У меня `kebab-case` классы?
4. Я не использую inline styles и `!important`?

</details>
